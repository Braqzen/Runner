import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export interface TagOption {
  label: string;
  value: string;
}

interface TagFilterProps {
  options: TagOption[];
  onChange: (selected: TagOption[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ options, onChange }) => {
  return (
    <Autocomplete
      multiple
      options={options}
      getOptionLabel={(option) => option.label}
      filterSelectedOptions
      onChange={(event, value) => onChange(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Filter by Tags"
          placeholder="Select tags"
        />
      )}
    />
  );
};

export default TagFilter;
