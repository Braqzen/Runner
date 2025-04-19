import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { Challenge } from "../types/challenge";
import rawChallenges from "../../challenges.json";

interface ChallengeDialogProps {
  open: boolean;
  onClose: () => void;
}

const ChallengeDialog = ({ open, onClose }: ChallengeDialogProps) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    setChallenges(rawChallenges);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "90vw",
            height: "90vh",
            maxWidth: "1500px",
            maxHeight: "90vh",
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
        Challenges
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <List>
            {challenges.map((challenge) => (
              <ListItem key={challenge.id} divider>
                <ListItemText primary={challenge.label} />
                <Checkbox checked={challenge.completed} disabled />
              </ListItem>
            ))}
          </List>
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

export default ChallengeDialog;
