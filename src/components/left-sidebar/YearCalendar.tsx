import { useEffect, useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Event } from "../../types/Event";
import { FutureEvent } from "../../types/FutureEvents";
import rawFutureEvents from "../../../data/future-events.json";
import { parseDate as parseFutureDate } from "../../utils/countdown";
import Dialog from "../common/Dialog";

interface Props {
  open: boolean;
  events: Event[];
  onClose: () => void;
}

type CalendarEntry =
  | { kind: "past"; event: Event }
  | { kind: "future"; event: FutureEvent };

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const ACCENT = "rgb(106, 246, 101)";
const CANCELLED = "#ff9800";
const FUTURE = "#4a9eff";
const TEXT = "#1a1a1a";
const TEXT_MUTED = "rgba(0, 0, 0, 0.5)";
const TOOLTIP_BG = "#2e2e2e";
const TOOLTIP_TEXT = "#f5f5f5";
const TOOLTIP_MUTED = "rgba(255, 255, 255, 0.65)";

const parsePastDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const dateKey = (year: number, month: number, day: number): string =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const futureToDateKey = (dateStr: string): string | null => {
  const parsed = parseFutureDate(dateStr);
  if (!parsed) return null;
  return dateKey(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const formatLocation = (event: Event): string => {
  const parts = event.tags.region;
  if (parts.length <= 1) return parts[0] ?? "";
  return parts.slice(1).join(", ");
};

const daysBetween = (a: Date, b: Date): number =>
  Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));

const getRegisteredEvents = (): FutureEvent[] => [
  ...rawFutureEvents.registered.marathon,
  ...rawFutureEvents.registered["ultra-marathon"],
];

const useCalendarMeta = (events: Event[]) => {
  return useMemo(() => {
    const byDate = new Map<string, CalendarEntry>();
    const daysSincePrev = new Map<number, number | null>();

    const sorted = [...events].sort(
      (a, b) => parsePastDate(a.date).getTime() - parsePastDate(b.date).getTime(),
    );

    sorted.forEach((event, i) => {
      byDate.set(event.date, { kind: "past", event });
      if (i === 0) {
        daysSincePrev.set(event.id, null);
      } else {
        const prev = parsePastDate(sorted[i - 1].date);
        const curr = parsePastDate(event.date);
        daysSincePrev.set(event.id, daysBetween(prev, curr));
      }
    });

    const registered = getRegisteredEvents();
    registered.forEach((event) => {
      const key = futureToDateKey(event.date);
      if (key) {
        byDate.set(key, { kind: "future", event });
      }
    });

    const years = new Set<number>();
    sorted.forEach((e) => years.add(parsePastDate(e.date).getFullYear()));
    registered.forEach((e) => {
      const key = futureToDateKey(e.date);
      if (key) years.add(parsePastDate(key).getFullYear());
    });

    return {
      byDate,
      daysSincePrev,
      years: [...years].sort((a, b) => a - b),
      registered,
    };
  }, [events]);
};

const tooltipSlotProps = {
  tooltip: {
    sx: {
      bgcolor: TOOLTIP_BG,
      color: TOOLTIP_TEXT,
      fontSize: "0.8rem",
      lineHeight: 1.4,
      maxWidth: 280,
      p: 1.25,
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
      "& .MuiTooltip-arrow": { color: TOOLTIP_BG },
    },
  },
};

const PastTooltipContent = ({
  event,
  daysSince,
}: {
  event: Event;
  daysSince: number | null | undefined;
}) => {
  const cancelled = event.status === "cancelled";

  return (
    <Box sx={{ maxWidth: 260 }}>
      <Box sx={{ fontWeight: 600, fontSize: "0.85rem", color: TOOLTIP_TEXT, mb: 0.5 }}>
        {event.name}
        {cancelled && (
          <Box
            component="span"
            sx={{ ml: 0.75, fontSize: "0.75rem", color: CANCELLED, fontWeight: 600 }}
          >
            (Cancelled)
          </Box>
        )}
      </Box>
      <Box sx={{ fontSize: "0.8rem", color: TOOLTIP_MUTED }}>
        {formatLocation(event)}
      </Box>
      <Box sx={{ fontSize: "0.8rem", color: TOOLTIP_TEXT, mt: 0.5 }}>
        {event.distance} km · {event.time}
      </Box>
      {daysSince !== null && daysSince !== undefined && (
        <Box
          sx={{
            fontSize: "0.75rem",
            mt: 0.75,
            pt: 0.75,
            borderTop: "1px solid rgba(255,255,255,0.15)",
            color: TOOLTIP_MUTED,
          }}
        >
          {daysSince} days since previous event
        </Box>
      )}
    </Box>
  );
};

const FutureTooltipContent = ({ event }: { event: FutureEvent }) => (
  <Box sx={{ maxWidth: 260 }}>
    <Box
      sx={{
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: FUTURE,
        mb: 0.5,
      }}
    >
      Registered
    </Box>
    <Box sx={{ fontWeight: 600, fontSize: "0.85rem", color: TOOLTIP_TEXT, mb: 0.5 }}>
      {event.name}
    </Box>
    <Box sx={{ fontSize: "0.8rem", color: TOOLTIP_MUTED }}>{event.location}</Box>
    {event.distance && (
      <Box sx={{ fontSize: "0.8rem", color: TOOLTIP_TEXT, mt: 0.5 }}>
        {event.distance} km
        {event.time ? ` · ${event.time}h` : ""}
      </Box>
    )}
  </Box>
);

