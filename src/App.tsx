import { useState } from "react";
import MarathonMap from "./MarathonMap";
import Sidebar from "./Sidebar";
import { Race } from "./types";

function App() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  return (
    <div className="app-container">
      <MarathonMap selectedRace={selectedRace} onSelectRace={setSelectedRace} />
      <Sidebar onSelectRace={setSelectedRace} />
    </div>
  );
}

export default App;
