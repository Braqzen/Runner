import { Box, Typography } from "@mui/material";
import { Event } from "../../types/Event";
import EventListItem from "./EventListItem";

interface Props {
  events: Event[];
  selectedEvent: Event | null;
  hoveredEvent: Event | null;
  onSelectEvent: (event: Event) => void;
  onHoverEvent: (event: Event | null) => void;
  onNotes: (event: Event) => void;
}

const EventList = ({
  events,
  selectedEvent,
  hoveredEvent,
  onSelectEvent,
  onHoverEvent,
  onNotes,
}: Props) => {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        backgroundColor: "var(--sidebar-content-bg)",
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888888",
          borderRadius: 2,
        },
      }}
    >
      {events.length === 0 ? (
        <Typography
          sx={{
            px: 1.5,
            py: 3,
            fontSize: "0.85rem",
            color: "var(--sidebar-content-label)",
          }}
        >
          No events match filters
        </Typography>
      ) : (
        events.map((event) => (
          <EventListItem
            key={event.id}
            event={event}
            isSelected={selectedEvent?.id === event.id}
            isHovered={
              hoveredEvent?.id === event.id && selectedEvent?.id !== event.id
            }
            onSelect={onSelectEvent}
            onHover={onHoverEvent}
            onNotes={onNotes}
          />
        ))
      )}
    </Box>
  );
};

export default EventList;
