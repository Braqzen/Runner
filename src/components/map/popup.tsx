import { Box, Typography, Button } from "@mui/material";
import { Race } from "../../types/race";

interface PopupProps {
  race: Race;
  filteredRaces: Race[];
  onSelectRace: (race: Race) => void;
}

const PopupContent = ({ race, filteredRaces, onSelectRace }: PopupProps) => {
  // Find the index of the current race within the filtered array.
  const currentIndex = filteredRaces.findIndex((r) => r.id === race.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectRace(filteredRaces[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredRaces.length - 1) {
      onSelectRace(filteredRaces[currentIndex + 1]);
    }
  };

  return (
    <Box sx={{ "& p": { mb: 0.2, mt: 0 } }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", fontSize: "1.3rem", mb: 1 }}
      >
        {race.name}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        <strong>Type:</strong> {race.type}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        <strong>Date:</strong> {race.date}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        <strong>Distance:</strong> {race.distance}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        <strong>Time:</strong> {race.time}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          onClick={handlePrev}
          variant="outlined"
          sx={{ flex: 1, mr: 0.5, fontSize: "0.75rem" }}
          disabled={currentIndex <= 0}
          size="small"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          variant="outlined"
          sx={{ flex: 1, ml: 0.5, fontSize: "0.75rem" }}
          disabled={currentIndex >= filteredRaces.length - 1}
          size="small"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default PopupContent;
