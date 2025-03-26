import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface TagFilterProps {
  options: TagOption[];
  onChange: (selected: TagOption[]) => void;
}

export interface TagOption {
  label: string;
  value: string;
}

const TagFilter = ({ options, onChange }: TagFilterProps) => {
  return (
    <Autocomplete
      multiple
      options={options}
      getOptionLabel={(option) => option.label}
      filterSelectedOptions
      onChange={(_event, value) => onChange(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Filter by Tags"
          placeholder="Select tags"
          sx={{
            input: { color: "#fff" },
            label: { color: "#fff" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#fff",
              },
              "& .MuiChip-root": {
                backgroundColor: "#444",
                color: "#fff",
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
  );
};

export default TagFilter;
