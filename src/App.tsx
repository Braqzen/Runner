import { useRef, useState } from "react";
import EventMap from "./components/map";
import Sidebar from "./components/sidebar";
import { Event } from "./types/event";
import { TileLayerOption, tileOptions } from "./types/tiles";
import { TagOption } from "./components/sidebar/tag";

function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTile, setSelectedTile] = useState<TileLayerOption>(
    tileOptions[0]
  );
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const map = useRef<L.Map | null>(null);

  return (
    <div className="app-container">
      <EventMap
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        selectedTile={selectedTile}
        map={map}
        selectedTags={selectedTags}
      />
      <Sidebar
        selectedEvent={selectedEvent}
        onSelectEvent={setSelectedEvent}
        tileOptions={tileOptions}
        selectedTile={selectedTile}
        onTileChange={setSelectedTile}
        map={map}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />
    </div>
  );
}

export default App;
