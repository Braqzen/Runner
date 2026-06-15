import { Box, Chip, Typography } from "@mui/material";
import FilterTag, { TagOption } from "./Tag";

interface Props {
  dateOptions: TagOption[];
  regionOptions: TagOption[];
  typeOptions: TagOption[];
  selectedDateTags: TagOption[];
  selectedRegionTags: TagOption[];
  selectedTypeTags: TagOption[];
  onDateChange: (tags: TagOption[]) => void;
  onRegionChange: (tags: TagOption[]) => void;
  onTypeChange: (tags: TagOption[]) => void;
}

const FilterPanel = ({
  dateOptions,
  regionOptions,
  typeOptions,
  selectedDateTags,
  selectedRegionTags,
  selectedTypeTags,
  onDateChange,
  onRegionChange,
  onTypeChange,
}: Props) => {
  const allActive = [
    ...selectedDateTags.map((t) => ({ ...t, group: "date" as const })),
    ...selectedRegionTags.map((t) => ({ ...t, group: "region" as const })),
    ...selectedTypeTags.map((t) => ({ ...t, group: "type" as const })),
  ];

  const removeTag = (tag: TagOption & { group: "date" | "region" | "type" }) => {
    if (tag.group === "date") {
      onDateChange(selectedDateTags.filter((t) => t.value !== tag.value));
    } else if (tag.group === "region") {
      onRegionChange(selectedRegionTags.filter((t) => t.value !== tag.value));
    } else {
      onTypeChange(selectedTypeTags.filter((t) => t.value !== tag.value));
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: 4 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#aaaaaa",
          borderRadius: 2,
        },
      }}
    >
      {allActive.length > 0 && (
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            borderBottom: "2px solid var(--sidebar-content-border)",
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          {allActive.map((tag) => (
            <Chip
              key={`${tag.group}-${tag.value}`}
              label={tag.label}
              size="small"
              onDelete={() => removeTag(tag)}
              sx={{
                height: 24,
                fontSize: "0.75rem",
                backgroundColor: "#2563eb",
                color: "#fff",
                "& .MuiChip-deleteIcon": {
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 16,
                },
              }}
            />
          ))}
        </Box>
      )}

      <FilterRow label="Date">
        <FilterTag
          options={dateOptions}
          selected={selectedDateTags}
          onChange={onDateChange}
        />
      </FilterRow>
      <FilterRow label="Region">
        <FilterTag
          options={regionOptions}
          selected={selectedRegionTags}
          onChange={onRegionChange}
        />
      </FilterRow>
      <FilterRow label="Type">
        <FilterTag
          options={typeOptions}
          selected={selectedTypeTags}
          onChange={onTypeChange}
        />
      </FilterRow>
    </Box>
  );
};

const FilterRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      px: 1.5,
      py: 1.25,
      borderBottom: "2px solid var(--sidebar-content-border)",
    }}
  >
    <Typography
      sx={{
        fontSize: "0.78rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--sidebar-content-label)",
        mb: 0.75,
      }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

export default FilterPanel;
