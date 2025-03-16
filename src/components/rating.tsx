import { Rating as MaterialRating, SxProps, Theme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Event } from "../types/event";

interface RatingProps {
  event: Event;
  size: "small" | "medium";
  sx?: SxProps<Theme>;
}

const Rating = ({ event, size, sx }: RatingProps) => {
  return (
    <MaterialRating
      value={event.rating}
      readOnly
      precision={0.1}
      size={size}
      sx={{ ...sx }}
      icon={
        <StarIcon
          sx={{
            color: "rgb(39, 129, 255)",
            stroke: "black",
            strokeWidth: 1,
            fontSize: size === "medium" ? "1.5rem" : "1.3rem",
          }}
        />
      }
      emptyIcon={
        <StarBorderIcon
          sx={{
            color: "black",
            strokeWidth: 1,
            fontSize: size === "medium" ? "1.5rem" : "1.3rem",
          }}
        />
      }
    />
  );
};

export default Rating;
