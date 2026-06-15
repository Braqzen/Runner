import { useEffect, useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
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
    <Dialog open={open} onClose={onClose} title="Achievements">
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
        <Achievements challenges={challenges} />
      )}
    </Dialog>
  );
};

const Achievements = ({ challenges }: { challenges: Challenge[] }) => {
  const completed = challenges.filter((c) => c.completed);
  const incomplete = challenges.filter((c) => !c.completed);

  const Row = ({ label, completed: isCompleted }: { label: string; completed: boolean }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        px: 2,
        py: 1.5,
      }}
    >
      <Box
        sx={{
          mt: 0.25,
          color: isCompleted ? "success.main" : "text.disabled",
          display: "flex",
        }}
      >
        {isCompleted ? (
          <CheckCircleOutlineIcon fontSize="small" />
        ) : (
          <RadioButtonUncheckedIcon fontSize="small" />
        )}
      </Box>
      <Typography
        sx={{
          fontSize: "0.98rem",
          lineHeight: 1.4,
          fontWeight: 500,
          color: isCompleted ? "text.secondary" : "text.primary",
        }}
      >
        {label}
      </Typography>
    </Box>
  );

  const AchievementSection = ({
    title,
    challengeList,
    emptyMessage,
    isCompleted,
  }: {
    title: string;
    challengeList: Challenge[];
    emptyMessage: string;
    isCompleted: boolean;
  }) => (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 1.5, fontSize: "1.1rem", fontWeight: 600 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {challengeList.length > 0 ? (
          challengeList.map((challenge, id) => (
            <Box
              key={id}
              sx={{
                borderBottom:
                  id < challengeList.length - 1 ? "1px solid" : "none",
                borderColor: "divider",
              }}
            >
              <Row label={challenge.label} completed={isCompleted} />
            </Box>
          ))
        ) : (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
              {emptyMessage}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <AchievementSection
          title="Completed"
          challengeList={completed}
          emptyMessage="None yet."
          isCompleted
        />
        <AchievementSection
          title="Incomplete"
          challengeList={incomplete}
          emptyMessage="All done."
          isCompleted={false}
        />
      </Box>
    </Box>
  );
};

export default ChallengeDialog;
