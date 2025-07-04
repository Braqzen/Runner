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
import Rating from "../common/Rating";
import { Event } from "../../types/Event";

const sectionKeys = ["pre", "during", "post", "event", "takeaways"] as const;
type SectionKey = (typeof sectionKeys)[number];

const sectionLabels: Record<SectionKey, string> = {
  pre: "Pre-Race",
  during: "During Race",
  post: "Post-Race",
  event: "Event",
  takeaways: "Takeaways",
};

interface Props {
  open: boolean;
  event: Event;
  onClose: () => void;
}

const NotesDialog = ({ open, event, onClose }: Props) => {
  const [selectedTab, setSelectedTab] = useState<SectionKey>("pre");

  const handleTabChange = (_: React.SyntheticEvent, newValue: SectionKey) => {
    setSelectedTab(newValue);
  };

  const renderNotes = (notes: string[]) => {
    if (!notes || notes.length === 0) return null;

    return (
      <Box
        sx={{
          backgroundColor: "rgba(245, 245, 245, 0.85)",
          p: 2,
          borderRadius: 3,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          transition: "all 0.2s",
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
          mb: 1,
          mt: 1,
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
        <EventInformation event={event} />
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
            mt: 1,
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
        <EventTags tags={event.tags} />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EventInformation = ({ event }: { event: Event }) => (
  <Box
    sx={{
      backgroundColor: "rgba(245, 245, 245, 0.85)",
      p: 3,
      borderRadius: 3,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      border: "1px solid rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
      Event Information
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      }}
    >
      <Typography sx={{ fontSize: "1.1rem" }}>
        <strong>Date:</strong> {event.date}
      </Typography>
      <Typography sx={{ fontSize: "1.1rem" }}>
        <strong>Start Time:</strong> {event.start}
      </Typography>
      <Typography sx={{ fontSize: "1.1rem" }}>
        <strong>Distance:</strong> {event.distance}km
      </Typography>
      <Typography sx={{ fontSize: "1.1rem" }}>
        <strong>Time:</strong> {event.time}
      </Typography>
      <Typography sx={{ fontSize: "1.1rem" }}>
        <strong>Type:</strong> {event.type}
      </Typography>
      <Typography sx={{ fontSize: "1.1rem" }}>
        <strong>Link: </strong>
        <a href={event.link} target="_blank" rel="noopener noreferrer">
          Website
        </a>
      </Typography>
    </Box>

    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {[
          { label: "Exertion", value: event.ratings.exertion },
          {
            label: "Organisation",
            value: event.ratings.event_organisation,
          },
          { label: "Location", value: event.ratings.location },
          { label: "Enjoyment", value: event.ratings.enjoyment },
        ].map(({ label, value }, idx) => (
          <Box key={idx} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ fontWeight: "bold", mb: 0.75, fontSize: "1.1rem" }}
            >
              {label}
            </Typography>
            <Rating rating={value} size="medium" />
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

const EventTags = ({ tags }: { tags: any }) => (
  <Box>
    <Typography variant="h5" sx={{ mt: 1, mb: 1, fontWeight: "bold" }}>
      Tags
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {[...tags.date, ...tags.region, ...tags.type].map((tag, idx) => (
        <Chip
          key={idx}
          label={tag}
          sx={{
            fontSize: "1rem",
            px: 1,
            background: "rgba(245, 245, 245, 0.85)",
            border: "1px solid rgba(0, 0, 0, 0.5)",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: "rgb(245, 245, 245)",
              transform: "translateY(-2px) scale(1.05)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
            },
          }}
        />
      ))}
    </Box>
  </Box>
);

export default NotesDialog;
