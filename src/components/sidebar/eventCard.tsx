import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  ButtonBase,
  Rating,
  Tooltip,
  darken,
} from "@mui/material";
import { Race } from "../../types/race";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface EventCardProps {
  race: Race;
  onSelectRace: (race: Race) => void;
  handleNotes: (notes: string[]) => void;
  isSelected: boolean;
}

const EventCard = ({
  race,
  onSelectRace,
  handleNotes,
  isSelected,
}: EventCardProps) => {
  return (
    <Box sx={{ mb: 2 }}>
      <ButtonBase
        component="div"
        onClick={() => onSelectRace(race)}
        sx={{
          display: "block",
          width: "100%",
          textAlign: "inherit",
          "& .MuiTouchRipple-child": {
            backgroundColor: "rgba(0, 0, 0, 0.80) !important",
          },
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <Card
          variant="outlined"
          sx={{
            background: isSelected ? "rgb(106, 246, 101)" : "#fff",
            borderRadius: 2,
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            p: 2,
          }}
        >
          <CardContent sx={{ p: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: "#000",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flexGrow: 1,
                }}
              >
                {race.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                <Tooltip
                  title={`${race.rating}/5`}
                  followCursor
                  leaveDelay={200}
                  slotProps={{
                    tooltip: {
                      sx: {
                        fontSize: "1.2rem",
                      },
                    },
                  }}
                >
                  <Box>
                    <Rating
                      value={race.rating}
                      readOnly
                      precision={0.1}
                      max={5}
                      size="medium"
                      icon={
                        <StarIcon
                          sx={{
                            color: "rgb(39, 129, 255)",
                            stroke: "black",
                            strokeWidth: 1,
                          }}
                        />
                      }
                      emptyIcon={
                        <StarBorderIcon
                          sx={{
                            color: "black",
                            strokeWidth: 1,
                          }}
                        />
                      }
                    />
                  </Box>
                </Tooltip>
              </Box>
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
                color="text.primary"
                sx={{ fontSize: "1.15rem" }}
              >
                <strong>Type:</strong> {race.type}
              </Typography>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ fontSize: "1.15rem" }}
              >
                <strong>Date:</strong> {race.date}
              </Typography>
              <Typography
                variant="body1"
                color="text.primary"
                sx={{ fontSize: "1.15rem" }}
              >
                <strong>Distance:</strong> {race.distance}
              </Typography>
              <Typography
                variant="body1"
                color="text.primary"
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
                sx={{
                  flex: 1,
                  mr: 1,
                  borderColor: "black",
                  color: "black",
                  "&:hover": {
                    backgroundColor: () =>
                      isSelected
                        ? darken("rgb(106, 246, 101)", 0.1)
                        : darken("#fff", 0.1),
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNotes(race.notes);
                }}
                disabled={race.notes.length === 0}
              >
                Notes
              </Button>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  flex: 1,
                  ml: 1,
                  borderColor: "black",
                  color: "black",
                  "&:hover": {
                    backgroundColor: () =>
                      isSelected
                        ? darken("rgb(106, 246, 101)", 0.1)
                        : darken("#fff", 0.1),
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(race.link, "_blank", "noopener");
                }}
                disabled={race.link.length === 0}
              >
                Event Page
              </Button>
            </Box>
          </CardActions>
        </Card>
      </ButtonBase>
    </Box>
  );
};

export default EventCard;
