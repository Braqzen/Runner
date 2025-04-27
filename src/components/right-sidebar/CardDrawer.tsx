import { useEffect } from "react";
import { Drawer, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventCard from "./EventCard";
import NotesDialog from "./NoteDialog";
import { Event } from "../../types/Event";

interface Props {
  open: boolean;
  onClose: () => void;
  filteredEvents: Event[];
  selectedEvent: Event | null;
  onSelectEvent: (event: Event) => void;
  notes: Event | null;
  setNotes: (event: Event | null) => void;
  openNotes: boolean;
  setOpenNotes: (open: boolean) => void;
}

const CardsDrawer = ({
  open,
  onClose,
  filteredEvents,
  selectedEvent,
  onSelectEvent,
  notes,
  setNotes,
  openNotes,
  setOpenNotes,
}: Props) => {
  useEffect(() => {
    if (openNotes && selectedEvent) {
      setNotes(selectedEvent);
    }
  }, [selectedEvent, openNotes, setNotes]);

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
        <DrawerHeader onClose={onClose} />
        <EventList
          filteredEvents={filteredEvents}
          onSelectEvent={onSelectEvent}
          handleNotes={handleNotes}
          selectedEvent={selectedEvent}
        />
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

const DrawerHeader = ({ onClose }: { onClose: () => void }) => (
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
);

const EventList = ({
  filteredEvents,
  onSelectEvent,
  handleNotes,
  selectedEvent,
}: {
  filteredEvents: Event[];
  onSelectEvent: (event: Event) => void;
  handleNotes: (event: Event) => void;
  selectedEvent: Event | null;
}) => (
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
);

export default CardsDrawer;
