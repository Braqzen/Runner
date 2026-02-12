import { useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
} from "@mui/material";
import { Event } from "../../types/Event";
import Dialog from "../common/Dialog";

interface Props {
  open: boolean;
  events: Event[];
  onClose: () => void;
}

const SummaryDialog = ({ open, events, onClose }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} title="Summary" maxWidth="1800px">
      <Box sx={{ p: 2 }}>
        <EventTable events={events} />
      </Box>
    </Dialog>
  );
};

const EventTable = ({ events }: { events: Event[] }) => {
  const [timeSort, setTimeSort] = useState<"asc" | "desc" | null>(null);

  const parseDurationToSeconds = (value: string): number | null => {
    if (!value) return null;
    const trimmed = value.trim();
    const parts = trimmed.split(":").map((p) => p.trim());
    if (parts.length !== 2 && parts.length !== 3) return null;
    if (parts.some((p) => p === "" || Number.isNaN(Number(p)))) return null;

    if (parts.length === 2) {
      const [hours, minutes] = parts.map(Number);
      if (minutes >= 60) return null;
      return hours * 3600 + minutes * 60;
    }

    const [h, m, s] = parts.map(Number);
    if (m >= 60 || s >= 60) return null;
    return h * 3600 + m * 60 + s;
  };

  const sortedEvents = useMemo(() => {
    if (!timeSort) return events;
    const withIndex = events.map((e, idx) => ({ e, idx }));
    withIndex.sort((a, b) => {
      const ta = parseDurationToSeconds(a.e.time);
      const tb = parseDurationToSeconds(b.e.time);
      const aHas = ta !== null;
      const bHas = tb !== null;
      if (aHas && bHas) {
        const cmp = ta - tb;
        return timeSort === "asc" ? cmp : -cmp;
      }
      if (aHas !== bHas) {
        return aHas ? -1 : 1; // push unknown times to the end
      }
      return a.idx - b.idx; // stable
    });
    return withIndex.map((x) => x.e);
  }, [events, timeSort]);

  const handleTimeSortClick = () => {
    setTimeSort((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc",
    );
  };

  return (
    <Table>
      <EventTableHead
        timeSort={timeSort}
        onTimeSortClick={handleTimeSortClick}
      />
      <TableBody>
        {sortedEvents.map((event) => (
          <EventTableRow key={event.id} event={event} />
        ))}
      </TableBody>
    </Table>
  );
};

const EventTableHead = ({
  timeSort,
  onTimeSortClick,
}: {
  timeSort: "asc" | "desc" | null;
  onTimeSortClick: () => void;
}) => (
  <TableHead>
    <TableRow>
      <TableCell sx={{ width: 250, fontSize: "1rem" }}>Name</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1rem" }}>Location</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1rem" }}>Date</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1rem" }}>Start</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1rem" }}>Type</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1rem" }}>Distance</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1rem" }}>Ascent</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1rem" }}>Effort</TableCell>
      <TableCell
        sx={{ width: 200, fontSize: "1rem" }}
        sortDirection={timeSort || false}
      >
        <TableSortLabel
          active={Boolean(timeSort)}
          direction={timeSort ?? "asc"}
          onClick={onTimeSortClick}
        >
          Time
        </TableSortLabel>
      </TableCell>
      <TableCell sx={{ width: 150, fontSize: "1rem" }}>Status</TableCell>
    </TableRow>
  </TableHead>
);

const parseTimeToHours = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(":").map((p) => p.trim());
  if (parts.length === 2) {
    const [hours, minutes] = parts.map(Number);
    return hours + minutes / 60;
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts.map(Number);
    return hours + minutes / 60 + seconds / 3600;
  }
  return 0;
};

const calculateEffort = (event: Event): number | null => {
  const distance = parseFloat(event.distance) || 0;
  const ascent = event.ascent ? parseFloat(event.ascent) : 0;
  const timeHours = parseTimeToHours(event.time);
  if (timeHours === 0) return null;
  const baseEffort = (distance + ascent / 100) / timeHours;
  const avgHr = event.average_hr ? parseFloat(event.average_hr) : null;
  const maxHr = event.max_hr ? parseFloat(event.max_hr) : null;
  if (avgHr === null || maxHr === null || maxHr === 0) return null;
  const effort = baseEffort * (avgHr / maxHr);
  return Math.round(effort * 100) / 100;
};

const EventTableRow = ({ event }: { event: Event }) => {
  const isCancelled = event.status === "cancelled";
  const effort = calculateEffort(event);

  return (
    <TableRow>
      <TableCell
        sx={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontSize: "0.9rem",
        }}
      >
        {event.name}
      </TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>
        {event.tags.region[1] || "N/A"}
      </TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>{event.date}</TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>{event.start}</TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>{event.type}</TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>{event.distance}km</TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>
        {event.ascent ? `${event.ascent}m` : ""}
      </TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>
        {effort !== null ? effort.toFixed(2) : ""}
      </TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>{event.time}</TableCell>
      <TableCell sx={{ fontSize: "0.9rem" }}>
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
            }}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default SummaryDialog;
