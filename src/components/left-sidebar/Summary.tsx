import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { Event } from "../../types/Event";
import Dialog from "../common/Dialog";
import Rating from "../common/Rating";

interface Props {
  open: boolean;
  events: Event[];
  onClose: () => void;
}

const SummaryDialog = ({ open, events, onClose }: Props) => {
  const {
    marathonCount,
    ultraMarathonCount,
    marathonHighlights,
    ultraMarathonHighlights,
    totalMarathonDistance,
    totalUltraMarathonDistance,
  } = useMemo(() => {
    const marathons = events.filter(
      (event) => event.type.toLowerCase() === "marathon"
    );
    const ultras = events.filter(
      (event) => event.type.toLowerCase() === "ultra-marathon"
    );

    const marathonCount = marathons.length;
    const ultraMarathonCount = ultras.length;

    const findRatingHighlights = (
      eventList: Event[],
      ratingKey: keyof Event["ratings"]
    ) => {
      if (eventList.length === 0) return { highest: null, lowest: null };

      const highest = eventList.reduce((prev, current) =>
        prev.ratings[ratingKey] > current.ratings[ratingKey] ? prev : current
      );
      const lowest = eventList.reduce((prev, current) =>
        prev.ratings[ratingKey] < current.ratings[ratingKey] ? prev : current
      );
      return { highest, lowest };
    };

    const marathonHighlights = {
      enjoyment: findRatingHighlights(marathons, "enjoyment"),
      exertion: findRatingHighlights(marathons, "exertion"),
      event_organisation: findRatingHighlights(marathons, "event_organisation"),
      location: findRatingHighlights(marathons, "location"),
    };

    const ultraMarathonHighlights = {
      enjoyment: findRatingHighlights(ultras, "enjoyment"),
      exertion: findRatingHighlights(ultras, "exertion"),
      event_organisation: findRatingHighlights(ultras, "event_organisation"),
      location: findRatingHighlights(ultras, "location"),
    };

    const parseDistance = (distanceStr: string): number | null => {
      const num = parseFloat(distanceStr);
      return isNaN(num) ? null : num;
    };

    const totalMarathonDistance = marathons.reduce((sum, event) => {
      const dist = parseDistance(event.distance);
      return sum + (dist !== null ? dist : 0);
    }, 0);

    const totalUltraMarathonDistance = ultras.reduce((sum, event) => {
      const dist = parseDistance(event.distance);
      return sum + (dist !== null ? dist : 0);
    }, 0);

    return {
      marathonCount,
      ultraMarathonCount,
      marathonHighlights,
      ultraMarathonHighlights,
      totalMarathonDistance,
      totalUltraMarathonDistance,
    };
  }, [events]);

  return (
    <Dialog open={open} onClose={onClose} title="Summary">
      <Summary
        marathonCount={marathonCount}
        ultraMarathonCount={ultraMarathonCount}
        marathonHighlights={marathonHighlights}
        ultraMarathonHighlights={ultraMarathonHighlights}
        totalMarathonDistance={totalMarathonDistance}
        totalUltraMarathonDistance={totalUltraMarathonDistance}
      />
      <EventTable events={events} />
    </Dialog>
  );
};

interface SummaryCardProps {
  marathonCount: number;
  ultraMarathonCount: number;
  marathonHighlights: {
    enjoyment: { highest: Event | null; lowest: Event | null };
    exertion: { highest: Event | null; lowest: Event | null };
    event_organisation: { highest: Event | null; lowest: Event | null };
    location: { highest: Event | null; lowest: Event | null };
  };
  ultraMarathonHighlights: {
    enjoyment: { highest: Event | null; lowest: Event | null };
    exertion: { highest: Event | null; lowest: Event | null };
    event_organisation: { highest: Event | null; lowest: Event | null };
    location: { highest: Event | null; lowest: Event | null };
  };
  totalMarathonDistance: number;
  totalUltraMarathonDistance: number;
}

