import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import raceData from "../races.json";
import { Race } from "./types";
import L from "leaflet";

const MapInitializer = ({ mapRef }: { mapRef: React.RefObject<L.Map | null> }) => {
    const map = useMap();
    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = map;
        }
    }, [map, mapRef]);

    return null;
};

const MarathonMap = ({ selectedRace }: { selectedRace: Race | null }) => {
    const [races, setRaces] = useState<Race[]>([]);
    const mapRef = useRef<L.Map | null>(null);
    const markerRefs = useRef<Record<number, L.Marker | null>>({});

    useEffect(() => {
        setRaces(raceData);
    }, []);

    useEffect(() => {
        if (selectedRace && mapRef.current) {
            mapRef.current.flyTo(
                [selectedRace.location.lat, selectedRace.location.lng],
                12, 
                { animate: true, duration: 2 }
            );

            const marker = markerRefs.current[selectedRace.id];
            if (marker) {
                marker.openPopup();
            }
        }
    }, [selectedRace]);

    return (
        <div className="map-container">
        <MapContainer center={[51.505, -0.09]} zoom={3} className="map">
            <MapInitializer mapRef={mapRef} />

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {races.map((race) => (
            <Marker
                key={race.id}
                position={[race.location.lat, race.location.lng]}
                ref={(ref) => {
                    if (ref) markerRefs.current[race.id] = ref;
                }}
            >
                <Popup>
                    <strong>{race.name}</strong><br />
                    Event #{races.indexOf(race) + 1}<br />
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
