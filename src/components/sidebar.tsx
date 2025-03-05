import { useEffect, useState } from "react";
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
  List,
  ListItem,
  ListItemText,
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
}

const Sidebar = ({
  tileOptions,
  selectedTile,
  onTileChange,
  onSelectRace,
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

  return (
    <div className="sidebar">
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
      <ul>
        {filteredRaces.map((race, _index) => (
          <li key={race.id}>
            <EventCard
              race={race}
              onSelectRace={onSelectRace}
              handleNotes={handleNotes}
            />
          </li>
        ))}
      </ul>
      <Dialog
        open={openNotes}
        onClose={() => setOpenNotes(false)}
        slotProps={{
          transition: {
            onExited: () => setNotes([]),
          },
        }}
      >
        <DialogTitle>Event Notes</DialogTitle>
        <DialogContent>
          {notes && notes.length > 0 ? (
            <List>
              {notes.map((note, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={note} />
                </ListItem>
              ))}
            </List>
          ) : (
            <div>No notes available.</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotes(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;
