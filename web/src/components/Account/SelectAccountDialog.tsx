import { Check, Settings } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { currentAccountIndexesState } from "../../atoms/account/accounts.atom";
import IAccount from "../../types/account/account.interface";
import Account from "./Account";
import AllAccounts from "./AllAccounts";

interface ISelectAccountDialogProps {
  open: boolean;
  allAccounts: IAccount[];
  handleSelect: (selectedAccounts: IAccount[]) => void;
  handleClose: () => void;
}
const SelectAccountDialog = ({
  open,
  allAccounts,
  handleSelect,
  handleClose,
}: ISelectAccountDialogProps) => {
  const navigate = useNavigate();

  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);
  const currentSelectedIndexes = useRecoilValue(currentAccountIndexesState);
  const [error, setError] = useState<string | null>();

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

  const handleApply = () => {
    if (checkedIndexes.length === 0) {
      setError("You have to select at least one account");
      return;
    }
    handleSelect(checkedIndexes.map((e) => allAccounts[e]));
    handleCloseDialog();
  };

  const handleSelectAllAccounts = () => {
    handleSelect(allAccounts);
    handleCloseDialog();
  };

  const handleCloseDialog = () => {
    handleClose();
    setError(null);
  };

  const handleManageAccounts = () => {
    navigate("/app/manage/accounts");
    handleCloseDialog();
  };

  useEffect(() => {
    setCheckedIndexes(currentSelectedIndexes);
  }, [currentSelectedIndexes]);

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Select accounts</DialogTitle>
      <DialogContent>
        <ListItem key="all-accounts" disablePadding>
          <ListItemButton onClick={handleSelectAllAccounts}>
            <AllAccounts accounts={allAccounts} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <List>
          <FormControl required error={!!error} variant="standard">
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
                    <Account key={e.id} account={e} />
                  </ListItemButton>
                </ListItem>
              );
            })}
            <FormHelperText>{error}</FormHelperText>
          </FormControl>
        </List>
        <DialogActions>
          <Button
            className="flex gap-1"
            color="secondary"
            onClick={handleManageAccounts}
          >
            <Settings /> Manage accounts
          </Button>
          <Button className="flex gap-1" onClick={handleApply}>
            <Check /> Apply
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
export default SelectAccountDialog;
