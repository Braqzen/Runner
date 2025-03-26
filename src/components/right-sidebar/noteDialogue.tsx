import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Collapse,
  Chip,
} from "@mui/material";

interface RaceNotes {
  pre: string[];
  during: string[];
  post: string[];
}

interface Event {
  id: number;
  name: string;
  notes: RaceNotes;
  tags: string[];
}

interface DialogProps {
  open: boolean;
  event: Event;
  onClose: () => void;
}

const NotesDialog = ({ open, event, onClose }: DialogProps) => {
  const [preExpanded, setPreExpanded] = useState(false);
  const [duringExpanded, setDuringExpanded] = useState(false);
  const [postExpanded, setPostExpanded] = useState(false);

  const renderSection = (
    title: string,
    notes: string[],
    expanded: boolean,
    setExpanded: (val: boolean) => void
  ) => {
    if (!notes || notes.length === 0) return null;
    const needsToggle = notes.length > 5;

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
          {title}
        </Typography>
        {needsToggle ? (
          <>
            <Collapse in={expanded} collapsedSize={200}>
              <Box
                sx={{
                  backgroundColor: "rgba(202, 202, 202, 0.55)",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                {notes.map((note, idx) => (
                  <Box key={idx} sx={{ mb: idx < notes.length - 1 ? 1 : 0 }}>
                    <Typography sx={{ fontSize: "1.2rem", lineHeight: 1.5 }}>
                      {note}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>
            <Button variant="text" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Show Less" : "Show More"}
            </Button>
          </>
        ) : (
          <Box
            sx={{
              backgroundColor: "rgba(202, 202, 202, 0.55)",
              p: 2,
              borderRadius: 2,
            }}
          >
            {notes.map((note, idx) => (
              <Box key={idx} sx={{ mb: idx < notes.length - 1 ? 1 : 0 }}>
                <Typography sx={{ fontSize: "1.2rem", lineHeight: 1.5 }}>
                  {note}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
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
        {renderSection(
          "Pre-Race",
          event.notes.pre,
          preExpanded,
          setPreExpanded
        )}
        {renderSection(
          "During Race",
          event.notes.during,
          duringExpanded,
          setDuringExpanded
        )}
        {renderSection(
          "Post-Race",
          event.notes.post,
          postExpanded,
          setPostExpanded
        )}

        <Box>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
            Tags
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {event.tags.map((tag, idx) => (
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
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesDialog;
