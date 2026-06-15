import { useEffect, useState } from "react";
import rawFutureEvents from "../../../data/future-events.json";
import Dialog from "../common/Dialog";
import { FutureEvents } from "../../types/FutureEvents";
import FutureEventsTables from "./FutureEventsTables";

interface Props {
  open: boolean;
  onClose: () => void;
}

const RegisteredEventsDialog = ({ open, onClose }: Props) => {
  const [futureEvents, setFutureEvents] = useState<FutureEvents | null>(null);

  useEffect(() => {
    setFutureEvents(rawFutureEvents);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} title="Registered Events">
      {futureEvents && (
        <FutureEventsTables data={futureEvents.registered} showCountdown />
      )}
    </Dialog>
  );
};

export default RegisteredEventsDialog;
