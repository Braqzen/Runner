import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Event } from "./types/Event";
import { TileLayerOption, tileOptions } from "./types/Tiles";
import EventMap from "./components/Map";
import { TagOption } from "./components/sidebar/Tag";
import Sidebar from "./components/Sidebar";
import rawEvents from "../data/events.json";

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [selectedTile, setSelectedTile] = useState<TileLayerOption>(() => {
    try {
      const savedTile = localStorage.getItem("selectedTile");
      return savedTile ? (JSON.parse(savedTile) as TileLayerOption) : tileOptions[0];
    } catch {
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
    setEvents(data as Event[]);
  }, []);

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
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
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [events, selectedDateTags, selectedRegionTags, selectedTypeTags]);

  const handleSelectEvent = useCallback((event: Event) => {
    setSelectedEvent((prev) => (prev?.id === event.id ? null : event));
  }, []);

  const handlePinEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
  }, []);

  const handleHoverEvent = useCallback((event: Event | null) => {
    setHoveredEvent(event);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "n" && selectedEvent) {
        setNotes(selectedEvent);
        setOpenNotes(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEvent]);

  return (
    <div className="app-container">
      <Sidebar
        events={events}
        filteredEvents={filteredEvents}
        selectedEvent={selectedEvent}
        hoveredEvent={hoveredEvent}
        onSelectEvent={handleSelectEvent}
        onPinEvent={handlePinEvent}
        onHoverEvent={handleHoverEvent}
        selectedDateTags={selectedDateTags}
        selectedRegionTags={selectedRegionTags}
        selectedTypeTags={selectedTypeTags}
        onDateChange={setSelectedDateTags}
        onRegionChange={setSelectedRegionTags}
        onTypeChange={setSelectedTypeTags}
        selectedTile={selectedTile}
        setSelectedTile={setSelectedTile}
        tileOptions={tileOptions}
        notes={notes}
        setNotes={setNotes}
        openNotes={openNotes}
        setOpenNotes={setOpenNotes}
      />

      <EventMap
        selectedEvent={selectedEvent}
        hoveredEvent={hoveredEvent}
        onSelectEvent={handleSelectEvent}
        onHoverEvent={handleHoverEvent}
        selectedTile={selectedTile}
        map={map}
        filteredEvents={filteredEvents}
        setNotes={setNotes}
        setOpenNotes={setOpenNotes}
      />
    </div>
  );
}

export default App;
