import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  ButtonBase,
  Tooltip,
  darken,
} from "@mui/material";
import { Event } from "../../types/event";
import Rating from "../rating";

interface EventCardProps {
  event: Event;
  onSelectEvent: (event: Event) => void;
  handleNotes: (event: Event) => void;
  isSelected: boolean;
}

const EventCard = ({
  event,
  onSelectEvent,
  handleNotes,
  isSelected,
}: EventCardProps) => {
  return (
    <ButtonBase
      component="div"
      onClick={() => onSelectEvent(event)}
      sx={{
        mb: 2,
        display: "block",
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
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
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
              {event.name}
            </Typography>
            <Tooltip
              title={`${event.rating}/5`}
              followCursor
              leaveDelay={200}
              slotProps={{
                tooltip: { sx: { fontSize: "1.2rem" } },
              }}
            >
              <Box component="span">
                <Rating event={event} size="medium" />
              </Box>
            </Tooltip>
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
            <Typography sx={{ fontSize: "1.15rem" }}>
              <strong>Date:</strong> {event.date}
            </Typography>
            <Typography sx={{ fontSize: "1.15rem" }}>
              <strong>Start:</strong> {event.start}
            </Typography>
            <Typography sx={{ fontSize: "1.15rem" }}>
              <strong>Distance:</strong> {event.distance}
            </Typography>
            <Typography sx={{ fontSize: "1.15rem" }}>
              <strong>Time:</strong> {event.time}
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
                handleNotes(event);
              }}
              disabled={
                event.notes.pre.length === 0 &&
                event.notes.during.length === 0 &&
                event.notes.post.length === 0
              }
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
                window.open(event.link, "_blank", "noopener");
              }}
              disabled={event.link.length === 0}
            >
              Event Page
            </Button>
          </Box>
        </CardActions>
      </Card>
    </ButtonBase>
  );
};

export default EventCard;
