import { useMemo, useState } from "react";
import {
  Box,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Tooltip,
} from "@mui/material";
import { Event } from "../../types/Event";
import Dialog from "../common/Dialog";

interface Props {
  open: boolean;
  events: Event[];
  onClose: () => void;
}

const SummaryDialog = ({ open, events, onClose }: Props) => {
  const [tab, setTab] = useState(0);

  return (
    <Dialog open={open} onClose={onClose} title="Summary" maxWidth="1800px">
      <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Overview" />
          <Tab label="Performance" />
        </Tabs>
      </Box>
      <Box sx={{ p: 2 }}>
        {tab === 0 && <OverviewTable events={events} />}
        {tab === 1 && <PerformanceTable events={events} />}
      </Box>
    </Dialog>
  );
};

const parseTimeToHours = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr
    .trim()
    .split(":")
    .map((p) => p.trim());
  if (parts.length === 2) {
    const [hours, minutes] = parts.map(Number);
    return hours + minutes / 60;
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts.map(Number);
    return hours + minutes / 60 + seconds / 3600;
  }
  return 0;
};

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

const r2 = (v: number): number => Math.round(v * 100) / 100;

const getDa = (event: Event): number =>
  (parseFloat(event.distance) || 0) + (event.ascent ? parseFloat(event.ascent) / 100 : 0);

const getHrRatio = (event: Event): number | null => {
  const avg = event.average_hr ? parseFloat(event.average_hr) : null;
  const max = event.max_hr ? parseFloat(event.max_hr) : null;
  if (avg === null || max === null || max === 0) return null;
  return avg / max;
};

const calcExpectedEffort = (event: Event): number | null => {
  const w = getDa(event);
  const tl = parseTimeToHours(event.time_limit ?? "");
  if (w === 0 || tl === 0) return null;
  return r2(w * tl);
};

const calcExpectedNormalized = (event: Event): number | null => {
  const w = getDa(event);
  const tl = parseTimeToHours(event.time_limit ?? "");
  if (w === 0 || tl === 0) return null;
  return r2(tl / w);
};

const calcActualEffort = (event: Event): number | null => {
  const w = getDa(event);
  const t = parseTimeToHours(event.time);
  if (w === 0 || t === 0) return null;
  return r2(w * t);
};

const calcActualNormalized = (event: Event): number | null => {
  const w = getDa(event);
  const t = parseTimeToHours(event.time);
  if (w === 0 || t === 0) return null;
  return r2(t / w);
};

const calcRelativeCardiacLoad = (event: Event): number | null => {
  const t = parseTimeToHours(event.time);
  const tl = parseTimeToHours(event.time_limit ?? "");
  const ratio = getHrRatio(event);
  if (t === 0 || tl === 0 || ratio === null) return null;
  return r2((t / tl) * ratio);
};

const fmtVal = (v: number | null): string => (v !== null ? v.toFixed(2) : "");

const useTimeSortedEvents = (events: Event[]) => {
  const [timeSort, setTimeSort] = useState<"asc" | "desc" | null>(null);

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
      if (aHas !== bHas) return aHas ? -1 : 1;
      return a.idx - b.idx;
    });
    return withIndex.map((x) => x.e);
  }, [events, timeSort]);

  const handleTimeSortClick = () => {
    setTimeSort((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"));
  };

  return { sortedEvents, timeSort, handleTimeSortClick };
};

const TimeSortCell = ({
  timeSort,
  onTimeSortClick,
}: {
  timeSort: "asc" | "desc" | null;
  onTimeSortClick: () => void;
}) => (
  <TableCell sx={{ width: 200, fontSize: "1rem" }} sortDirection={timeSort || false}>
    <TableSortLabel
      active={Boolean(timeSort)}
      direction={timeSort ?? "asc"}
      onClick={onTimeSortClick}
    >
      Time
    </TableSortLabel>
  </TableCell>
);

const StatusCell = ({ event }: { event: Event }) => {
  const isCancelled = event.status === "cancelled";
  return (
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
  );
};

const OverviewTable = ({ events }: { events: Event[] }) => {
  const { sortedEvents, timeSort, handleTimeSortClick } = useTimeSortedEvents(events);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: 250, fontSize: "1rem" }}>Name</TableCell>
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>Location</TableCell>
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>Date</TableCell>
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>Start</TableCell>
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>Type</TableCell>
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>Distance</TableCell>
          <TimeSortCell timeSort={timeSort} onTimeSortClick={handleTimeSortClick} />
          <TableCell sx={{ width: 150, fontSize: "1rem" }}>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedEvents.map((event) => (
          <TableRow key={event.id}>
            <TableCell
              sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: "0.9rem",
              }}
            >
              {event.name}
            </TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{event.tags.region[1] || "N/A"}</TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{event.date}</TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{event.start}</TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{event.type}</TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{event.distance}km</TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{event.time}</TableCell>
            <StatusCell event={event} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const PerformanceTable = ({ events }: { events: Event[] }) => {
  const { sortedEvents, timeSort, handleTimeSortClick } = useTimeSortedEvents(events);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: 250, fontSize: "1rem" }}>Name</TableCell>
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>Distance</TableCell>
          <TimeSortCell timeSort={timeSort} onTimeSortClick={handleTimeSortClick} />
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>Ascent</TableCell>
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>
            <Tooltip title="W × time_limit, where W = distance + ascent/100" arrow>
              <span style={{ cursor: "help" }}>Expected Effort</span>
            </Tooltip>
          </TableCell>
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>
            <Tooltip title="time_limit / W" arrow>
              <span style={{ cursor: "help" }}>Expected Normalized</span>
            </Tooltip>
          </TableCell>
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>
            <Tooltip title="W × actual_time" arrow>
              <span style={{ cursor: "help" }}>Actual Effort</span>
            </Tooltip>
          </TableCell>
          <TableCell sx={{ width: 200, fontSize: "1rem" }}>
            <Tooltip title="actual_time / W" arrow>
              <span style={{ cursor: "help" }}>Actual Normalized</span>
            </Tooltip>
          </TableCell>

          <TableCell sx={{ width: 200, fontSize: "1rem" }}>
            <Tooltip title="(actual_time / time_limit) × (avg_hr / max_hr)" arrow>
              <span style={{ cursor: "help" }}>Rel. Cardiac Load</span>
            </Tooltip>
          </TableCell>
          <TableCell sx={{ width: 150, fontSize: "1rem" }}>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedEvents.map((event) => (
          <TableRow key={event.id}>
            <TableCell
              sx={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                fontSize: "0.9rem",
              }}
            >
              {event.name}
            </TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{event.distance}km</TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{event.time}</TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>
              {event.ascent ? `${event.ascent}m` : ""}
            </TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{fmtVal(calcExpectedEffort(event))}</TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>
              {fmtVal(calcExpectedNormalized(event))}
            </TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{fmtVal(calcActualEffort(event))}</TableCell>
            <TableCell sx={{ fontSize: "0.9rem" }}>{fmtVal(calcActualNormalized(event))}</TableCell>

            <TableCell sx={{ fontSize: "0.9rem" }}>
              {fmtVal(calcRelativeCardiacLoad(event))}
            </TableCell>
            <StatusCell event={event} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SummaryDialog;
