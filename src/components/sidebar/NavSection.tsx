import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
  shortcut?: string;
}

interface Props {
  items: NavItem[];
  bottomItems?: NavItem[];
}

const NavSection = ({ items, bottomItems = [] }: Props) => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        backgroundColor: "#252525",
        borderTop: "1px solid #1a1a1a",
      }}
    >
      <Typography
        sx={{
          px: 1.5,
          pt: 1,
          pb: 0.25,
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        Navigation
      </Typography>

      <Box sx={{ py: 0.25 }}>
        {items.map((item) => (
          <NavRow key={item.id} item={item} />
        ))}
      </Box>

      {bottomItems.length > 0 && (
        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {bottomItems.map((item) => (
            <NavRow key={item.id} item={item} />
          ))}
        </Box>
      )}
    </Box>
  );
};

const NavRow = ({ item }: { item: NavItem }) => (
  <Box
    onClick={item.onClick}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.25,
      px: 1.5,
      py: 0.9,
      cursor: "pointer",
      borderRadius: 1,
      mx: 0.75,
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.08)",
      },
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        color: "rgba(255,255,255,0.7)",
        "& svg": { fontSize: 22 },
      }}
    >
      {item.icon}
    </Box>
    <Typography
      sx={{
        flex: 1,
        fontSize: "0.925rem",
        color: "rgba(255,255,255,0.9)",
      }}
    >
      {item.label}
    </Typography>
    {item.shortcut && (
      <Typography
        sx={{
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "monospace",
        }}
      >
        {item.shortcut}
      </Typography>
    )}
  </Box>
);

export default NavSection;
