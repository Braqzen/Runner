import { RefObject, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import raceData from "../../races.json";
import { Race } from "../types/race";
import { TileLayerOption } from "../types/tiles";
import { TagOption } from "./sidebar/tag";
import { defaultIcon, selectedIcon } from "./map/marker";
import { RoutePolyline } from "./map/route";
import { Initializer } from "./map/initializer";
import PopupContent from "./map/popup";

interface EventMapProps {
  selectedRace: Race | null;
  onSelectRace: (race: Race) => void;
  selectedTile: TileLayerOption;
  map: RefObject<L.Map | null>;
  selectedTags: TagOption[];
}

const EventMap = ({
  selectedRace,
  onSelectRace,
  selectedTile,
  map,
  selectedTags,
}: EventMapProps) => {
  const [races, setRaces] = useState<Race[]>([]);
  const markers = useRef<Map<number, L.Marker | null>>(new Map());
  const [showRoute, setShowRoute] = useState(false);

  useEffect(() => {
    // TS is dumb so force the linter to understand that each route is an array of 2 coordinates
    const data = raceData.map((race) => ({
      ...race,
      route: race.route.map((coords) => coords as [number, number]),
    }));
    setRaces(data);
  }, []);

  useEffect(() => {
    if (selectedRace && map.current) {
      map.current.flyTo(
        [selectedRace.location.lat, selectedRace.location.lng],
        12,
        { animate: true, duration: 2 }
      );

      map.current.once("moveend", () => {
        setShowRoute(true);
      });

      const marker = markers.current.get(selectedRace.id);
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedRace]);

  const filteredRaces =
    selectedTags.length === 0
      ? races
      : races.filter((race) =>
          selectedTags.every(
            (tag) => race.tags && race.tags.includes(tag.value)
          )
        );

  const isFilteredRoute =
    selectedRace !== null &&
    filteredRaces.some((race) => race.id === selectedRace.id);

  return (
    <div className="map-container">
      <MapContainer center={[51.505, -0.09]} zoom={3} className="map">
        <Initializer map={map} />

        <TileLayer
          url={selectedTile.url}
          minZoom={selectedTile.minZoom}
          maxZoom={selectedTile.maxZoom}
          attribution={selectedTile.attribution}
        />

        {filteredRaces.map((race) => (
          <Marker
            key={race.id}
            position={[race.location.lat, race.location.lng]}
            icon={selectedRace?.id === race.id ? selectedIcon : defaultIcon}
            ref={(ref) => {
              if (ref) markers.current.set(race.id, ref);
            }}
            eventHandlers={{
              click: () => onSelectRace(race),
            }}
          >
            <Popup>
              <PopupContent
                race={race}
                filteredRaces={filteredRaces}
                onSelectRace={onSelectRace}
              />
            </Popup>
          </Marker>
        ))}
        {showRoute &&
          isFilteredRoute &&
          selectedRace &&
          selectedRace.route.length > 1 && (
            <RoutePolyline race={selectedRace} />
          )}
      </MapContainer>
    </div>
  );
};

export default EventMap;
