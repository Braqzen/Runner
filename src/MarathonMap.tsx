import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import raceData from "../races.json";
import { Race } from "./types";

const MarathonMap = () => {
  const [races, setRaces] = useState<Race[]>([]);

  useEffect(() => {
    setRaces(raceData);
  }, []);

  return (
    <div className="map-container">
      <MapContainer center={[51.505, -0.09]} zoom={3} className="map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {races.map((race, index) => (
          <Marker key={race.id} position={[race.location.lat, race.location.lng]}>
            <Popup>
              <strong>{race.name}</strong><br />
              Event #{index + 1}<br />
              Date: {race.date}<br />
              Distance: {race.distance}<br />
              Time: {race.time}<br />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MarathonMap;
