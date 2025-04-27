import { RefObject, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Event } from "../types/Event";
import { TileLayerOption } from "../types/Tiles";
import { defaultIcon, selectedIcon } from "./map/Marker";
import { RoutePolyline } from "./map/Route";
import { Initializer } from "./map/Initializer";
import PopupContent from "./map/Popup";

interface Props {
  selectedEvent: Event | null;
  onSelectEvent: (event: Event) => void;
  selectedTile: TileLayerOption;
  map: RefObject<L.Map | null>;
  filteredEvents: Event[];
  setNotes: (event: Event | null) => void;
  setOpenNotes: (open: boolean) => void;
}

const EventMap = ({
  selectedEvent,
  onSelectEvent,
  selectedTile,
  map,
  filteredEvents,
  setNotes,
  setOpenNotes,
}: Props) => {
  const markers = useRef<Map<number, L.Marker | null>>(new Map());
  const [showRoute, setShowRoute] = useState(false);
  const minZoomForRoute = 11;

  useEffect(() => {
    if (!selectedEvent || !map.current) return;

    const mapInstance = map.current;
    const marker = markers.current.get(selectedEvent.id);

    if (mapInstance.getZoom() >= minZoomForRoute) {
      setShowRoute(true);
    } else {
      setShowRoute(false);
    }

    const handleZoom = () => {
      const zoom = mapInstance.getZoom();
      setShowRoute(zoom >= minZoomForRoute);
    };

    mapInstance.on("zoomend", handleZoom);

    if (marker) {
      marker.openPopup();
    }

    return () => {
      mapInstance.off("zoomend", handleZoom);
    };
  }, [selectedEvent]);

  useEffect(() => {
    if (!selectedEvent) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
        const index = filteredEvents.findIndex(
          (event) => event.id === selectedEvent.id
        );
        if (index === -1) return;

        if (e.key === "ArrowLeft" && index > 0) {
          onSelectEvent(filteredEvents[index - 1]);
        } else if (
          e.key === "ArrowRight" &&
          index < filteredEvents.length - 1
        ) {
          onSelectEvent(filteredEvents[index + 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedEvent, filteredEvents, onSelectEvent]);

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
                setNotes={setNotes}
                setOpenNotes={setOpenNotes}
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
