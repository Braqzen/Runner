import { Box, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

interface LeftSidebarProps {
  onOpenSummary: () => void;
  onOpenSettings: () => void;
}

const LeftSidebar = ({ onOpenSummary, onOpenSettings }: LeftSidebarProps) => {
  return (
    <Box className="left-sidebar">
      <IconButton
        color="inherit"
        size="small"
        title="Summary (s)"
        onClick={onOpenSummary}
        sx={{
          position: "absolute",
          top: "25px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <LeaderboardIcon fontSize="large" />
      </IconButton>
      <IconButton
        color="inherit"
        size="small"
        title="Settings"
        onClick={onOpenSettings}
        sx={{
          position: "absolute",
          bottom: "50px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <SettingsIcon fontSize="large" />
      </IconButton>
    </Box>
  );
};

export default LeftSidebar;
