import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Tabs,
  Tab,
} from "@mui/material";
import rawFutureEvents from "../../../data/future-events.json";
import Dialog from "../common/Dialog";
import { Category, FutureEvents } from "../../types/FutureEvents";

interface Props {
  open: boolean;
  onClose: () => void;
}

const FutureEventsDialog = ({ open, onClose }: Props) => {
  const [futureEvents, setFutureEvents] = useState<FutureEvents | null>(null);
  const [tab, setTab] = useState<"registered" | "deferred">("registered");

  useEffect(() => {
    setFutureEvents(rawFutureEvents);
  }, []);

  const handleTabChange = (
    _: React.SyntheticEvent,
    newTab: "registered" | "deferred",
  ) => {
    setTab(newTab);
  };

  const getData = () => {
    if (!futureEvents) return { marathon: [], "ultra-marathon": [] };
    return tab === "registered"
      ? futureEvents.registered
      : futureEvents.deferred;
  };

  const data = getData();

  const calculateEffort = (
    distance: string | null | undefined,
    gain: string | null | undefined,
    time: string | null | undefined,
  ): number => {
    const dist = distance ? parseFloat(distance) : 0;
    const g = gain ? parseFloat(gain) : 0;
    const t = time ? parseFloat(time) : 0;

    if (t === 0) return 0;

    const effort = (dist + g / 100) / t;
    return Math.round(effort * 100) / 100;
  };

  const renderTable = (category: keyof Category) => {
    if (data[category].length === 0) return null;

    return (
      <>
        <h3
          style={{
            marginTop: category === "ultra-marathon" ? "3rem" : "1.5rem",
          }}
        >
          {category === "marathon" ? "Marathon" : "Ultra Marathon"}
        </h3>{" "}
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
              {category == "ultra-marathon" ? (
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
                  <TableCell>
                    <strong>Effort</strong>
                  </TableCell>
                </>
              ) : null}
              <TableCell>
                <strong>Link</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data[category].map((event, index) => (
              <TableRow key={index}>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.name}</TableCell>
                {category == "ultra-marathon" ? (
                  <>
                    <TableCell>{event.distance}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>{event.gain}</TableCell>
                    <TableCell>
                      {calculateEffort(
                        event.distance,
                        event.gain,
                        event.time,
                      ).toFixed(2)}
                    </TableCell>
                  </>
                ) : null}
                <TableCell>
                  <Link href={event.link} target="_blank" rel="noopener">
                    Website
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} title="Future Events">
      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Registered" value="registered" />
        <Tab label="Deferred" value="deferred" />
      </Tabs>
      {renderTable("marathon")}
      {renderTable("ultra-marathon")}
    </Dialog>
  );
};

export default FutureEventsDialog;
