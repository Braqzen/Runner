import { RefObject, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import rawEvents from "../../events.json";
import { Event } from "../types/event";
import { TileLayerOption } from "../types/tiles";
import { TagOption } from "./sidebar/tag";
import { defaultIcon, selectedIcon } from "./map/marker";
import { RoutePolyline } from "./map/route";
import { Initializer } from "./map/initializer";
import PopupContent from "./map/popup";

interface EventMapProps {
  selectedEvent: Event | null;
  onSelectEvent: (event: Event) => void;
  selectedTile: TileLayerOption;
  map: RefObject<L.Map | null>;
  selectedTags: TagOption[];
}

const EventMap = ({
  selectedEvent,
  onSelectEvent,
  selectedTile,
  map,
  selectedTags,
}: EventMapProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const markers = useRef<Map<number, L.Marker | null>>(new Map());
  const [showRoute, setShowRoute] = useState(false);

  useEffect(() => {
    const data = rawEvents.map((event) => ({
      ...event,
      route: event.route.map((coords) => coords as [number, number]),
    }));
    setEvents(data);
  }, []);

  useEffect(() => {
    if (selectedEvent && map.current) {
      map.current.flyTo(
        [selectedEvent.location.lat, selectedEvent.location.lng],
        12,
        { animate: true, duration: 2 }
      );

      map.current.once("moveend", () => {
        setShowRoute(true);
      });

      const marker = markers.current.get(selectedEvent.id);
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedEvent]);

  const filteredEvents =
    selectedTags.length === 0
      ? events
      : events.filter((event) =>
          selectedTags.every(
            (tag) => event.tags && event.tags.includes(tag.value)
          )
        );

  const isFilteredRoute =
    selectedEvent !== null &&
    filteredEvents.some((event) => event.id === selectedEvent.id);

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

        {filteredEvents.map((event) => (
          <Marker
            key={event.id}
            position={[event.location.lat, event.location.lng]}
            icon={selectedEvent?.id === event.id ? selectedIcon : defaultIcon}
            ref={(ref) => {
              if (ref) markers.current.set(event.id, ref);
            }}
            eventHandlers={{
              click: () => onSelectEvent(event),
            }}
          >
            <Popup>
              <PopupContent
                event={event}
                filteredEvents={filteredEvents}
                onSelectEvent={onSelectEvent}
              />
            </Popup>
          </Marker>
        ))}
        {showRoute &&
          isFilteredRoute &&
          selectedEvent &&
          selectedEvent.route.length > 0 && (
            <RoutePolyline event={selectedEvent} />
          )}
      </MapContainer>
    </div>
  );
};

export default EventMap;
