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
  Divider,
  Chip,
} from "@mui/material";

interface Event {
  id: number;
  name: string;
  notes: string[];
  tags: string[];
}

interface DialogProps {
  open: boolean;
  event: Event;
  onClose: () => void;
}

const NotesDialog = ({ open, event, onClose }: DialogProps) => {
  const [notesExpanded, setNotesExpanded] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "80vw",
            height: "80vh",
            maxWidth: "80vw",
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
        sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
            Notes
          </Typography>
          <Collapse in={notesExpanded} collapsedSize={200}>
            <Box>
              {event.notes.map((note, idx) => (
                <Box key={idx}>
                  <Typography sx={{ fontSize: "1.2rem", lineHeight: 1.5 }}>
                    {note}
                  </Typography>
                  {idx < event.notes.length - 1 && (
                    <Divider sx={{ my: 1, borderColor: "black" }} />
                  )}
                </Box>
              ))}
            </Box>
          </Collapse>
          <Button
            variant="text"
            onClick={() => setNotesExpanded((prev) => !prev)}
          >
            {notesExpanded ? "Show Less" : "Show More"}
          </Button>
        </Box>

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
