import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";

export type SidebarPanel = "filters" | "events";

interface Props {
  panel: SidebarPanel;
  onPanelChange: (panel: SidebarPanel) => void;
  eventCount: number;
  activeFilterCount: number;
}

const SidebarPanelTabs = ({
  panel,
  onPanelChange,
  eventCount,
  activeFilterCount,
}: Props) => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        px: 1.5,
        pt: 1.5,
        pb: 1.25,
        backgroundColor: "var(--sidebar-content-bg)",
      }}
    >
      <ToggleButtonGroup
        value={panel}
        exclusive
        fullWidth
        onChange={(_, value: SidebarPanel | null) => {
          if (value) onPanelChange(value);
        }}
        sx={{
          backgroundColor: "transparent",
          gap: 0.5,
          boxShadow: "none",
          "& .MuiToggleButtonGroup-grouped": {
            border: "1px solid var(--sidebar-content-border) !important",
            borderRadius: "4px !important",
            mx: 0,
            boxShadow: "none",
          },
          "& .MuiToggleButton-root": {
            py: 0.85,
            fontSize: "0.875rem",
            fontWeight: 600,
            textTransform: "none",
            color: "var(--sidebar-content-label)",
            backgroundColor: "var(--sidebar-content-bg)",
            boxShadow: "none",
            "&.Mui-selected": {
              backgroundColor: "#ffffff",
              color: "var(--sidebar-content-text)",
              borderColor: "var(--sidebar-content-border) !important",
              "&:hover": {
                backgroundColor: "#ffffff",
              },
            },
            "&:hover": {
              backgroundColor: "var(--sidebar-content-hover)",
            },
          },
        }}
      >
        <ToggleButton value="filters">
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </ToggleButton>
        <ToggleButton value="events">Events ({eventCount})</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default SidebarPanelTabs;
