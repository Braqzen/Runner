import { useEffect, useMemo, useRef, useState } from "react";
import { Event } from "./types/Event";
import { TileLayerOption, tileOptions } from "./types/Tiles";
import EventMap from "./components/Map";
import { TagOption } from "./components/right-sidebar/Tag";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import rawEvents from "../data/events.json";
import NotesDialog from "./components/right-sidebar/NoteDialog";

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
  const [selectedDateTags, setSelectedDateTags] = useState<TagOption[]>([]);
  const [selectedRegionTags, setSelectedRegionTags] = useState<TagOption[]>([]);
  const [selectedTypeTags, setSelectedTypeTags] = useState<TagOption[]>([]);
  const map = useRef<L.Map | null>(null);
  const [notes, setNotes] = useState<Event | null>(null);
  const [openNotes, setOpenNotes] = useState(false);

  useEffect(() => {
    const data = rawEvents.map((event) => ({
      ...event,
      route: event.route.map((coords) => coords as [number, number]),
    }));
    setEvents(data);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const dateMatch =
        selectedDateTags.length === 0 ||
        selectedDateTags.some((tag) => event.tags.date.includes(tag.value));
      const regionMatch =
        selectedRegionTags.length === 0 ||
        selectedRegionTags.some((tag) => event.tags.region.includes(tag.value));
      const typeMatch =
        selectedTypeTags.length === 0 ||
        selectedTypeTags.some((tag) => event.tags.type.includes(tag.value));
      return dateMatch && regionMatch && typeMatch;
    });
  }, [events, selectedDateTags, selectedRegionTags, selectedTypeTags]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "n" && selectedEvent) {
        setOpenNotes(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent]);

  return (
    <div className="app-container">
      <LeftSidebar
        filteredEvents={filteredEvents}
        map={map}
        selectedTile={selectedTile}
        setSelectedTile={setSelectedTile}
        tileOptions={tileOptions}
      />

      <EventMap
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        selectedTile={selectedTile}
        map={map}
        filteredEvents={filteredEvents}
        setNotes={setNotes}
        setOpenNotes={setOpenNotes}
      />

      <RightSidebar
        events={events}
        filteredEvents={filteredEvents}
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        onDateChange={setSelectedDateTags}
        onRegionChange={setSelectedRegionTags}
        onTypeChange={setSelectedTypeTags}
        notes={notes}
        setNotes={setNotes}
        openNotes={openNotes}
        setOpenNotes={setOpenNotes}
      />

      {notes && (
        <NotesDialog
          open={openNotes}
          event={notes}
          onClose={() => setOpenNotes(false)}
        />
      )}
    </div>
  );
}

export default App;
