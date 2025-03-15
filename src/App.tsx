import { useRef, useState } from "react";
import EventMap from "./components/map";
import Sidebar from "./components/sidebar";
import { Race } from "./types/race";
import { TileLayerOption, tileOptions } from "./types/tiles";
import { TagOption } from "./components/sidebar/tag";

function App() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedTile, setSelectedTile] = useState<TileLayerOption>(
    tileOptions[0]
  );
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const map = useRef<L.Map | null>(null);

  return (
    <div className="app-container">
      <EventMap
        selectedRace={selectedRace}
        onSelectRace={setSelectedRace}
        selectedTile={selectedTile}
        map={map}
        selectedTags={selectedTags}
      />
      <Sidebar
        selectedRace={selectedRace}
        onSelectRace={setSelectedRace}
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
