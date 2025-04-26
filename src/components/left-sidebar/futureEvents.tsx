import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
} from "@mui/material";
import { FutureEvents } from "../../types/futureEvents";
import rawFutureEvents from "../../../futureEvents.json";
import Dialog from "../dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

const FutureEventsDialog = ({ open, onClose }: Props) => {
  const [futureEvents, setFutureEvents] = useState<FutureEvents[]>([]);

  useEffect(() => {
    setFutureEvents(rawFutureEvents);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} title="Future Events">
      <EventTable events={futureEvents} />
    </Dialog>
  );
};

const EventTable = ({ events }: { events: FutureEvents[] }) => (
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
        <TableCell>
          <strong>Link</strong>
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {events.map((event) => (
        <TableRow key={event.id}>
          <TableCell>{event.date}</TableCell>
          <TableCell>{event.location}</TableCell>
          <TableCell>{event.name}</TableCell>
          <TableCell>
            <Link href={event.link} target="_blank" rel="noopener">
              Website
            </Link>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default FutureEventsDialog;
