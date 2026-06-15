import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import { Event } from "../types/Event";
import { TileLayerOption } from "../types/Tiles";
import { TagOption } from "./sidebar/Tag";
import FilterPanel from "./sidebar/FilterPanel";
import EventList from "./sidebar/EventList";
import NavSection from "./sidebar/NavSection";
import SidebarPanelTabs, { SidebarPanel } from "./sidebar/SidebarPanelTabs";
import SummaryDialog from "./left-sidebar/Summary";
import YearCalendarDialog from "./left-sidebar/YearCalendar";
import ChallengeDialog from "./left-sidebar/Challenge";
import RegisteredEventsDialog from "./left-sidebar/RegisteredEvents";
import RaceCatalogueDialog from "./left-sidebar/RaceCatalogue";
import SettingsDialog from "./left-sidebar/Settings";
import NotesDialog from "./right-sidebar/NoteDialog";

interface Props {
  events: Event[];
  filteredEvents: Event[];
  selectedEvent: Event | null;
  hoveredEvent: Event | null;
  onSelectEvent: (event: Event) => void;
  onPinEvent: (event: Event) => void;
  onHoverEvent: (event: Event | null) => void;
  selectedDateTags: TagOption[];
  selectedRegionTags: TagOption[];
  selectedTypeTags: TagOption[];
  onDateChange: (tags: TagOption[]) => void;
  onRegionChange: (tags: TagOption[]) => void;
  onTypeChange: (tags: TagOption[]) => void;
  selectedTile: TileLayerOption;
  setSelectedTile: (tile: TileLayerOption) => void;
  tileOptions: TileLayerOption[];
  notes: Event | null;
  setNotes: (event: Event | null) => void;
  openNotes: boolean;
  setOpenNotes: (open: boolean) => void;
}

const generateOptions = (events: Event[], key: keyof Event["tags"]) =>
  Array.from(new Set(events.flatMap((event) => event.tags[key]))).map(
    (label) => ({
      label,
      value: label,
    }),
  );

const Sidebar = ({
  events,
  filteredEvents,
  selectedEvent,
  hoveredEvent,
  onSelectEvent,
  onPinEvent,
  onHoverEvent,
  selectedDateTags,
  selectedRegionTags,
  selectedTypeTags,
  onDateChange,
  onRegionChange,
  onTypeChange,
  selectedTile,
  setSelectedTile,
  tileOptions,
  notes,
  setNotes,
  openNotes,
  setOpenNotes,
}: Props) => {
  const [panel, setPanel] = useState<SidebarPanel>("events");
  const [openSummary, setOpenSummary] = useState(false);
  const [openYearCalendar, setOpenYearCalendar] = useState(false);
  const [openChallenges, setOpenChallenges] = useState(false);
  const [openRegistered, setOpenRegistered] = useState(false);
  const [openCatalogue, setOpenCatalogue] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const dateOptions = generateOptions(events, "date");
  const regionOptions = generateOptions(events, "region");
  const typeOptions = generateOptions(events, "type");
  const activeFilterCount =
    selectedDateTags.length +
    selectedRegionTags.length +
    selectedTypeTags.length;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "s") {
        setOpenSummary(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNotes = (event: Event) => {
    onPinEvent(event);
    setNotes(event);
    setOpenNotes(true);
  };

  const handleTileChange = (newTile: TileLayerOption) => {
    setSelectedTile(newTile);
    localStorage.setItem("selectedTile", JSON.stringify(newTile));
  };

  return (
    <Box className="app-sidebar">
      <Box className="sidebar-content">
        <SidebarPanelTabs
          panel={panel}
          onPanelChange={setPanel}
          eventCount={filteredEvents.length}
          activeFilterCount={activeFilterCount}
        />

        <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {panel === "filters" ? (
            <FilterPanel
              dateOptions={dateOptions}
              regionOptions={regionOptions}
              typeOptions={typeOptions}
              selectedDateTags={selectedDateTags}
              selectedRegionTags={selectedRegionTags}
              selectedTypeTags={selectedTypeTags}
              onDateChange={onDateChange}
              onRegionChange={onRegionChange}
              onTypeChange={onTypeChange}
            />
          ) : (
            <EventList
              events={filteredEvents}
              selectedEvent={selectedEvent}
              hoveredEvent={hoveredEvent}
              onSelectEvent={onSelectEvent}
              onHoverEvent={onHoverEvent}
              onNotes={handleNotes}
            />
          )}
        </Box>
      </Box>

      <NavSection
        items={[
          {
            id: "summary",
            label: "Past Events",
            icon: <LeaderboardIcon />,
            onClick: () => setOpenSummary(true),
          },
          {
            id: "calendar",
            label: "Calendar",
            icon: <CalendarMonthIcon />,
            onClick: () => setOpenYearCalendar(true),
          },
          {
            id: "challenges",
            label: "Achievements",
            icon: <EmojiEventsIcon />,
            onClick: () => setOpenChallenges(true),
          },
          {
            id: "registered",
            label: "Registered Events",
            icon: <EventAvailableIcon />,
            onClick: () => setOpenRegistered(true),
          },
          {
            id: "catalogue",
            label: "Race Catalogue",
            icon: <BookmarkBorderIcon />,
            onClick: () => setOpenCatalogue(true),
          },
        ]}
        bottomItems={[
          {
            id: "settings",
            label: "Settings",
            icon: <SettingsIcon />,
            onClick: () => setOpenSettings(true),
          },
        ]}
      />

      <SummaryDialog
        open={openSummary}
        events={filteredEvents}
        onClose={() => setOpenSummary(false)}
      />
      <YearCalendarDialog
        open={openYearCalendar}
        events={filteredEvents}
        onClose={() => setOpenYearCalendar(false)}
      />
      <ChallengeDialog
        open={openChallenges}
        onClose={() => setOpenChallenges(false)}
      />
      <RegisteredEventsDialog
        open={openRegistered}
        onClose={() => setOpenRegistered(false)}
      />
      <RaceCatalogueDialog
        open={openCatalogue}
        onClose={() => setOpenCatalogue(false)}
      />
      <SettingsDialog
        open={openSettings}
        selectedTile={selectedTile}
        tileOptions={tileOptions}
        onTileChange={handleTileChange}
        onClose={() => setOpenSettings(false)}
      />

      {notes && (
        <NotesDialog
          open={openNotes}
          event={notes}
          onClose={() => setOpenNotes(false)}
        />
      )}
    </Box>
  );
};

export default Sidebar;
