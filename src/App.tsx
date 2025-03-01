import { useState } from "react";
import EventMap from "./components/map";
import Sidebar from "./components/sidebar";
import { Race } from "./types/race";

function App() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);

  return (
    <div className="app-container">
      <EventMap selectedRace={selectedRace} onSelectRace={setSelectedRace} />
      <Sidebar onSelectRace={setSelectedRace} />
    </div>
  );
}

export default App;
