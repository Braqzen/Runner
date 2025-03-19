import { RefObject, useEffect, useState } from "react";
import {
  Box,
  Button,
  Autocomplete,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import rawEvents from "../../events.json";
import { Event } from "../types/event";
import { TileLayerOption } from "../types/tiles";
import EventCard from "./sidebar/eventCard";
import TagFilter, { TagOption } from "./sidebar/tag";
import NotesDialog from "./sidebar/noteDialogue";

interface SidebarProps {
  selectedEvent: Event | null;
  tileOptions: TileLayerOption[];
  selectedTile: TileLayerOption;
  onTileChange: (tile: TileLayerOption) => void;
  onSelectEvent: (event: Event) => void;
  map: RefObject<L.Map | null>;
  selectedTags: TagOption[];
  onTagsChange: (tags: TagOption[]) => void;
}

const Sidebar = ({
  selectedEvent,
  tileOptions,
  selectedTile,
  onTileChange,
  onSelectEvent,
  map,
  selectedTags,
  onTagsChange,
}: SidebarProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [openNotes, setOpenNotes] = useState(false);
  const [notes, setNotes] = useState<Event | null>(null);

  useEffect(() => {
    const data = rawEvents.map((event) => ({
      ...event,
      route: event.route.map((coords) => coords as [number, number]),
    }));
    setEvents(data);
  }, []);

  const uniqueTags = Array.from(
    new Set(events.flatMap((event) => event.tags || []))
  ).map((tag) => ({ label: tag, value: tag }));

  const filteredEvents =
    selectedTags.length === 0
      ? events
      : events.filter((event) =>
          selectedTags.every((tag) => event.tags.includes(tag.value))
        );

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
      className="sidebar"
      sx={{
        display: "grid",
        gridTemplateRows: "auto 1fr 80px",
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          Map Theme
        </Typography>
        <Autocomplete
          options={tileOptions}
          getOptionLabel={(option) => option.name}
          value={selectedTile}
          onChange={(_event, newValue) => {
            if (newValue) onTileChange(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Map Theme"
              variant="outlined"
              margin="dense"
              sx={{
                input: { color: "#fff" },
                label: { color: "#fff" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#fff",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ccc",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
              }}
            />
          )}
        />
        <Divider sx={{ my: 1 }} />
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

export default Sidebar;
