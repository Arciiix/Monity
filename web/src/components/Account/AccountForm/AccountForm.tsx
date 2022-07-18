import { Box, Fab, IconButton, TextField } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { FaWallet } from "react-icons/fa";
import IAccount from "../../../types/account/account.interface";
import AccountIcons from "../../../types/account/accountIcons.enum";
import useAppBarContent from "../../hooks/useAppBarContent";
import IconPicker from "../../Pickers/IconPicker/IconPicker";
import getFontContrastingColor from "../../utils/getFontContrastingColor";
import { priceRegexp } from "../../utils/regExps";
import AccountIcon from "../AccountIcon";
import validator from "validator";
import checkForNotNullValues from "../../utils/checkForNotNullValues";
import { toast } from "react-toastify";
import { Save } from "@mui/icons-material";
import { AxiosErr, fetch, isAxiosErr } from "../../utils/axios";
import LoadingOverlay from "../../Loading/LoadingOverlay/LoadingOverlay";
import useInfoDialog from "../../hooks/useInfoDialog";
import InfoDialogTypes from "../../../types/infoDialog/infoDialogTypes.enum";
import { useNavigate, useParams } from "react-router-dom";
import useData from "../../hooks/useData";

interface IAccountFormHeaderProps {
  account?: IAccount | null;
}
interface IAccountFormErrors {
  color?: string | null;
  icon?: string | null;
  name?: string | null;
  currency?: string | null;
  initialBalance?: string | null;
}

const AccountFormHeader = ({ account }: IAccountFormHeaderProps) => {
  return (
    <div className="flex flex-row items-center gap-3">
      {account?.icon ? (
        <div
          className={`p-3 rounded-xl w-12 h-12 flex justify-center items-center`}
          style={{
            backgroundColor: account.color ?? "transparent",
          }}
        >
          <AccountIcon
            name={AccountIcons[account.icon] as unknown as AccountIcons}
            color={getFontContrastingColor(account.color)}
          />
        </div>
      ) : (
        <FaWallet size={32} />
      )}
      <span className="text-2xl">
        {account ? `Edit ${account.name}` : "Add account"}
      </span>
    </div>
  );
};

