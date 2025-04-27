import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  CircularProgress,
  Box,
} from "@mui/material";
import { Challenge } from "../../types/Challenge";
import rawChallenges from "../../../data/challenges.json";
import Dialog from "../common/Dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChallengeDialog = ({ open, onClose }: Props) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setChallenges(rawChallenges);
    setLoading(false);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} title="Challenges">
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          sx={{ overflow: "hidden" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <ChallengeList challenges={challenges} />
      )}
    </Dialog>
  );
};

const ChallengeList = ({ challenges }: { challenges: Challenge[] }) => (
  <List>
    {challenges.map((challenge) => (
      <ListItem key={challenge.id} divider>
        <ListItemText primary={challenge.label} />
        <Checkbox checked={challenge.completed} disabled />
      </ListItem>
    ))}
  </List>
);

export default ChallengeDialog;
