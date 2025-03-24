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
import { Event } from "../types/event";

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
            maxWidth: "90vw",
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
                <TableCell sx={{ width: 250 }}>Name</TableCell>
                <TableCell sx={{ width: 200 }}>Date</TableCell>
                <TableCell sx={{ width: 200 }}>Start</TableCell>
                <TableCell sx={{ width: 200 }}>Type</TableCell>
                <TableCell sx={{ width: 200 }}>Distance</TableCell>
                <TableCell sx={{ width: 200 }}>Time</TableCell>
                <TableCell sx={{ width: 200 }}>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell
                    sx={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {event.name}
                  </TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.start}</TableCell>
                  <TableCell>{event.type}</TableCell>
                  <TableCell>{event.distance}</TableCell>
                  <TableCell>{event.time}</TableCell>
                  <TableCell>{event.rating}/5</TableCell>
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
