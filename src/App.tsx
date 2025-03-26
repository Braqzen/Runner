import { useEffect, useRef, useState } from "react";
import EventMap from "./components/map";
import RightSidebar from "./components/rightSidebar";
import { Event } from "./types/event";
import { TileLayerOption, tileOptions } from "./types/tiles";
import { TagOption } from "./components/right-sidebar/tag";
import LeftSidebar from "./components/leftSidebar";
import SummaryDialog from "./components/summary";
import rawEvents from "../events.json";
import SettingsDialog from "./components/settings";

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTile, setSelectedTile] = useState<TileLayerOption>(() => {
    try {
      const savedTile = localStorage.getItem("selectedTile");
      return savedTile
        ? (JSON.parse(savedTile) as TileLayerOption)
        : tileOptions[0];
    } catch (error) {
      return tileOptions[0];
    }
  });
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const map = useRef<L.Map | null>(null);
  const [openSummary, setOpenSummary] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    const data = rawEvents.map((event) => ({
      ...event,
      route: event.route.map((coords) => coords as [number, number]),
    }));
    setEvents(data);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "s") {
        setOpenSummary(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredEvents =
    selectedTags.length === 0
      ? events
      : events.filter((event) =>
          selectedTags.every((tag) => event.tags.includes(tag.value))
        );

  const handleTileChange = (newTile: TileLayerOption) => {
    setSelectedTile(newTile);
    localStorage.setItem("selectedTile", JSON.stringify(newTile));
  };

  return (
    <div className="app-container">
      <LeftSidebar
        onOpenSummary={() => setOpenSummary(true)}
        onOpenSettings={() => setOpenSettings(true)}
      />

      <EventMap
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        selectedTile={selectedTile}
        map={map}
        selectedTags={selectedTags}
      />

      <RightSidebar
        events={events}
        filteredEvents={filteredEvents}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        map={map}
        onTagsChange={setSelectedTags}
      />

      <SummaryDialog
        open={openSummary}
        events={filteredEvents}
        onClose={() => setOpenSummary(false)}
      />

      <SettingsDialog
        open={openSettings}
        selectedTile={selectedTile}
        tileOptions={tileOptions}
        onTileChange={handleTileChange}
        onClose={() => setOpenSettings(false)}
      />
    </div>
  );
}

export default App;
