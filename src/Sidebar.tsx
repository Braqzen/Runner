import { useEffect, useState } from "react";
import raceData from "../races.json";
import { Race } from "./types";

const Sidebar = ({ onSelectRace }: { onSelectRace: (race: Race) => void }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    setRaces(raceData);
  }, []);

  const uniqueTags = Array.from(
    new Set(races.flatMap((race) => race.tags || []))
  );

  const filteredRaces =
    selectedTags.length === 0
      ? races
      : races.filter((race) => {
          if (!race.tags) return false;
          return selectedTags.every((tag) => race.tags.includes(tag));
        });

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

  return (
    <div className="sidebar">
      <h2>Events</h2>
      <div className="filter">
        <h3>Filter by Tags:</h3>
        {uniqueTags.map((tag, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`tag-${tag}`}
              value={tag}
              checked={selectedTags.includes(tag)}
              onChange={() => toggleTag(tag)}
            />
            <label htmlFor={`tag-${tag}`}>{tag}</label>
          </div>
        ))}
      </div>
      <ul>
        {filteredRaces.map((race, index) => (
          <li key={race.id} className="event" onClick={() => onSelectRace(race)}>
            <strong>{index + 1}) {race.name}</strong>
            <p>Type: {race.type}</p>
            <p>Date: {race.date}</p>
            <p>Distance: {race.distance}</p>
            <p>Time: {race.time}</p>
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
