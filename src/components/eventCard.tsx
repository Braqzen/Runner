import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Race } from "../types/race";

interface EventCardProps {
  race: Race;
  onSelectRace: (race: Race) => void;
  handleNotes: (notes: string[]) => void;
}

const EventCard = ({ race, onSelectRace, handleNotes }: EventCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        background: "#fff",
        p: 2,
        mb: 2,
        borderRadius: 2,
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
        },
      }}
      onClick={() => onSelectRace(race)}
    >
      <CardContent sx={{ p: 1 }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 500, color: "#333" }}>
            {race.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: 1,
            columnGap: 0.5,
            my: 2,
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.15rem" }}
          >
            <strong>Type:</strong> {race.type}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.15rem" }}
          >
            <strong>Date:</strong> {race.date}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.15rem" }}
          >
            <strong>Distance:</strong> {race.distance}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.15rem" }}
          >
            <strong>Time:</strong> {race.time}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ pt: 0 }}>
        <Box sx={{ display: "flex", width: "100%" }}>
          <Button
            variant="outlined"
            size="small"
            sx={{ flex: 1, mr: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              handleNotes(race.notes);
            }}
          >
            Notes
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ flex: 1, ml: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              window.open(race.link, "_blank", "noopener");
            }}
          >
            Event Page
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default EventCard;
