import { Box, Typography, Button, darken } from "@mui/material";
import { Race } from "../../types/race";
import Rating from "../rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

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

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ display: "flex", alignItems: "center" }}>
          <strong>Rating:</strong>
          <Rating race={race} size="small" sx={{ ml: 1, mr: 1 }} />
          {race.rating}/5
        </Typography>
      </Box>
      <Typography>
        <strong>Type:</strong> {race.type}
      </Typography>
      <Typography>
        <strong>Date:</strong> {race.date}
      </Typography>
      <Typography>
        <strong>Distance:</strong> {race.distance}
      </Typography>
      <Typography>
        <strong>Time:</strong> {race.time}
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
