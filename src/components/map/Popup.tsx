import { Box, Typography, Button, darken, Chip } from "@mui/material";
import { Event } from "../../types/Event";

interface Props {
  event: Event;
  filteredEvents: Event[];
  onSelectEvent: (event: Event) => void;
  setNotes: (event: Event | null) => void;
  setOpenNotes: (open: boolean) => void;
}

const PopupContent = ({
  event,
  filteredEvents,
  onSelectEvent,
  setNotes,
  setOpenNotes,
}: Props) => {
  const currentIndex = filteredEvents.findIndex((r) => r.id === event.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectEvent(filteredEvents[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredEvents.length - 1) {
      onSelectEvent(filteredEvents[currentIndex + 1]);
    }
  };

  const handleTitleClick = () => {
    setNotes(event);
    setOpenNotes(true);
  };

  const isCancelled = event.status === "cancelled";

  return (
    <Box sx={{ "& p": { mb: 0.2, mt: 0 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          onClick={handleTitleClick}
          sx={{
            fontWeight: "bold",
            fontSize: "1.3rem",
            cursor: "pointer",
            flex: 1,
          }}
        >
          {event.name}
        </Typography>
        {isCancelled && (
          <Chip
            label="Cancelled"
            size="small"
            sx={{
              backgroundColor: "#ff9800",
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem",
              height: 22,
              ml: 1,
            }}
          />
        )}
      </Box>

      <Typography>
        <strong>Type:</strong> {event.type}
      </Typography>
      <Typography>
        <strong>Date:</strong> {event.date}
      </Typography>
      <Typography>
        <strong>Distance:</strong> {event.distance}km
      </Typography>
      {event.ascent && (
        <Typography>
          <strong>Ascent:</strong> {event.ascent}m
        </Typography>
      )}
      <Typography>
        <strong>Time:</strong> {event.time}
      </Typography>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", mt: 2, gap: 1 }}
      >
        <Button
          onClick={handlePrev}
          variant="outlined"
          sx={buttonStyle}
          disabled={currentIndex <= 0}
          size="small"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          variant="outlined"
          sx={buttonStyle}
          disabled={currentIndex >= filteredEvents.length - 1}
          size="small"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

const buttonStyle = {
  flex: 1,
  fontSize: "0.75rem",
  borderColor: "black",
  color: "black",
  "&:hover": {
    backgroundColor: darken("#fff", 0.1),
  },
};

export default PopupContent;
