import {
  AccountBalance,
  Add,
  Check,
  Edit,
  Settings,
} from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
} from "@mui/material";
import { useState } from "react";
import IAccount from "../../types/account/account.interface";
import AccountIcons from "../../types/account/accountIcons.enum";
import Account from "./Account";
import AllAccounts from "./AllAccounts";

interface ISelectAccountDialogProps {
  open: boolean;
  allAccounts: IAccount[];
  handleClose: () => void;
}
const SelectAccountDialog = ({
  open,
  allAccounts,
  handleClose,
}: ISelectAccountDialogProps) => {
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);

  const handleToggleItem = (itemIndex: number) => {
    const currentIndex = checkedIndexes.indexOf(itemIndex);
    const newChecked = [...checkedIndexes];

    if (currentIndex === -1) {
      newChecked.push(itemIndex);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedIndexes(newChecked);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select accounts</DialogTitle>
      <DialogContent>
        <ListItem key="all-accounts" disablePadding>
          <ListItemButton>
            <AllAccounts accounts={allAccounts} />
            {/* All accounts */}
          </ListItemButton>
        </ListItem>
        <Divider />
        <List>
          {allAccounts.map((e, index) => {
            return (
              <ListItem key={`account-${index}`} disablePadding>
                <ListItemButton onClick={() => handleToggleItem(index)}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checkedIndexes.indexOf(index) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <Account account={e} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <DialogActions>
          <Button className="flex gap-1" color="secondary">
            <Settings /> Manage accounts
          </Button>
          <Button className="flex gap-1">
            <Check /> Apply
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
export default SelectAccountDialog;
