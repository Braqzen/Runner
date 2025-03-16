import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Race } from "../../types/race";
import { finishIcon, startIcon } from "./marker";

interface RouteProps {
  race: Race | null;
}

export const RoutePolyline = ({ race }: RouteProps) => {
  const map = useMap();
  const polylineRef = useRef<L.Polyline | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const finishMarkerRef = useRef<L.Marker | null>(null);
  const minZoomForRoute = 9;

  useEffect(() => {
    const updateLayers = () => {
      if (race?.route && race.route.length > 0) {
        const zoom = map.getZoom();
        if (zoom >= minZoomForRoute) {
          if (!polylineRef.current) {
            polylineRef.current = L.polyline(race.route, {
              color: "blue",
              weight: 4,
            });

            startMarkerRef.current = L.marker(race.route[0], {
              icon: startIcon,
              interactive: false,
            });

            finishMarkerRef.current = L.marker(
              race.route[race.route.length - 1],
              { icon: finishIcon, interactive: false }
            );

            polylineRef.current.addTo(map);
            startMarkerRef.current.addTo(map);
            finishMarkerRef.current.addTo(map);
          }
        } else if (polylineRef.current) {
          map.removeLayer(polylineRef.current);
          map.removeLayer(startMarkerRef.current!);
          map.removeLayer(finishMarkerRef.current!);
          polylineRef.current = null;
          startMarkerRef.current = null;
          finishMarkerRef.current = null;
        }
      }
    };

    updateLayers();
    map.on("zoomend", updateLayers);

    return () => {
      map.off("zoomend", updateLayers);
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        map.removeLayer(startMarkerRef.current!);
        map.removeLayer(finishMarkerRef.current!);
        polylineRef.current = null;
        startMarkerRef.current = null;
        finishMarkerRef.current = null;
      }
    };
  }, [map, race]);

  return null;
};
