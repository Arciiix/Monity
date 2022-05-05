import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

interface ITwoFaDialogProps {
  open: boolean;
  fullscreen: boolean;
  userLogin: string;
  closeDialog: () => void;
}

function TwoFaDialog({
  open,
  fullscreen,
  userLogin,
  closeDialog,
}: ITwoFaDialogProps) {
  return (
    <Dialog fullScreen={fullscreen} open={open} onClose={() => null}>
      <DialogTitle>Hi, {userLogin}. 2FA's on the way...</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Provide your two factor authentication code to login
        </DialogContentText>
        <TextField
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
        <Button onClick={() => null} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TwoFaDialog;
