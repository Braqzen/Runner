import { Box, Typography, Button, darken } from "@mui/material";
import { Event } from "../../types/event";
import Rating from "../rating";

interface PopupProps {
  event: Event;
  filteredEvents: Event[];
  onSelectEvent: (event: Event) => void;
}

const PopupContent = ({ event, filteredEvents, onSelectEvent }: PopupProps) => {
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

  return (
    <Box sx={{ "& p": { mb: 0.2, mt: 0 } }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", fontSize: "1.3rem", mb: 1 }}
      >
        {event.name}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          <strong>Rating:</strong>
          <Rating event={event} size="small" sx={{ ml: 1, mr: 1 }} />
          {event.ratings.enjoyment}/5
        </Typography>
      </Box>
      <Typography>
        <strong>Type:</strong> {event.type}
      </Typography>
      <Typography>
        <strong>Date:</strong> {event.date}
      </Typography>
      <Typography>
        <strong>Distance:</strong> {event.distance}
      </Typography>
      <Typography>
        <strong>Time:</strong> {event.time}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          onClick={handlePrev}
          variant="outlined"
          sx={{
            flex: 1,
            mr: 0.5,
            fontSize: "0.75rem",
            borderColor: "black",
            color: "black",
            "&:hover": {
              backgroundColor: darken("#fff", 0.1),
            },
          }}
          disabled={currentIndex <= 0}
          size="small"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          variant="outlined"
          sx={{
            flex: 1,
            ml: 0.5,
            fontSize: "0.75rem",
            borderColor: "black",
            color: "black",
            "&:hover": {
              backgroundColor: darken("#fff", 0.1),
            },
          }}
          disabled={currentIndex >= filteredEvents.length - 1}
          size="small"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default PopupContent;
