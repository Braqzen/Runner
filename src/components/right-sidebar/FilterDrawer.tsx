import { Drawer, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Filter from "./Tag";
import { TagOption } from "./Tag";

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
      <DrawerHeader onClose={onClose} />

      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <FilterSection
          title="Date"
          options={dateOptions}
          onChange={onDateChange}
        />
        <FilterSection
          title="Region"
          options={regionOptions}
          onChange={onRegionChange}
        />
        <FilterSection
          title="Type"
          options={typeOptions}
          onChange={onTypeChange}
        />
      </Box>
    </Drawer>
  );
};

const DrawerHeader = ({ onClose }: { onClose: () => void }) => (
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
);

const FilterSection = ({
  title,
  options,
  onChange,
}: {
  title: string;
  options: TagOption[];
  onChange: (selected: TagOption[]) => void;
}) => (
  <>
    <Typography variant="subtitle1" sx={{ color: "#fff" }}>
      {title}
    </Typography>
    <Filter options={options} onChange={onChange} />
  </>
);

export default FilterDrawer;
