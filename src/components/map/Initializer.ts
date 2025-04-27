import { RefObject, useEffect } from "react";
import { useMap } from "react-leaflet";

interface InitializerProps {
  map: RefObject<L.Map | null>;
}

export const Initializer = ({ map }: InitializerProps) => {
  const leafletMap = useMap();
  useEffect(() => {
    if (!map.current) {
      map.current = leafletMap;
    }
  }, [leafletMap, map]);

  return null;
};
