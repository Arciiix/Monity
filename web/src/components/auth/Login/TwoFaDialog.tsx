import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";

interface ITwoFaDialogProps {
  open: boolean;
  fullscreen: boolean;
  handleLogin: (code: string) => Promise<void>;
  closeDialog: () => void;
}

function TwoFaDialog({
  open,
  fullscreen,
  handleLogin,
  closeDialog,
}: ITwoFaDialogProps) {
  const [twoFaCode, setTwoFaCode] = useState("");

  return (
    <Dialog fullScreen={fullscreen} open={open} onClose={() => null}>
      <DialogTitle>Hi! 2FA's on the way...</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Provide your two factor authentication code to login
        </DialogContentText>
        <TextField
          value={twoFaCode}
          onChange={(e) => setTwoFaCode(e.target.value)}
          autoFocus
          margin="dense"
          id="code"
          label="2FA code"
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleLogin(twoFaCode)} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TwoFaDialog;
