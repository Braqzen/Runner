import { useMemo, useState } from "react";
import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tabs,
  Tab,
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
  const [tab, setTab] = useState(0);

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
      (event) => event.type.toLowerCase() === "ultra marathon"
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

  const handleTabChange = (_: React.SyntheticEvent, newTab: number) => {
    setTab(newTab);
  };

  return (
    <Dialog open={open} onClose={onClose} title="Summary">
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Event List" />
        <Tab label="Overview" />
        <Tab label="Ratings" />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {tab === 0 && <EventTable events={events} />}

        {tab === 1 && (
          <SummaryContent
            marathonCount={marathonCount}
            ultraMarathonCount={ultraMarathonCount}
            marathonHighlights={marathonHighlights}
            ultraMarathonHighlights={ultraMarathonHighlights}
            totalMarathonDistance={totalMarathonDistance}
            totalUltraMarathonDistance={totalUltraMarathonDistance}
          />
        )}

        {tab === 2 && <EventRatingsTable events={events} />}
      </Box>
    </Dialog>
  );
};

interface SummaryContentProps {
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

const SummaryContent = ({
  marathonCount,
  ultraMarathonCount,
  marathonHighlights,
  ultraMarathonHighlights,
  totalMarathonDistance,
  totalUltraMarathonDistance,
}: SummaryContentProps) => (
  <Box>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        mb: 5,
        mt: 3,
        textAlign: "center",
      }}
    >
      <Box>
        <Typography sx={{ fontSize: "1.2rem" }}>
          <strong>Marathons:</strong> {marathonCount}
        </Typography>
        <Typography sx={{ fontSize: "1.2rem" }}>
          <strong>Distance: </strong>
          {marathonCount > 0 ? `${totalMarathonDistance} km` : "N/A"}
        </Typography>
      </Box>
      <Box>
        <Typography sx={{ fontSize: "1.2rem" }}>
          <strong>Ultra Marathons:</strong> {ultraMarathonCount}
        </Typography>
        <Typography sx={{ fontSize: "1.2rem" }}>
          <strong>Distance: </strong>
          {ultraMarathonCount > 0 ? `${totalUltraMarathonDistance} km` : "N/A"}
        </Typography>
      </Box>
    </Box>

    <Divider sx={{ my: 2 }} />

    <Box sx={{ textAlign: "left", mb: 3 }}>
      <Typography fontWeight="bold" sx={{ fontSize: "1.2rem", mt: 3, mb: 2 }}>
        Marathon Highlights
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "1rem" }}>Rating</TableCell>
            <TableCell sx={{ fontSize: "1rem" }} align="center">
              Highest
            </TableCell>
            <TableCell sx={{ fontSize: "1rem" }} align="center">
              Lowest
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(marathonHighlights).map(
            ([ratingKey, { highest, lowest }]) => (
              <TableRow key={ratingKey}>
                <TableCell component="th" scope="row" sx={{ fontSize: "1rem" }}>
                  <strong>{ratingKey.replace("_", " ")}</strong>
                </TableCell>
                <TableCell align="center">
                  {highest ? (
                    <Box>
                      <Typography>{highest.name}</Typography>
                      <Tooltip
                        title={`${
                          highest.ratings[ratingKey as keyof Event["ratings"]]
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
                          lowest.ratings[ratingKey as keyof Event["ratings"]]
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

    <Box sx={{ textAlign: "left" }}>
      <Typography fontWeight="bold" sx={{ fontSize: "1.2rem", mb: 2 }}>
        Ultra Marathon Highlights
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "1rem" }}>Rating</TableCell>
            <TableCell sx={{ fontSize: "1rem" }} align="center">
              Highest
            </TableCell>
            <TableCell sx={{ fontSize: "1rem" }} align="center">
              Lowest
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(ultraMarathonHighlights).map(
            ([ratingKey, { highest, lowest }]) => (
              <TableRow key={ratingKey}>
                <TableCell component="th" scope="row" sx={{ fontSize: "1rem" }}>
                  <strong>{ratingKey.replace("_", " ")}</strong>
                </TableCell>
                <TableCell align="center">
                  {highest ? (
                    <Box>
                      <Typography>{highest.name}</Typography>
                      <Tooltip
                        title={`${
                          highest.ratings[ratingKey as keyof Event["ratings"]]
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
                          lowest.ratings[ratingKey as keyof Event["ratings"]]
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
  </Box>
);

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
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
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
      <TableCell sx={{ width: 250, fontSize: "1.2rem" }}>Name</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Location</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Date</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Start</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Type</TableCell>
      <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>Distance</TableCell>
      <TableCell
        sx={{ width: 200, fontSize: "1.2rem" }}
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
    <TableCell sx={{ fontSize: "1rem" }}>
      {event.tags.region[1] || "N/A"}
    </TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.date}</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.start}</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.type}</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.distance}km</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.time}</TableCell>
  </TableRow>
);

const EventRatingsTable = ({ events }: { events: Event[] }) => (
  <Table size="small" sx={{ mt: 2 }}>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          Event Name
        </TableCell>
        <TableCell align="center" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          Enjoyment
        </TableCell>
        <TableCell align="center" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          Exertion
        </TableCell>
        <TableCell align="center" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          Organisation
        </TableCell>
        <TableCell align="center" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          Location
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {events.map((event) => (
        <TableRow key={event.id}>
          <TableCell component="th" scope="row">
            {event.name}
          </TableCell>
          <TableCell align="center">
            <Tooltip title={`${event.ratings.enjoyment}/5`} followCursor>
              <Box>
                <Rating rating={event.ratings.enjoyment} size="small" />
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell align="center">
            <Tooltip title={`${event.ratings.exertion}/5`} followCursor>
              <Box>
                <Rating rating={event.ratings.exertion} size="small" />
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell align="center">
            <Tooltip
              title={`${event.ratings.event_organisation}/5`}
              followCursor
            >
              <Box>
                <Rating
                  rating={event.ratings.event_organisation}
                  size="small"
                />
              </Box>
            </Tooltip>
          </TableCell>
          <TableCell align="center">
            <Tooltip title={`${event.ratings.location}/5`} followCursor>
              <Box>
                <Rating rating={event.ratings.location} size="small" />
              </Box>
            </Tooltip>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default SummaryDialog;
