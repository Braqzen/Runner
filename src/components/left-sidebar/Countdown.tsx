import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FutureEvent, FutureEvents } from "../../types/FutureEvents";
import rawFutureEvents from "../../../data/future-events.json";
import Dialog from "../common/Dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

const Countdown = ({ open, onClose }: Props) => {
  const [futureEvents, setFutureEvents] = useState<FutureEvents | null>(null);
  const [timeLeft, setTimeLeft] = useState<ReturnType<
    typeof getTimeLeft
  > | null>(null);
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    setFutureEvents(rawFutureEvents);
  }, []);

  const registeredEvents = useMemo(() => {
    if (!futureEvents) return [];
    const registeredEvents = [
      ...futureEvents.registered.marathon,
      ...futureEvents.registered["ultra-marathon"],
    ];
    return getEvents(registeredEvents);
  }, [futureEvents]);

  const currentEvent = useMemo(() => {
    if (registeredEvents.length === 0) return null;
    return registeredEvents[eventIndex];
  }, [registeredEvents, eventIndex]);

  useEffect(() => {
    if (!currentEvent) {
      setTimeLeft(null);
      return;
    }

    const updateCountdown = () => {
      setTimeLeft(getTimeLeft(currentEvent.parsedDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentEvent]);

  const handlePrevious = () => {
    setEventIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setEventIndex((prevIndex) =>
      Math.min(registeredEvents.length - 1, prevIndex + 1),
    );
  };

  const eventCount = registeredEvents.length;

  return (
    <Dialog open={open} onClose={onClose} title="Event Countdown">
      {currentEvent ? (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            overflowX: "hidden",
            px: { xs: 1, sm: 2 },
            py: { xs: 1, sm: 2 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 4,
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "auto minmax(0, 1fr) auto",
                alignItems: "center",
                columnGap: 1,
                mb: 1,
              }}
            >
              <IconButton
                onClick={handlePrevious}
                disabled={eventIndex === 0}
                size="medium"
              >
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="overline"
                  sx={{
                    display: "block",
                    letterSpacing: "0.18em",
                    color: "text.secondary",
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  Event {eventIndex + 1} of {eventCount}
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight={650}
                  sx={{
                    textAlign: "center",
                    lineHeight: 1.15,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    m: 0,
                    mt: 5,
                  }}
                >
                  {currentEvent.name}
                </Typography>
              </Box>

              <IconButton
                onClick={handleNext}
                disabled={eventIndex === registeredEvents.length - 1}
                size="medium"
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>

            {timeLeft && (
              <Box sx={{ mt: 1 }}>
                <CountdownDisplay timeLeft={timeLeft} />
              </Box>
            )}

            <Box sx={{ mt: 1 }}>
              <EventInfo event={currentEvent} />
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" textAlign="center" mt={2}>
          No upcoming events.
        </Typography>
      )}
    </Dialog>
  );
};

interface EventInfoProps {
  event: FutureEvent & { parsedDate: Date };
}

const EventInfo = ({ event }: EventInfoProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: "center",
      justifyContent: "center",
      gap: { xs: 0.75, sm: 2 },
      textAlign: "center",
      width: "100%",
      boxSizing: "border-box",
      pb: 1,
    }}
  >
    <Typography
      sx={{
        color: "text.secondary",
        fontSize: "1.15rem",
        overflowWrap: "anywhere",
        wordBreak: "break-word",
      }}
    >
      {event.location} • {event.date}
    </Typography>
    {event.link && (
      <Link
        href={event.link}
        target="_blank"
        rel="noopener"
        sx={{
          color: "#1976d2",
          fontWeight: 600,
          textDecoration: "none",
          borderBottom: "1px solid rgba(25, 118, 210, 0.35)",
          "&:hover": {
            borderBottomColor: "rgba(25, 118, 210, 0.8)",
          },
        }}
      >
        Event website
      </Link>
    )}
  </Box>
);

interface CountdownDisplayProps {
  timeLeft: ReturnType<typeof getTimeLeft>;
}

const CountdownUnit = ({ label, value }: { label: string; value: number }) => (
  <Box
    sx={{
      width: "90%",
      borderRadius: 3,
      backgroundColor: "background.paper",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
      px: { xs: 0, sm: 0 },
      py: { xs: 0, sm: 3 },
      boxSizing: "border-box",
      textAlign: "center",
      overflow: "hidden",
    }}
  >
    <Typography
      sx={{
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        fontVariantNumeric: "tabular-nums",
        fontSize: "clamp(2.0rem, 4vw, 3.1rem)",
        fontWeight: 600,
        letterSpacing: "0.02em",
        lineHeight: 1,
        color: "text.primary",
      }}
    >
      {String(value).padStart(2, "0")}
    </Typography>

    <Typography
      sx={{
        mt: 1,
        fontSize: "0.68rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: "text.secondary",
      }}
    >
      {label}
    </Typography>
  </Box>
);

const CountdownDisplay = ({ timeLeft }: CountdownDisplayProps) => {
  const items = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 980,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
            },
            gap: { xs: 1.75, sm: 2 },
          }}
        >
          {items.map((item) => (
            <CountdownUnit
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const getTimeLeft = (event: Date) => {
  const now = new Date();
  const diff = event.getTime() - now.getTime();

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  return { days, hours, minutes, seconds };
};

const parseDate = (dateStr: string): Date | null => {
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (!match) return null;

  const [_, day, month, year] = match;
  const parsed = new Date(
    parseInt(year) + 2000,
    parseInt(month) - 1,
    parseInt(day),
  );
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const getEvents = (
  events: FutureEvent[],
): (FutureEvent & { parsedDate: Date })[] => {
  const today = new Date();

  const validEvents = events
    .map((event) => {
      const parsedDate = parseDate(event.date);
      return parsedDate ? { ...event, parsedDate } : null;
    })
    .filter((e): e is FutureEvent & { parsedDate: Date } => !!e)
    .filter((e) => e.parsedDate >= today)
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  return validEvents;
};

export default Countdown;
