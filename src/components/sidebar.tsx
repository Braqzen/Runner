import { useEffect, useState } from "react";
import raceData from "../../races.json";
import { Race } from "../types/race";
import TagFilter, { TagOption } from "./tag";

const Sidebar = ({ onSelectRace }: { onSelectRace: (race: Race) => void }) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);

  useEffect(() => {
    setRaces(raceData);
  }, []);

  const uniqueTags = Array.from(
    new Set(races.flatMap((race) => race.tags || []))
  ).map((tag) => ({ label: tag, value: tag }));

  const filteredRaces =
    selectedTags.length === 0
      ? races
      : races.filter((race) =>
          selectedTags.every((tag) => race.tags.includes(tag.value))
        );

  return (
    <div className="sidebar">
      <h2>Events</h2>
      <TagFilter options={uniqueTags} onChange={setSelectedTags} />
      <ul>
        {filteredRaces.map((race, index) => (
          <li
            key={race.id}
            className="event"
            onClick={() => onSelectRace(race)}
          >
            <strong>
              {index + 1}) {race.name}
            </strong>
            <p>Type: {race.type}</p>
            <p>Date: {race.date}</p>
            <p>Distance: {race.distance}</p>
            <p>Time: {race.time}</p>
            <p>
              <a href={race.link} target="_blank" className="event-link">
                Event Link
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