const Summary = ({
  marathonCount,
  ultraMarathonCount,
  marathonHighlights,
  ultraMarathonHighlights,
  totalMarathonDistance,
  totalUltraMarathonDistance,
}: SummaryCardProps) => {
  const [tab, setTab] = useState<"marathon" | "ultra-marathon">("marathon");
  const handleTabChange = (
    _: React.SyntheticEvent,
    newTab: "marathon" | "ultra-marathon"
  ) => {
    setTab(newTab);
  };

  const currentCounts =
    tab === "marathon"
      ? { count: marathonCount, distance: totalMarathonDistance }
      : { count: ultraMarathonCount, distance: totalUltraMarathonDistance };
  const currentHighlights =
    tab === "marathon" ? marathonHighlights : ultraMarathonHighlights;

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 3,
        backgroundColor: "rgba(245, 245, 245, 0.85)",
        p: 2,
        borderRadius: 3,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: "0 !important", textAlign: "center" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 1, fontSize: "1.3rem" }}
        >
          Filtered Events
        </Typography>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          variant="fullWidth"
          sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Marathons" value="marathon" />
          <Tab label="Ultra Marathons" value="ultra-marathon" />
        </Tabs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 5,
            flexWrap: "wrap",
            mb: 4,
          }}
        >
          <Typography sx={{ fontSize: "1.1rem" }}>
            <strong>Count:</strong> {currentCounts.count}
          </Typography>
          <Typography sx={{ fontSize: "1.1rem" }}>
            <strong>Distance:</strong>
            {currentCounts.count > 0
              ? `${currentCounts.distance.toFixed(2)} km`
              : "N/A"}
          </Typography>
        </Box>

        <Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "1rem" }}>Rating</TableCell>
                <TableCell align="center" sx={{ fontSize: "1rem" }}>
                  Highest
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "1rem" }}>
                  Lowest
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(currentHighlights).map(
                ([ratingKey, { highest, lowest }]) => (
                  <TableRow key={ratingKey}>
                    <TableCell>
                      <strong>{ratingKey.replace("_", " ")}</strong>
                    </TableCell>

                    <TableCell align="center">
                      {highest ? (
                        <Box>
                          <Typography>{highest.name}</Typography>
                          <Tooltip
                            title={`${
                              highest.ratings[
                                ratingKey as keyof Event["ratings"]
                              ]
                            }/5`}
                            followCursor
                          >
                            <Box>
                              <Rating
                                rating={
                                  highest.ratings[
                                    ratingKey as keyof Event["ratings"]
                                  ]
                                }
                                size="small"
                              />
                            </Box>
                          </Tooltip>
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {lowest ? (
                        <Box>
                          <Typography>{lowest.name}</Typography>
                          <Tooltip
                            title={`${
                              lowest.ratings[
                                ratingKey as keyof Event["ratings"]
                              ]
                            }/5`}
                            followCursor
                          >
                            <Box>
                              <Rating
                                rating={
                                  lowest.ratings[
                                    ratingKey as keyof Event["ratings"]
                                  ]
                                }
                                size="small"
                              />
                            </Box>
                          </Tooltip>
                        </Box>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
};

const EventTable = ({ events }: { events: Event[] }) => (
  <Table>
    <EventTableHead />
    <TableBody>
      {events.map((event) => (
        <EventTableRow key={event.id} event={event} />
      ))}
    </TableBody>
  </Table>
);

const EventTableHead = () => (
  <TableHead>
    <TableRow>
      <TableCell sx={{ width: 250, fontSize: "1.2rem" }}>Name</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Date</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Start</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Type</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Distance</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Time</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Rating</TableCell>
    </TableRow>
  </TableHead>
);

const EventTableRow = ({ event }: { event: Event }) => (
  <TableRow>
    <TableCell
      sx={{
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        fontSize: "1rem",
      }}
    >
      {event.name}
    </TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.date}</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.start}</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.type}</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.distance}km</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.time}</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.ratings.enjoyment}/5</TableCell>
  </TableRow>
);

export default SummaryDialog;
