import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Typography,
  Box,
} from "@mui/material";
import { Category } from "../../types/FutureEvents";
import CountdownCell from "./CountdownCell";

interface Props {
  data: Category;
  showCountdown?: boolean;
}

const FutureEventsTables = ({ data, showCountdown = false }: Props) => {
  const hasMarathon = data.marathon.length > 0;
  const hasUltra = data["ultra-marathon"].length > 0;

  if (!hasMarathon && !hasUltra) {
    return (
      <Typography sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}>
        No events to display.
      </Typography>
    );
  }

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      {hasMarathon && (
        <EventTable
          category="marathon"
          events={data.marathon}
          showCountdown={showCountdown}
        />
      )}
      {hasUltra && (
        <EventTable
          category="ultra-marathon"
          events={data["ultra-marathon"]}
          showCountdown={showCountdown}
        />
      )}
    </Box>
  );
};

const EventTable = ({
  category,
  events,
  showCountdown,
}: {
  category: keyof Category;
  events: Category[keyof Category];
  showCountdown: boolean;
}) => (
  <>
    <Typography
      variant="h6"
      sx={{ mt: category === "ultra-marathon" ? 3 : 1.5, mb: 1, fontWeight: 600 }}
    >
      {category === "marathon" ? "Marathon" : "Ultra Marathon"}
    </Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <strong>Date</strong>
          </TableCell>
          <TableCell>
            <strong>Location</strong>
          </TableCell>
          <TableCell>
            <strong>Name</strong>
          </TableCell>
          {category === "ultra-marathon" ? (
            <>
              <TableCell>
                <strong>Distance (km)</strong>
              </TableCell>
              <TableCell>
                <strong>Time (h)</strong>
              </TableCell>
              <TableCell>
                <strong>Gain (m)</strong>
              </TableCell>
            </>
          ) : null}
          <TableCell>
            <strong>Link</strong>
          </TableCell>
          {showCountdown && (
            <TableCell>
              <strong>Countdown</strong>
            </TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {events.map((event, index) => (
          <TableRow key={index}>
            <TableCell>{event.date}</TableCell>
            <TableCell>{event.location}</TableCell>
            <TableCell>{event.name}</TableCell>
            {category === "ultra-marathon" ? (
              <>
                <TableCell>{event.distance}</TableCell>
                <TableCell>{event.time}</TableCell>
                <TableCell>{event.gain}</TableCell>
              </>
            ) : null}
            <TableCell>
              <Link href={event.link} target="_blank" rel="noopener">
                Website
              </Link>
            </TableCell>
            {showCountdown && <CountdownCell dateStr={event.date} />}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
);

export default FutureEventsTables;
