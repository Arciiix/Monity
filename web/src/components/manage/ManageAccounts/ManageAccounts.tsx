import {
  AccountBalanceWallet,
  Add,
  Check,
  Delete,
  Reorder,
} from "@mui/icons-material";
import {
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { allAccountsState } from "../../../atoms/account/accounts.atom";
import IAccount from "../../../types/account/account.interface";
import AccountIcons from "../../../types/account/accountIcons.enum";
import InfoDialogTypes from "../../../types/infoDialog/infoDialogTypes.enum";
import AccountIcon from "../../Account/AccountIcon";
import useAppBarContent from "../../hooks/useAppBarContent";
import useBlockingPrompt from "../../hooks/useBlockingPrompt";
import useConfirmDialog from "../../hooks/useConfirmDialog";
import useData from "../../hooks/useData";
import useInfoDialog from "../../hooks/useInfoDialog";
import useTitle from "../../hooks/useTitle";
import LoadingOverlay from "../../Loading/LoadingOverlay/LoadingOverlay";
import { AxiosErr, fetch, isAxiosErr } from "../../utils/axios";
import getFontContrastingColor from "../../utils/getFontContrastingColor";

interface IManageAccountsHeaderProps {
  isReordering: boolean;
  onReorder: (wasReordering: boolean) => void;
}
const ManageAccountsHeader = ({
  isReordering,
  onReorder,
}: IManageAccountsHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between w-full pr-5">
      <div className="flex flex-row items-center gap-3">
        <FaWallet
          size={32}
          style={{
            color: isReordering ? blue[400] : "white",
          }}
        />
        <span
          className="text-2xl"
          style={{
            color: isReordering ? blue[400] : "white",
          }}
        >
          {isReordering ? "Reorder accounts" : "Manage accounts"}
        </span>
      </div>
      <div>
        <Tooltip
          onClick={() => onReorder(isReordering)}
          title="Reorder accounts"
        >
          <IconButton>
            {isReordering ? <Check color="primary" /> : <Reorder />}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

const ManageAccounts = () => {
  const { addToInfoDialogs, displayUnknownErrorDialog } = useInfoDialog();
  const navigate = useNavigate();
  const appBarContent = useAppBarContent();
  const confirm = useConfirmDialog();
  const location = useLocation();
  const { fetchAccounts } = useData();
  const title = useTitle();

  const [isLoading, setIsLoading] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  const [allAccounts, setAllAccounts] = useRecoilState(allAccountsState);
  const handleDeleteAccount = async (e: IAccount) => {
    if (allAccounts.length <= 1) {
      toast.warn("You cannot delete the only account you have");
      return;
    }
    const isConfirmed = await confirm(
      `Do you really want to delete ${e.name}? This action cannot be undone 😱`
    );
    if (!isConfirmed) return;
    setIsLoading(true);
    try {
      await fetch.delete(`/v1/account/${e.id}`);
    } catch (err: AxiosErr) {
      const error = isAxiosErr(err);
      if (error) {
        switch (error.statusCode) {
          case 403:
            //User doesn't possess this account
            addToInfoDialogs({
              type: InfoDialogTypes.error,
              title: "Permission error",
              message: "You don't possess this account!",
            });
            break;
          case 404:
            //Account not found
            addToInfoDialogs({
              type: InfoDialogTypes.error,
              title: "Not found",
              message: "This account has not been found!",
            });
            break;
          case 409:
            //User tried to delete the only account
            addToInfoDialogs({
              type: InfoDialogTypes.error,
              title: "Cannot delete the account",
              message: "You have to have at least one account!",
            });
            break;
          default:
            console.error(err);
            displayUnknownErrorDialog();
        }
      } else {
        console.error(err);
        displayUnknownErrorDialog();
      }
    }
    await fetchAccounts();
    setIsLoading(false);
  };
  const handleAddAccount = () => {
    navigate("add");
  };
  const handleEditAccount = (account: IAccount) => {
    navigate(`edit/${account.id}`);
  };

  const handleReorder = (wasReordering: boolean) => {
    console.log(wasReordering);
    if (wasReordering) {
      //TODO: Save the order
    }
    setIsReordering((prev) => !wasReordering);
  };

  const askToLeavePage = async (): Promise<boolean> => {
    return await confirm(
      "Do you want to leave this page? You didn't save the new order of the accounts"
    );
  };

  const renderItems = useMemo((): JSX.Element[] => {
    return allAccounts.map((e) => {
      return (
        <ListItem
          key={e.name}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteAccount(e)}
            >
              <Delete />
            </IconButton>
          }
        >
          <ListItemButton onClick={() => handleEditAccount(e)}>
            <ListItemIcon>
              <div
                className={`p-3 rounded-xl w-12 h-12 flex justify-center items-center`}
                style={{
                  backgroundColor: e.color,
                }}
              >
                <AccountIcon
                  name={AccountIcons[e.icon] as unknown as AccountIcons}
                  color={getFontContrastingColor(e.color)}
                />
              </div>
            </ListItemIcon>
            <ListItemText
              primary={e.name}
              secondary={e.currency}
            ></ListItemText>
          </ListItemButton>
        </ListItem>
      );
    });
  }, [allAccounts]);

  useEffect(() => {
    appBarContent(
      <ManageAccountsHeader
        isReordering={isReordering}
        onReorder={handleReorder}
      />
    );
  }, [isReordering]);

  useEffect(() => {
    title("Manage accounts");

    return () => {
      appBarContent(null);
    };
  }, []);

  useBlockingPrompt(isReordering, askToLeavePage);

  return (
    <div className="flex flex-col h-full w-full">
      <LoadingOverlay isLoading={isLoading} />
      {/* No need for no accounts screen because every user has to have at least one account */}
      <List>{renderItems}</List>

      <Tooltip className="fixed bottom-4 right-4" title="Add account">
        <Fab
          color="primary"
          aria-label="Add account"
          onClick={handleAddAccount}
        >
          <Add />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default ManageAccounts;
