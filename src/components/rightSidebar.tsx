import { RefObject, useState } from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import { Event } from "../types/event";
import EventCard from "./right-sidebar/eventCard";
import TagFilter, { TagOption } from "./right-sidebar/tag";
import NotesDialog from "./right-sidebar/noteDialogue";

interface SidebarProps {
  events: Event[];
  filteredEvents: Event[];
  selectedEvent: Event | null;
  onSelectEvent: (event: Event) => void;
  map: RefObject<L.Map | null>;
  onTagsChange: (tags: TagOption[]) => void;
}

const RightSidebar = ({
  events,
  filteredEvents,
  selectedEvent,
  onSelectEvent,
  map,
  onTagsChange,
}: SidebarProps) => {
  const [openNotes, setOpenNotes] = useState(false);
  const [notes, setNotes] = useState<Event | null>(null);

  const uniqueTags = Array.from(
    new Set(events.flatMap((event) => event.tags || []))
  ).map((tag) => ({ label: tag, value: tag }));

  const handleNotes = (event: Event) => {
    setNotes(event);
    setOpenNotes(true);
  };

  const handleResetView = () => {
    if (map.current) {
      map.current.flyTo([51.505, -0.09], 3, { animate: true, duration: 1 });
    }
  };

  return (
    <Box
      className="right-sidebar"
      sx={{
        display: "grid",
        gridTemplateRows: "auto 1fr 80px",
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          Events
        </Typography>
        <TagFilter options={uniqueTags} onChange={onTagsChange} />
        <Divider sx={{ my: 1 }} />
      </Box>
      <Box
        sx={{
          overflowY: "auto",
          pr: 1,
          pt: 1,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        <Box component="ul" sx={{ m: 0 }}>
          {filteredEvents.map((event) => (
            <li key={event.id}>
              <EventCard
                event={event}
                onSelectEvent={onSelectEvent}
                handleNotes={handleNotes}
                isSelected={selectedEvent?.id === event.id}
              />
            </li>
          ))}
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleResetView}
        >
          Reset View
        </Button>
      </Box>

      {notes && (
        <NotesDialog
          open={openNotes}
          event={notes}
          onClose={() => setOpenNotes(false)}
        />
      )}
    </Box>
  );
};

export default RightSidebar;
