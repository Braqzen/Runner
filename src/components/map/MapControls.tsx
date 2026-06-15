import { RefObject } from "react";
import { Box, Fab, IconButton } from "@mui/material";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface Props {
  map: RefObject<L.Map | null>;
}

const MapControls = ({ map }: Props) => {
  const handleResetView = () => {
    if (map.current) {
      map.current.flyTo([51.505, -0.09], 3, { animate: true, duration: 1 });
    }
  };

  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Fab
        size="small"
        onClick={handleResetView}
        title="Reset View"
        sx={{
          backgroundColor: "#2d2d2d",
          color: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          "&:hover": { backgroundColor: "#3a3a3a" },
        }}
      >
        <ZoomOutMapIcon />
      </Fab>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#2d2d2d",
          borderRadius: 1,
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <IconButton
          size="small"
          onClick={handleZoomIn}
          title="Zoom in"
          sx={{
            color: "#fff",
            borderRadius: 0,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            "&:hover": { backgroundColor: "#3a3a3a" },
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleZoomOut}
          title="Zoom out"
          sx={{
            color: "#fff",
            borderRadius: 0,
            "&:hover": { backgroundColor: "#3a3a3a" },
          }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MapControls;
