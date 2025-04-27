import { Rating as MaterialRating, SxProps, Theme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface RatingProps {
  rating: number;
  size: "small" | "medium";
  sx?: SxProps<Theme>;
}

const Rating = ({ rating, size, sx }: RatingProps) => {
  return (
    <MaterialRating
      value={rating}
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
