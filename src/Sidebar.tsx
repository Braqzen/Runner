import { useEffect, useState } from "react";
import raceData from "../races.json";
import { Race } from "./types";

const Sidebar = ({ onSelectRace }: { onSelectRace: (race: Race) => void }) => {
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    setRaces(raceData);
  }, []);

  return (
    <div className="sidebar">
      <h2>Events</h2>
      <ul>
        {races.map((race, index) => (
          <li key={race.id} className="event" onClick={() => onSelectRace(race)}>
            <strong>{index + 1}) {race.name}</strong>
            <p>Date: {race.date}</p>
            <p>Distance: {race.distance}</p>
            <p>Time: {race.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
