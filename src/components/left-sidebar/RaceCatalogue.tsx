import { useEffect, useState } from "react";
import rawFutureEvents from "../../../data/future-events.json";
import Dialog from "../common/Dialog";
import { FutureEvents } from "../../types/FutureEvents";
import FutureEventsTables from "./FutureEventsTables";

interface Props {
  open: boolean;
  onClose: () => void;
}

const RaceCatalogueDialog = ({ open, onClose }: Props) => {
  const [futureEvents, setFutureEvents] = useState<FutureEvents | null>(null);

  useEffect(() => {
    setFutureEvents(rawFutureEvents);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} title="Race Catalogue">
      {futureEvents && <FutureEventsTables data={futureEvents.deferred} />}
    </Dialog>
  );
};

export default RaceCatalogueDialog;
