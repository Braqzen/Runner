import { ReactNode } from "react";
import {
  Dialog as MaterialDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Dialog = ({ open, onClose, title, children }: Props) => {
  return (
    <MaterialDialog
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
        {title}
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ width: "100%", overflowX: "auto" }}>{children}</Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </MaterialDialog>
  );
};

export default Dialog;
