import { RefObject, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import raceData from "../../races.json";
import { Race } from "../types/race";
import defaultMarker from "../assets/marker-icon-blue.png";
import selectedMarker from "../assets/marker-icon-red.png";
import shadowMarker from "../assets/marker-shadow.png";
import { TileLayerOption } from "../types/tiles";
import { Box, Typography } from "@mui/material";
import { TagOption } from "./tag";

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

interface InitializerProps {
  map: RefObject<L.Map | null>;
}

const Initializer = ({ map }: InitializerProps) => {
  const leafletMap = useMap();
  useEffect(() => {
    if (!map.current) {
      map.current = leafletMap;
    }
  }, [leafletMap, map]);

  return null;
};

interface RouteProps {
  race: Race | null;
}

const RoutePolyline = ({ race }: RouteProps) => {
  const map = useMap();

  useEffect(() => {
    if (race?.route && race.route.length > 0) {
      const polyline = L.polyline(race.route, { color: "blue", weight: 4 });
      polyline.addTo(map);

      return () => {
        map.removeLayer(polyline);
      };
    }
  }, [map, race]);

  return null;
};

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
              <Box sx={{ "& p": { mb: 0.2, mt: 0 } }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontSize: "1.3rem", mb: 1 }}
                >
                  {race.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Type:</strong> {race.type}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Date:</strong> {race.date}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Distance:</strong> {race.distance}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  <strong>Time:</strong> {race.time}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        ))}
        {showRoute && selectedRace && selectedRace.route.length > 1 && (
          <RoutePolyline race={selectedRace} />
        )}
      </MapContainer>
    </div>
  );
};

export default EventMap;
