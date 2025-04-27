import L from "leaflet";
import defaultMarker from "../../assets/marker-icon-blue.png";
import selectedMarker from "../../assets/marker-icon-green.png";
import shadowMarker from "../../assets/marker-shadow.png";

const iconOptions = {
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
  shadowUrl: shadowMarker,
};

const createIcon = (iconUrl: string): L.Icon =>
  new L.Icon({ ...iconOptions, iconUrl });

export const defaultIcon: L.Icon = createIcon(defaultMarker);
export const selectedIcon: L.Icon = createIcon(selectedMarker);

const labelStyle = `
  font-size: 1.0rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
`;

export const startIcon = L.divIcon({
  html: `<div style="${labelStyle}">Start</div>`,
  className: "",
  iconSize: [53, 30],
  iconAnchor: [30, 15],
});

export const finishIcon = L.divIcon({
  html: `<div style="${labelStyle}">Finish</div>`,
  className: "",
  iconSize: [63, 30],
  iconAnchor: [30, 15],
});
