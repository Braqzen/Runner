import { Box, Chip, IconButton, Typography } from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Event } from "../../types/Event";

interface Props {
  event: Event;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (event: Event) => void;
  onHover: (event: Event | null) => void;
  onNotes: (event: Event) => void;
}

const EventListItem = ({
  event,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onNotes,
}: Props) => {
  const hasNotes =
    event.notes.race.length > 0 ||
    event.notes.event.length > 0 ||
    event.notes.takeaways.length > 0;
  const isCancelled = event.status === "cancelled";

  return (
    <Box
      onClick={() => onSelect(event)}
      onMouseEnter={() => onHover(event)}
      onMouseLeave={() => onHover(null)}
      sx={{
        px: 1.5,
        py: 1.65,
        cursor: "pointer",
        borderLeft: "3px solid",
        borderLeftColor: isHovered && !isSelected ? "#999999" : "transparent",
        backgroundColor: isSelected
          ? "var(--sidebar-content-selected)"
          : isHovered
            ? "var(--sidebar-content-hover)"
            : "var(--sidebar-content-bg)",
        borderBottom: "2px solid var(--sidebar-content-border)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.1 }}>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--sidebar-content-text)",
            lineHeight: 1.3,
          }}
        >
          {event.name}
        </Typography>
        {isCancelled && (
          <Chip
            label="Cancelled"
            size="small"
            sx={{
              height: 20,
              fontSize: "0.65rem",
              backgroundColor: "#ff9800",
              color: "#fff",
            }}
          />
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.65,
          }}
        >
          <LabeledValue label="Date" value={event.date} />
          <LabeledValue label="Distance" value={`${event.distance}km`} />
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.65,
          }}
        >
          <LabeledValue label="Start" value={event.start} />
          <LabeledValue label="Time" value={event.time} />
        </Box>

        <Box sx={{ display: "flex", flexShrink: 0, ml: 0.25 }}>
          <IconButton
            size="small"
            disabled={!hasNotes}
            onClick={(e) => {
              e.stopPropagation();
              onNotes(event);
            }}
            sx={{
              color: hasNotes ? "var(--sidebar-content-text)" : "#94a3b8",
            }}
          >
            <NotesIcon fontSize="small" />
          </IconButton>
          {event.link && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(event);
                window.open(event.link, "_blank", "noopener");
              }}
              sx={{ color: "var(--sidebar-content-text)" }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const LabeledValue = ({ label, value }: { label: string; value: string }) => (
  <Typography
    sx={{
      fontSize: "0.98rem",
      lineHeight: 1.45,
      whiteSpace: "nowrap",
    }}
  >
    <Box component="span" sx={{ color: "var(--sidebar-content-label)" }}>
      {label}:{" "}
    </Box>
    <Box component="span" sx={{ color: "var(--sidebar-content-text)" }}>
      {value}
    </Box>
  </Typography>
);

export default EventListItem;
