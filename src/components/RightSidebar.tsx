import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import { Event } from "../types/Event";
import { TagOption } from "./right-sidebar/Tag";
import FilterDrawer from "./right-sidebar/FilterDrawer";
import CardsDrawer from "./right-sidebar/CardDrawer";

interface Props {
  events: Event[];
  filteredEvents: Event[];
  selectedEvent: Event | null;
  onSelectEvent: (event: Event) => void;
  onDateChange: (tags: TagOption[]) => void;
  onRegionChange: (tags: TagOption[]) => void;
  onTypeChange: (tags: TagOption[]) => void;
  notes: Event | null;
  setNotes: (event: Event | null) => void;
  openNotes: boolean;
  setOpenNotes: (open: boolean) => void;
}

const RightSidebar = ({
  events,
  filteredEvents,
  selectedEvent,
  onSelectEvent,
  onDateChange,
  onRegionChange,
  onTypeChange,
  notes,
  setNotes,
  openNotes,
  setOpenNotes,
}: Props) => {
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openCardsDrawer, setOpenCardsDrawer] = useState(false);

  const dateOptions = generateOptions(events, "date");
  const regionOptions = generateOptions(events, "region");
  const typeOptions = generateOptions(events, "type");

  return (
    <>
      <Box className="right-sidebar" sx={{ pt: 3 }}>
        <IconButton
          color="inherit"
          onClick={() => setOpenFilterDrawer(true)}
          title="Filter"
        >
          <FilterListIcon fontSize="large" />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => setOpenCardsDrawer(true)}
          title="Events"
        >
          <ViewListIcon fontSize="large" />
        </IconButton>
      </Box>

      <FilterDrawer
        open={openFilterDrawer}
        onClose={() => setOpenFilterDrawer(false)}
        dateOptions={dateOptions}
        regionOptions={regionOptions}
        typeOptions={typeOptions}
        onDateChange={onDateChange}
        onRegionChange={onRegionChange}
        onTypeChange={onTypeChange}
      />

      <CardsDrawer
        open={openCardsDrawer}
        onClose={() => setOpenCardsDrawer(false)}
        filteredEvents={filteredEvents}
        selectedEvent={selectedEvent}
        onSelectEvent={onSelectEvent}
        notes={notes}
        setNotes={setNotes}
        openNotes={openNotes}
        setOpenNotes={setOpenNotes}
      />
    </>
  );
};

const generateOptions = (events: Event[], key: keyof Event["tags"]) =>
  Array.from(new Set(events.flatMap((event) => event.tags[key]))).map(
    (label) => ({
      label,
      value: label,
    })
  );

export default RightSidebar;
