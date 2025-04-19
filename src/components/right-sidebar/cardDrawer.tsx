import { useEffect, useState } from "react";
import { Drawer, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventCard from "../right-sidebar/eventCard";
import NotesDialog from "../right-sidebar/noteDialogue";
import { Event } from "../../types/event";

interface CardsDrawerProps {
  open: boolean;
  onClose: () => void;
  filteredEvents: Event[];
  selectedEvent: Event | null;
  onSelectEvent: (event: Event) => void;
}

const CardsDrawer = ({
  open,
  onClose,
  filteredEvents,
  selectedEvent,
  onSelectEvent,
}: CardsDrawerProps) => {
  const [openNotes, setOpenNotes] = useState(false);
  const [notes, setNotes] = useState<Event | null>(null);

  useEffect(() => {
    if (openNotes && selectedEvent) {
      setNotes(selectedEvent);
    }
  }, [selectedEvent, openNotes]);

  const handleNotes = (event: Event) => {
    onSelectEvent(event);
    setOpenNotes(true);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: "20%",
              backgroundColor: "#333",
              padding: 2,
            },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, textAlign: "center", color: "#fff" }}
          >
            Events
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            overflowY: "auto",
            pr: 1,
            pt: 1,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Box component="ul" sx={{ m: 0, padding: 0, listStyle: "none" }}>
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
      </Drawer>
      {notes && (
        <NotesDialog
          open={openNotes}
          event={notes}
          onClose={() => setOpenNotes(false)}
        />
      )}
    </>
  );
};

export default CardsDrawer;
