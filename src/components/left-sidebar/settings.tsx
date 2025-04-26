import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { TileLayerOption } from "../../types/tiles";
import Dialog from "../dialog";

interface Props {
  open: boolean;
  selectedTile: TileLayerOption;
  tileOptions: TileLayerOption[];
  onTileChange: (tile: TileLayerOption) => void;
  onClose: () => void;
}

const SettingsDialog = ({
  open,
  selectedTile,
  tileOptions,
  onTileChange,
  onClose,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} title="Settings">
      <Box
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "90%", textAlign: "left" }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
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
                  input: { color: "#000" },
                  label: { color: "#000" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#000" },
                    "&:hover fieldset": { borderColor: "#333" },
                    "&.Mui-focused fieldset": { borderColor: "#000" },
                  },
                }}
              />
            )}
          />
        </Box>
        <Divider sx={{ width: "90%", mt: 2 }} />
      </Box>
    </Dialog>
  );
};

export default SettingsDialog;
