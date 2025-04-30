import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Link,
  IconButton,
  Card,
  CardContent,
} from "@mui/material"; // Import Card, CardContent
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
      Math.min(registeredEvents.length - 1, prevIndex + 1)
    );
  };

  return (
    <Dialog open={open} onClose={onClose} title="Event Countdown">
      {currentEvent ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          <IconButton
            onClick={handlePrevious}
            disabled={eventIndex === 0}
            size="large"
            sx={{ height: "100%" }}
          >
            <ArrowBackIosIcon fontSize="large" />
          </IconButton>

          <Card
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 3,
              flexGrow: 1,
              p: 3,
              mt: 2,
              boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.4)",
            }}
          >
            <CardContent sx={{ p: "0 !important" }}>
              <EventDetails event={currentEvent} />
            </CardContent>

            {timeLeft && <CountdownDisplay timeLeft={timeLeft} />}
          </Card>

          <IconButton
            onClick={handleNext}
            disabled={eventIndex === registeredEvents.length - 1}
            size="large"
            sx={{ height: "100%" }}
          >
            <ArrowForwardIosIcon fontSize="large" />
          </IconButton>
        </Box>
      ) : (
        <Typography variant="h6" textAlign="center" mt={2}>
          No upcoming events.
        </Typography>
      )}
    </Dialog>
  );
};

interface EventDetailsProps {
  event: FutureEvent & { parsedDate: Date };
}

const EventDetails = ({ event }: EventDetailsProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    {" "}
    {/* Container for title and details row */}
    {/* Title at the top */}
    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
      {event.name}
    </Typography>
    {/* Horizontal row for other details */}
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        mt: 2,
      }}
    >
      <Typography variant="subtitle1" color="text.secondary">
        {event.location}
      </Typography>
      <Typography variant="body1">{event.date}</Typography>
      {event.link && (
        <Link
          href={event.link}
          target="_blank"
          rel="noopener"
          underline="hover"
        >
          Website
        </Link>
      )}
    </Box>
  </Box>
);

interface CountdownDisplayProps {
  timeLeft: ReturnType<typeof getTimeLeft>;
}

const CountdownDisplay = ({ timeLeft }: CountdownDisplayProps) => (
  <Box
    sx={{
      mt: 4,
      mb: 1,
      display: "flex",
      gap: 3,
      flexWrap: "wrap",
    }}
  >
    {[
      { label: "Days", value: timeLeft.days },
      { label: "Hours", value: timeLeft.hours },
      { label: "Minutes", value: timeLeft.minutes },
      { label: "Seconds", value: timeLeft.seconds },
    ].map((item) => (
      <Box
        key={item.label}
        sx={{
          minWidth: 80,
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: 2,
          p: 2,
          boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Typography fontSize="1.8rem" fontWeight="bold">
          {item.value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {item.label}
        </Typography>
      </Box>
    ))}
  </Box>
);

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
    parseInt(day)
  );
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const getEvents = (
  events: FutureEvent[]
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
