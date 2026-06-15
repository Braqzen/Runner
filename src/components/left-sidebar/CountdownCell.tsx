import { useEffect, useRef } from "react";
import { TableCell } from "@mui/material";
import { formatCountdown, parseDate } from "../../utils/countdown";

interface Props {
  dateStr: string;
}

const CountdownCell = ({ dateStr }: Props) => {
  const cellRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    const cell = cellRef.current;
    if (!cell) return;

    const parsed = parseDate(dateStr);
    if (!parsed) {
      cell.textContent = "-";
      return;
    }

    const update = () => {
      cell.textContent = formatCountdown(parsed);
    };

    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [dateStr]);

  return (
    <TableCell ref={cellRef} sx={{ fontVariantNumeric: "tabular-nums" }}>
      -
    </TableCell>
  );
};

export default CountdownCell;
