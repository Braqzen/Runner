import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Race } from "../../types/race";

interface RouteProps {
  race: Race | null;
}

export const RoutePolyline = ({ race }: RouteProps) => {
  const map = useMap();
  const polylineRef = useRef<L.Polyline | null>(null);
  const minZoomForRoute = 9;

  useEffect(() => {
    const updatePolyline = () => {
      if (race?.route && race.route.length > 0) {
        const currentZoom = map.getZoom();
        if (currentZoom >= minZoomForRoute) {
          if (!polylineRef.current) {
            polylineRef.current = L.polyline(race.route, {
              color: "blue",
              weight: 4,
            });
            polylineRef.current.addTo(map);
          }
        } else {
          if (polylineRef.current) {
            map.removeLayer(polylineRef.current);
            polylineRef.current = null;
          }
        }
      }
    };

    updatePolyline();
    map.on("zoomend", updatePolyline);

    return () => {
      map.off("zoomend", updatePolyline);
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
    };
  }, [map, race]);

  return null;
};
