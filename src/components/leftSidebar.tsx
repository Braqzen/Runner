import { Box, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { RefObject, useEffect, useState } from "react";
import SummaryDialog from "./summary";
import SettingsDialog from "./settings";
import { TileLayerOption } from "../types/tiles";
import { Event } from "../types/event";

interface Props {
  filteredEvents: Event[];
  map: RefObject<L.Map | null>;
  selectedTile: TileLayerOption;
  setSelectedTile: (tile: TileLayerOption) => void;
  tileOptions: TileLayerOption[];
}

const LeftSidebar = ({
  filteredEvents,
  map,
  selectedTile,
  setSelectedTile,
  tileOptions,
}: Props) => {
  const [openSummary, setOpenSummary] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "s") {
        setOpenSummary(true);
      }
      if (event.key.toLowerCase() === "r") {
        map.current?.setZoom(4, { animate: true, duration: 1.5 });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleResetView = () => {
    if (map.current) {
      map.current.flyTo([51.505, -0.09], 3, { animate: true, duration: 1 });
    }
  };

  const handleTileChange = (newTile: TileLayerOption) => {
    setSelectedTile(newTile);
    localStorage.setItem("selectedTile", JSON.stringify(newTile));
  };

  return (
    <Box className="left-sidebar" sx={{ pt: 3 }}>
      <IconButton
        color="inherit"
        size="small"
        title="Reset View"
        onClick={handleResetView}
      >
        <ZoomOutMapIcon fontSize="large" />
      </IconButton>

      <IconButton
        color="inherit"
        size="small"
        title="Summary (s)"
        onClick={() => setOpenSummary(true)}
      >
        <LeaderboardIcon fontSize="large" />
      </IconButton>

      <IconButton
        color="inherit"
        size="small"
        title="Settings"
        onClick={() => setOpenSettings(true)}
        sx={{
          position: "absolute",
          bottom: "50px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <SettingsIcon fontSize="large" />
      </IconButton>

      <SummaryDialog
        open={openSummary}
        events={filteredEvents}
        onClose={() => setOpenSummary(false)}
      />

      <SettingsDialog
        open={openSettings}
        selectedTile={selectedTile}
        tileOptions={tileOptions}
        onTileChange={handleTileChange}
        onClose={() => setOpenSettings(false)}
      />
    </Box>
  );
};

export default LeftSidebar;
