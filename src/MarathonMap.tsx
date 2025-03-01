import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import raceData from "../races.json";
import { Race } from "./types";
import L from "leaflet";
import defaultMarker from "./assets/marker-icon-blue.png";  
import selectedMarker from "./assets/marker-icon-red.png"; 
import shadowMarker from "./assets/marker-shadow.png"; 

const defaultIcon = new L.Icon({
    iconUrl: defaultMarker,
    shadowUrl: shadowMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
  
const selectedIcon = new L.Icon({
    iconUrl: selectedMarker,
    shadowUrl: shadowMarker,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const MapInitializer = ({ mapRef }: { mapRef: React.RefObject<L.Map | null> }) => {
    const map = useMap();
    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = map;
        }
    }, [map, mapRef]);

    return null;
};

const MarathonMap = ({ selectedRace, onSelectRace }: { selectedRace: Race | null; onSelectRace: (race: Race) => void }) => {
    const [races, setRaces] = useState<Race[]>([]);
    const mapRef = useRef<L.Map | null>(null);
    const markerRefs = useRef<Map<number, L.Marker | null>>(new Map());

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

            const marker = markerRefs.current.get(selectedRace.id);
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
                icon={selectedRace?.id === race.id ? selectedIcon : defaultIcon}
                ref={(ref) => {
                    if (ref) markerRefs.current.set(race.id, ref);
                }}
                eventHandlers={{
                    click: () => onSelectRace(race), 
                }}
            >
                <Popup>
                    <strong>{race.name}</strong><br />
                    Event #{races.indexOf(race) + 1}<br />
                    Date: {race.date}<br />
                    Distance: {race.distance}<br />
                    Time: {race.time}<br />
                    Tags: {race.tags.join(", ")}
                </Popup>
            </Marker>
            ))}
        </MapContainer>
        </div>
    );
};

export default MarathonMap;
