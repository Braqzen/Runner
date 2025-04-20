import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { Event } from "../../types/event";

interface SummaryDialogProps {
  open: boolean;
  events: Event[];
  onClose: () => void;
}

const SummaryDialog = ({ open, events, onClose }: SummaryDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: "90vw",
            height: "90vh",
            maxWidth: "1500px",
            maxHeight: "90vh",
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
        Summary
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 250, fontSize: "1.2rem" }}>
                  Name
                </TableCell>
                <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>
                  Date
                </TableCell>
                <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>
                  Start
                </TableCell>
                <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>
                  Type
                </TableCell>
                <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>
                  Distance
                </TableCell>
                <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>
                  Time
                </TableCell>
                <TableCell sx={{ width: 200, fontSize: "1.2rem" }}>
                  Rating
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell
                    sx={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      fontSize: "1rem",
                    }}
                  >
                    {event.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{event.date}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{event.start}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{event.type}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>
                    {event.distance}
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{event.time}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>
                    {event.ratings.enjoyment}/5
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SummaryDialog;
