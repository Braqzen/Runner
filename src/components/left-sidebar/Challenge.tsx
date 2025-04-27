import { useEffect, useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
  Checkbox,
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
        <Challenges challenges={challenges} />
      )}
    </Dialog>
  );
};

const Challenges = ({ challenges }: { challenges: Challenge[] }) => (
  <Box sx={{ padding: 2 }}>
    {challenges.map((challenge, id) => (
      <Card
        key={id}
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          boxShadow: 3,
          mb: 1,
        }}
      >
        <CardContent sx={{ flexGrow: 1, py: "0 !important" }}>
          <Typography sx={{ fontWeight: "medium" }}>
            {challenge.label}
          </Typography>
        </CardContent>

        <Checkbox checked={challenge.completed} disabled />
      </Card>
    ))}
  </Box>
);

export default ChallengeDialog;