const DayCell = ({
  day,
  entry,
  daysSince,
}: {
  day: number;
  entry?: CalendarEntry;
  daysSince?: number | null;
}) => {
  const baseSx = {
    width: "100%",
    aspectRatio: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.65rem",
    lineHeight: 1,
    borderRadius: 0.5,
    m: 0,
    p: 0,
  };

  if (!entry) {
    return (
      <Box sx={baseSx}>
        <Box component="span" sx={{ color: TEXT_MUTED, fontSize: "inherit" }}>
          {day}
        </Box>
      </Box>
    );
  }

  const bg =
    entry.kind === "future"
      ? FUTURE
      : entry.event.status === "cancelled"
        ? CANCELLED
        : ACCENT;

  const tooltip =
    entry.kind === "future" ? (
      <FutureTooltipContent event={entry.event} />
    ) : (
      <PastTooltipContent event={entry.event} daysSince={daysSince} />
    );

  return (
    <Tooltip title={tooltip} arrow placement="top" slotProps={tooltipSlotProps}>
      <Box
        component="span"
        sx={{
          ...baseSx,
          fontWeight: 700,
          color: entry.kind === "future" ? "#fff" : TEXT,
          bgcolor: bg,
          cursor: "default",
          "&:hover": {
            fontSize: "0.65rem",
            transform: "none",
          },
        }}
      >
        {day}
      </Box>
    </Tooltip>
  );
};

const MonthGrid = ({
  year,
  month,
  byDate,
  daysSincePrev,
  isCurrentMonth,
}: {
  year: number;
  month: number;
  byDate: Map<string, CalendarEntry>;
  daysSincePrev: Map<number, number | null>;
  isCurrentMonth: boolean;
}) => {
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Box
      sx={{
        border: isCurrentMonth
          ? "2px solid rgba(0,0,0,0.32)"
          : "1px solid rgba(0,0,0,0.08)",
        borderRadius: 2,
        px: 1.75,
        py: 1.25,
        bgcolor: "#fafafa",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Box
        sx={{
          fontSize: "0.85rem",
          fontWeight: 600,
          mb: 0.75,
          color: TEXT,
          letterSpacing: "0.02em",
        }}
      >
        {MONTH_NAMES[month]}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "3px",
          mb: 0.5,
        }}
      >
        {WEEKDAY_LABELS.map((label, i) => (
          <Box
            key={`${month}-wd-${i}`}
            sx={{
              fontSize: "0.6rem",
              textAlign: "center",
              color: TEXT_MUTED,
              fontWeight: 500,
              lineHeight: 1.2,
            }}
          >
            {label}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "3px",
        }}
      >
        {cells.map((day, i) => {
          if (day === null) {
            return <Box key={`${month}-empty-${i}`} sx={{ aspectRatio: "1" }} />;
          }

          const key = dateKey(year, month, day);
          const entry = byDate.get(key);
          const daysSince =
            entry?.kind === "past" ? daysSincePrev.get(entry.event.id) : undefined;

          return (
            <DayCell
              key={`${month}-day-${day}`}
              day={day}
              entry={entry}
              daysSince={daysSince}
            />
          );
        })}
      </Box>
    </Box>
  );
};

const YearCalendarDialog = ({ open, events, onClose }: Props) => {
  const { byDate, daysSincePrev, years, registered } = useCalendarMeta(events);
  const [yearIndex, setYearIndex] = useState(0);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  useEffect(() => {
    if (!open || years.length === 0) return;
    const idx = years.indexOf(currentYear);
    setYearIndex(idx >= 0 ? idx : years.length - 1);
  }, [open, years, currentYear]);

  const year = years[yearIndex] ?? years[0];
  const canGoPrev = yearIndex > 0;
  const canGoNext = yearIndex < years.length - 1;

  const eventCount = useMemo(() => {
    const pastCount = events.filter(
      (e) => parsePastDate(e.date).getFullYear() === year,
    ).length;
    const futureCount = registered.filter((e) => {
      const key = futureToDateKey(e.date);
      return key ? parsePastDate(key).getFullYear() === year : false;
    }).length;
    return pastCount + futureCount;
  }, [events, registered, year]);

  if (years.length === 0) {
    return (
      <Dialog open={open} onClose={onClose} title="Calendar" maxWidth="1600px">
        <Box sx={{ color: TEXT, textAlign: "center", py: 4, fontSize: "1rem" }}>
          No events to display
        </Box>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title="Calendar" maxWidth="1600px">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          color: TEXT,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            py: 1,
            mb: 1,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <IconButton
            onClick={() => setYearIndex((i) => i - 1)}
            size="small"
            aria-label="Previous year"
            disabled={!canGoPrev}
            sx={{ color: TEXT }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Box sx={{ textAlign: "center", minWidth: 140 }}>
            <Box sx={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2, color: TEXT }}>
              {year}
            </Box>
            <Box sx={{ fontSize: "0.8rem", color: TEXT_MUTED }}>
              {eventCount} event{eventCount === 1 ? "" : "s"}
            </Box>
          </Box>
          <IconButton
            onClick={() => setYearIndex((i) => i + 1)}
            size="small"
            aria-label="Next year"
            disabled={!canGoNext}
            sx={{ color: TEXT }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 1.5,
            px: 2.5,
            pb: 2,
          }}
        >
          {MONTH_NAMES.map((_, month) => (
            <MonthGrid
              key={month}
              year={year}
              month={month}
              byDate={byDate}
              daysSincePrev={daysSincePrev}
              isCurrentMonth={year === currentYear && month === currentMonth}
            />
          ))}
        </Box>
      </Box>
    </Dialog>
  );
};

export default YearCalendarDialog;
