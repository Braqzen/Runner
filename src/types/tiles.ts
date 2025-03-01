export interface TileLayerOption {
  name: string;
  url: string;
  minZoom?: number;
  maxZoom?: number;
  attribution?: string;
}

// https://github.com/leaflet-extras/leaflet-providers
export const tileOptions: TileLayerOption[] = [
  {
    name: "OpenStreetMap Standard",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  },
  {
    name: "Stadia Alidade Smooth",
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "Stadia Alidade Smooth Dark",
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    name: "Stadia Stamen Toner",
    url: "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png",
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
];

// var Jawg_Dark = L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
// 	attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// 	minZoom: 0,
// 	maxZoom: 22,
// 	accessToken: '<your accessToken>'
// });
