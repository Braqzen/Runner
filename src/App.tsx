import { useState } from "react";
import EventMap from "./components/map";
import Sidebar from "./components/sidebar";
import { Race } from "./types/race";
import { TileLayerOption, tileOptions } from "./types/tiles";

function App() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedTile, setSelectedTile] = useState<TileLayerOption>(
    tileOptions[0]
  );

  return (
    <div className="app-container">
      <EventMap
        selectedRace={selectedRace}
        onSelectRace={setSelectedRace}
        selectedTile={selectedTile}
      />
      <Sidebar
        onSelectRace={setSelectedRace}
        tileOptions={tileOptions}
        selectedTile={selectedTile}
        onTileChange={setSelectedTile}
      />
    </div>
  );
}

export default App;
