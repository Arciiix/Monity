import { Error, Info, Warning } from "@mui/icons-material";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useRecoilState } from "recoil";
import dialogStackState from "../../../atoms/infoDialog/dialogStack.atom";
import Box from "@mui/material/Box";
import InfoDialogTypes from "../../../types/infoDialog/infoDialogTypes.enum";
import { ReactElement, useEffect, useState } from "react";
import IInfoDialogData from "../../../types/infoDialog/infoDialogData.interface";

interface IInfoDialog {
  open: boolean;
  description: string;
  onClose: () => void;
}

function InfoDialog() {
  const [stack, setStack] = useRecoilState(dialogStackState);
  const [open, setOpen] = useState(stack.length > 0);
  const [currentElement, setCurrentElement] = useState<IInfoDialogData | null>(
    null
  );

  const getIconForType = (type: InfoDialogTypes): ReactElement => {
    switch (type) {
      case InfoDialogTypes.error:
        return <Error />;
      case InfoDialogTypes.warning:
        return <Warning />;
      case InfoDialogTypes.info:
      default:
        return <Info />;
    }
  };
  const handleClose = () => {
    setOpen(stack.length > 1);
    const [, ...newStack] = stack; //Remove the first (current) element from the stack
    setStack(newStack);
  };

  useEffect(() => {
    setCurrentElement({ ...stack[0] } ?? null);
  }, [open]);

  useEffect(() => {
    if (!open && stack.length > 0) {
      setOpen(true);
      setCurrentElement(stack[0]);
    }
  }, [stack]);

  return (
    <Dialog open={open} onClose={handleClose} key={currentElement?.title}>
      <DialogTitle>
        <Box mx={1} display="flex" flexDirection="row" alignItems={"center"}>
          {getIconForType(
            (currentElement?.type as InfoDialogTypes) ?? InfoDialogTypes.info
          )}
          <Typography variant="h6" mx={1}>
            {currentElement?.title || ""}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{currentElement?.message || ""}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Got it</Button>
      </DialogActions>
    </Dialog>
  );
}

export default InfoDialog;
