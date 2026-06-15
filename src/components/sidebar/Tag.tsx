import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface Props {
  options: TagOption[];
  onChange: (selected: TagOption[]) => void;
  selected: TagOption[];
}

export interface TagOption {
  label: string;
  value: string;
}

const FilterTag = ({ options, onChange, selected }: Props) => {
  return (
    <Autocomplete
      multiple
      size="small"
      options={options}
      value={selected}
      getOptionLabel={(option) => option.label}
      filterSelectedOptions
      onChange={(_event, value) => onChange(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Any"
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.875rem",
              backgroundColor: "#ffffff",
              "& fieldset": {
                borderColor: "#c5cdd4",
              },
              "&:hover fieldset": {
                borderColor: "#9aa5b1",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2563eb",
              },
              "& .MuiChip-root": {
                height: 22,
                fontSize: "0.7rem",
                backgroundColor: "#2563eb",
                color: "#ffffff",
              },
            },
            input: { color: "var(--sidebar-content-text)" },
          }}
        />
      )}
    />
  );
};

export default FilterTag;