const AccountForm = () => {
  const appBarContent = useAppBarContent();
  const { addToInfoDialogs, displayUnknownErrorDialog } = useInfoDialog();
  const navigate = useNavigate();
  const { fetchAccounts } = useData();
  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [oldAccount, setOldAccount] = useState<IAccount | null>(null);

  const [name, setName] = useState("My account");
  const [icon, setIcon] = useState<AccountIcons>(
    AccountIcons[AccountIcons.wallet] as unknown as AccountIcons
  );
  const [color, setColor] = useState("#00405e");
  const [initialBalance, setInitialBalance] = useState<string>("0"); //String to let user e.g. write '.' or ','
  const [currency, setCurrency] = useState("PLN");

  const [iconsIndexes, setIconsIndexes] = useState<string[]>([]);
  const [errors, setErrors] = useState<IAccountFormErrors>({});

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
  };

  const handleInitialBalanceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value.replace(",", ".");
    if (priceRegexp.test(newValue)) {
      setInitialBalance(newValue);
    }
  };

  const renderIcons = useMemo(() => {
    // console.log(AccountIcons);
    const indexes = Object.keys(AccountIcons).filter((e) => isNaN(Number(e)));
    setIconsIndexes(indexes);
    return indexes.map((e) => {
      return (
        <AccountIcon
          name={
            AccountIcons[
              e as unknown as AccountIcons
            ] as unknown as AccountIcons
          }
          color={"#ffffff"}
          size={24}
        />
      );
    });
  }, []);

  const handleSetIcon = (index: number) => {
    setIcon(iconsIndexes[index] as unknown as AccountIcons);
  };

  const validate = (): boolean => {
    const errors: IAccountFormErrors = {};

    if (!Object.values(AccountIcons).includes(icon)) {
      errors.icon = "Wrong icon";
    }
    if (!validator.isHexColor(color)) {
      errors.color = "Wrong color";
    }
    if (
      !validator.isLength(name, {
        min: 3,
        max: 32,
      }) ||
      !validator.isAscii(name)
    ) {
      errors.name =
        "Name can be from 3 to 32 characters long and contain only ASCII characters";
    }

    if (
      !validator.isAlphanumeric(currency, "pl-PL") ||
      !validator.isLength(currency, {
        min: 1,
        max: 10,
      })
    ) {
      errors.currency =
        "Currency can be from 1 to 10 characters long and contain only alphanumerical chars";
    }
    if (!isEditing && !validator.isFloat(initialBalance)) {
      errors.initialBalance = "Initial balance should be a float number";
    }

    setErrors(errors);
    return !checkForNotNullValues(errors); //If there's any not-null value (error) in the errors, return false (not validated); otherwise return true
  };

  const navigateToManageAccounts = () => {
    navigate("/app/manage/accounts");
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    const newAccount: IAccount = {
      id: id,
      name,
      icon,
      color,
      currentBalance: parseFloat(
        initialBalance ?? 0
      ) /* It's getting striped on the server, so no worries when it comes to editing account */,
      currency,
    };

    setIsLoading(true);
    try {
      await fetch("/v1/account", {
        method: isEditing ? "PUT" : "POST",
        data: newAccount,
      });
    } catch (err: AxiosErr) {
      const error = isAxiosErr(err);
      if (error) {
        switch (error.statusCode) {
          case 403:
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
            addToInfoDialogs({
              type: InfoDialogTypes.error,
              title: "Account already exists",
              message: "Account with that name already exists",
            });
            setErrors((prev) => ({
              ...prev,
              ...{ name: "Choose a different name" },
            }));
            break;
          default:
            console.error(error);
            displayUnknownErrorDialog();
        }
      } else {
        console.error(err);
        displayUnknownErrorDialog();
      }
      setIsLoading(false);

      return null;
    }

    await fetchAccounts();
    setIsLoading(false);
    navigateToManageAccounts();
  };

  const fetchOldAccount = async (id: string) => {
    try {
      const account = await fetch.get(`/v1/account/${id}`);

      setIcon(account.data.icon as AccountIcons);
      setColor(account.data.color);
      setInitialBalance(account.data.currentBalance.toFixed(2));
      setCurrency(account.data.currency);
      setName(account.data.name);

      setOldAccount(account.data as IAccount);
      appBarContent(<AccountFormHeader account={account.data as IAccount} />);
    } catch (err: AxiosErr) {
      const error = isAxiosErr(err);
      console.error(error);
      console.error(err);
      navigateToManageAccounts();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      setIsEditing(true);
      fetchOldAccount(id);
    }

    appBarContent(<AccountFormHeader account={null} />);
    return () => {
      appBarContent(null);
    };
  }, []);

  return (
    <Box className="flex flex-col w-full gap-4">
      <LoadingOverlay isLoading={isLoading} />
      <div className="flex flex-col items-center m-2 w-full">
        <div
          className={`m-3 rounded-xl w-20 h-20 flex justify-center items-center`}
          style={{
            backgroundColor: color,
          }}
        >
          <AccountIcon
            name={AccountIcons[icon] as unknown as AccountIcons}
            color={getFontContrastingColor(color)}
          />
        </div>
        <span className="text-red-400">{errors.color || ""}</span>
        <span className="text-red-400">{errors.icon || ""}</span>
      </div>
      <div className="flex flex-col lg:flex-row w-full justify-around items-center m-2 p-2">
        <HexColorPicker
          className="w-12/12 lg:w-5/12"
          color={color}
          onChange={setColor}
        />
        <div className="w-12/12 lg:w-5/12">
          <IconPicker
            icons={renderIcons}
            selectedIconIndex={iconsIndexes.indexOf(icon.toString())}
            setSelectedIconIndex={handleSetIcon}
          />
        </div>
      </div>
      <TextField
        onChange={handleNameChange}
        value={name}
        label="Name"
        placeholder="My account"
        inputProps={{ maxLength: 32 }}
        required
        error={!!errors.name}
        helperText={errors.name || ""}
      />
      <TextField
        onChange={handleCurrencyChange}
        value={currency}
        label="Currency"
        placeholder="PLN"
        inputProps={{ maxLength: 10 }}
        required
        error={!!errors.currency}
        helperText={errors.currency || ""}
      />
      {!isEditing && (
        <TextField
          onChange={handleInitialBalanceChange}
          value={initialBalance}
          label={`Initial balance (${currency})`}
          placeholder={`${initialBalance} ${currency}`}
          required
          error={!!errors.initialBalance}
          helperText={errors.initialBalance || ""}
        />
      )}
      <Fab
        color="primary"
        className="fixed bottom-4 right-4"
        onClick={handleSave}
      >
        <Save />
      </Fab>
    </Box>
  );
};
export default AccountForm;
