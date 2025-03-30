import { Drawer, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Filter from "../right-sidebar/tag";
import { TagOption } from "../right-sidebar/tag";

interface Props {
  open: boolean;
  onClose: () => void;
  dateOptions: TagOption[];
  regionOptions: TagOption[];
  typeOptions: TagOption[];
  onDateChange: (selected: TagOption[]) => void;
  onRegionChange: (selected: TagOption[]) => void;
  onTypeChange: (selected: TagOption[]) => void;
}

const FilterDrawer = ({
  open,
  onClose,
  dateOptions,
  regionOptions,
  typeOptions,
  onDateChange,
  onRegionChange,
  onTypeChange,
}: Props) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        paper: {
          sx: {
            width: "20%",
            backgroundColor: "#333",
            padding: 2,
          },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textAlign: "center", color: "#fff" }}
        >
          Filters
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="subtitle1" sx={{ color: "#fff" }}>
          Date
        </Typography>
        <Filter options={dateOptions} onChange={onDateChange} />

        <Typography variant="subtitle1" sx={{ color: "#fff" }}>
          Region
        </Typography>
        <Filter options={regionOptions} onChange={onRegionChange} />

        <Typography variant="subtitle1" sx={{ color: "#fff" }}>
          Type
        </Typography>
        <Filter options={typeOptions} onChange={onTypeChange} />
      </Box>
    </Drawer>
  );
};

export default FilterDrawer;
