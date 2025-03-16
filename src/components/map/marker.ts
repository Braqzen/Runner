import L from "leaflet";
import defaultMarker from "../../assets/marker-icon-blue.png";
import selectedMarker from "../../assets/marker-icon-green.png";
import shadowMarker from "../../assets/marker-shadow.png";

const iconSize: [number, number] = [25, 41];
const iconAnchor: [number, number] = [12, 41];
const popupAnchor: [number, number] = [1, -34];
const shadowSize: [number, number] = [41, 41];

export const defaultIcon = new L.Icon({
  iconUrl: defaultMarker,
  shadowUrl: shadowMarker,
  iconSize,
  iconAnchor,
  popupAnchor,
  shadowSize,
});

export const selectedIcon = new L.Icon({
  iconUrl: selectedMarker,
  shadowUrl: shadowMarker,
  iconSize,
  iconAnchor,
  popupAnchor,
  shadowSize,
});
