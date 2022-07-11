import { useState } from "react";
import { useRecoilValue } from "recoil";
import {
  allAccountsState,
  currentAccountState,
} from "../../atoms/account/accounts.atom";

import Account from "./Account";
import SelectAccountDialog from "./SelectAccountDialog";

const AccountWidget = () => {
  const currentAccount = useRecoilValue(currentAccountState);
  const allAccounts = useRecoilValue(allAccountsState);
  const [isSelectAccountDialogOpen, setIsSelectAccountDialogOpen] =
    useState(false);

  const handleDialogToggle = () => {
    setIsSelectAccountDialogOpen((prev) => !prev);
  };

  return (
    <>
      <Account account={currentAccount} onClick={handleDialogToggle} />
      <SelectAccountDialog
        allAccounts={allAccounts}
        open={isSelectAccountDialogOpen}
        handleClose={handleDialogToggle}
      />
    </>
  );
};

export default AccountWidget;
