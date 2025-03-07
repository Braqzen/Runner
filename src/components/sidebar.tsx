import { RefObject, useEffect, useState } from "react";
import raceData from "../../races.json";
import { Race } from "../types/race";
import TagFilter, { TagOption } from "./tag";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { TileLayerOption } from "../types/tiles";
import EventCard from "./eventCard";

interface SidebarProps {
  tileOptions: TileLayerOption[];
  selectedTile: TileLayerOption;
  onTileChange: (tile: TileLayerOption) => void;
  onSelectRace: (race: Race) => void;
  map: RefObject<L.Map | null>;
}

const Sidebar = ({
  tileOptions,
  selectedTile,
  onTileChange,
  onSelectRace,
  map,
}: SidebarProps) => {
  const [races, setRaces] = useState<Race[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);
  const [openNotes, setOpenNotes] = useState(false);
  const [notes, setNotes] = useState<string[] | null>(null);

  useEffect(() => {
    setRaces(raceData);
  }, []);

  const uniqueTags = Array.from(
    new Set(races.flatMap((race) => race.tags || []))
  ).map((tag) => ({ label: tag, value: tag }));

  const filteredRaces =
    selectedTags.length === 0
      ? races
      : races.filter((race) =>
          selectedTags.every((tag) => race.tags.includes(tag.value))
        );

  const handleNotes = (notes: string[]) => {
    setNotes(notes);
    setOpenNotes(true);
  };

  const handleResetView = () => {
    if (map.current) {
      map.current.flyTo([51.505, -0.09], 3, { animate: true, duration: 1 });
    }
  };

  return (
    <Box
      className="sidebar"
      sx={{
        display: "grid",
        gridTemplateRows: "auto 1fr 80px",
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          Map Theme
        </Typography>
        <Autocomplete
          options={tileOptions}
          getOptionLabel={(option) => option.name}
          value={selectedTile}
          onChange={(_event, newValue) => {
            if (newValue) onTileChange(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Map Theme"
              variant="outlined"
              margin="dense"
              sx={{
                input: { color: "#fff" },
                label: { color: "#fff" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#fff",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ccc",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
              }}
            />
          )}
        />
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6" gutterBottom>
          Events
        </Typography>
        <TagFilter options={uniqueTags} onChange={setSelectedTags} />
        <Divider sx={{ my: 1 }} />
      </Box>
      <Box
        sx={{
          overflowY: "auto",
          pr: 1,
          pt: 1,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
        }}
      >
        <Box component="ul" sx={{ m: 0 }}>
          {filteredRaces.map((race) => (
            <li key={race.id}>
              <EventCard
                race={race}
                onSelectRace={onSelectRace}
                handleNotes={handleNotes}
              />
            </li>
          ))}
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleResetView}
        >
          Reset View
        </Button>
      </Box>

      <Dialog
        open={openNotes}
        onClose={() => setOpenNotes(false)}
        slotProps={{
          transition: {
            onExited: () => setNotes([]),
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.5rem" }}>Notes</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {notes &&
              notes.map((note, idx) => (
                <Typography
                  key={idx}
                  variant="body1"
                  sx={{ fontSize: "1.2rem", lineHeight: 1.5 }}
                >
                  {note}
                </Typography>
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotes(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
