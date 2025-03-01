import { useEffect, useState } from "react";
import raceData from "../races.json";
import { Race } from "./types";

const Sidebar = ({ onSelectRace }: { onSelectRace: (race: Race) => void }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");

  useEffect(() => {
    setRaces(raceData);
  }, []);

  const uniqueTags = Array.from(
    new Set(races.flatMap((race) => race.tags || []))
  );

  const filteredRaces =
    selectedTag === "All"
      ? races
      : races.filter((race) => race.tags.includes(selectedTag));

  return (
    <div className="sidebar">
      <h2>Events</h2>
      <div className="filter">
        <label htmlFor="tagFilter">Filter by Tag: </label>
        <select
          id="tagFilter"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="All">All</option>
          {uniqueTags.map((tag, i) => (
            <option key={i} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
      <ul>
        {filteredRaces.map((race, index) => (
          <li key={race.id} className="event" onClick={() => onSelectRace(race)}>
            <strong>{index + 1}) {race.name}</strong>
            <p>Date: {race.date}</p>
            <p>Distance: {race.distance}</p>
            <p>Time: {race.time}</p>
            <p>Tags: {race.tags.join(", ")}</p>
            <p><a href={race.link} target="_blank" className="event-link">
                Event Link
            </a></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
