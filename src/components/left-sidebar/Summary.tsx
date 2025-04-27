import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
    <Dialog open={open} onClose={onClose} title="Summary">
      <EventTable events={events} />
    </Dialog>
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
    <TableCell sx={{ fontSize: "1rem" }}>{event.distance}</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.time}</TableCell>
    <TableCell sx={{ fontSize: "1rem" }}>{event.ratings.enjoyment}/5</TableCell>
  </TableRow>
);

export default SummaryDialog;
