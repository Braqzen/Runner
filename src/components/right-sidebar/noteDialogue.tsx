import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";

interface RaceNotes {
  pre: string[];
  during: string[];
  post: string[];
  event: string[];
  takeaways: string[];
}

interface Tags {
  date: string[];
  region: string[];
  type: string[];
}

interface Event {
  id: number;
  name: string;
  notes: RaceNotes;
  tags: Tags;
}

interface DialogProps {
  open: boolean;
  event: Event;
  onClose: () => void;
}

const sectionKeys = ["pre", "during", "post", "event", "takeaways"] as const;
type SectionKey = (typeof sectionKeys)[number];

const sectionLabels: Record<SectionKey, string> = {
  pre: "Pre-Race",
  during: "During Race",
  post: "Post-Race",
  event: "Event",
  takeaways: "Takeaways",
};

const NotesDialog = ({ open, event, onClose }: DialogProps) => {
  const [selectedTab, setSelectedTab] = useState<SectionKey>("pre");

  const handleTabChange = (_: React.SyntheticEvent, newValue: SectionKey) => {
    setSelectedTab(newValue);
  };

  const renderNotes = (notes: string[]) => {
    if (!notes || notes.length === 0) return null;

    return (
      <Box
        sx={{
          backgroundColor: "rgba(228, 228, 228, 0.85)",
          p: 3,
          borderRadius: 3,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(0, 0, 0, 0.2)",
          transition: "all 0.2s",
          "&:hover": {
            boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.20)",
          },
        }}
      >
        {notes.map((note, idx) => (
          <Typography
            key={idx}
            sx={{
              fontSize: "1.15rem",
              lineHeight: 1.7,
              mb: idx < notes.length - 1 ? 2 : 0,
              pl: 1,
              pr: 1,
            }}
          >
            {note}
          </Typography>
        ))}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "80vw",
            height: "80vh",
            maxWidth: "1500px",
            maxHeight: "80vh",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "2.2rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {event.name}
      </DialogTitle>
      <DialogContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "90%",
          mx: "auto",
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          selectionFollowsFocus={false}
          onKeyDown={(e) => {
            if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
              e.stopPropagation();
            }
          }}
          onFocus={(e) => {
            if (e.target instanceof HTMLElement) {
              e.target.blur();
            }
          }}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              color: "black",
            },
          }}
        >
          {sectionKeys.map((key) =>
            event.notes[key].length > 0 ? (
              <Tab key={key} value={key} label={sectionLabels[key]} />
            ) : null
          )}
        </Tabs>

        {renderNotes(event.notes[selectedTab])}

        <Box>
          <Typography variant="h5" sx={{ mt: 1, mb: 1, fontWeight: "bold" }}>
            Tags
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {[...event.tags.date, ...event.tags.region, ...event.tags.type].map(
              (tag, idx) => (
                <Chip
                  key={idx}
                  label={tag}
                  sx={{
                    fontSize: "1rem",
                    borderRadius: "20px",
                    border: "1px solid black",
                    backgroundColor: "transparent",
                    transition: "background-color 0.2s, transform 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(17, 255, 0, 0.55)",
                      transform: "scale(1.1)",
                    },
                  }}
                />
              )
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesDialog;
