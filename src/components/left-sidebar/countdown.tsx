import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Link,
} from "@mui/material";
import { FutureEvents } from "../../types/futureEvents";
import rawFutureEvents from "../../../futureEvents.json";

interface Props {
  open: boolean;
  onClose: () => void;
}

const Countdown = ({ open, onClose }: Props) => {
  const [futureEvents, setFutureEvents] = useState<FutureEvents[]>([]);
  const [timeLeft, setTimeLeft] = useState<ReturnType<
    typeof getTimeLeft
  > | null>(null);

  useEffect(() => {
    setFutureEvents(rawFutureEvents);
  }, []);

  const event = getNextEvent(futureEvents);

  useEffect(() => {
    if (!event) return;

    const updateCountdown = () => {
      setTimeLeft(getTimeLeft(event.parsedDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "90vw",
            height: "90vh",
            maxWidth: "1500px",
            maxHeight: "90vh",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "2.2rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Next Event
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          {event ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 2,
                mt: 3,
              }}
            >
              <Typography variant="h4" fontWeight="bold">
                {event.name}
              </Typography>
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

              {timeLeft && (
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
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
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
              )}
            </Box>
          ) : (
            <Typography variant="h6" textAlign="center" mt={2}>
              No upcoming events.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
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
    parseInt(day)
  );
  return isNaN(parsed.getTime()) ? null : parsed;
};

export const getNextEvent = (
  events: FutureEvents[]
): (FutureEvents & { parsedDate: Date }) | null => {
  const today = new Date();

  const validEvents = events
    .map((event) => {
      const parsedDate = parseDate(event.date);
      return parsedDate ? { ...event, parsedDate } : null;
    })
    .filter((e): e is FutureEvents & { parsedDate: Date } => !!e)
    .filter((e) => e.parsedDate >= today)
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  return validEvents.length > 0 ? validEvents[0] : null;
};

export default Countdown;
