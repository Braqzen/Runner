import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { TileLayerOption } from "../types/tiles";

interface SettingsDialogProps {
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
}: SettingsDialogProps) => {
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
        Settings
      </DialogTitle>
      <DialogContent sx={{ p: 2, width: "80%", mx: "auto" }}>
        <Box sx={{ mb: 2 }}>
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
        <Divider />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
