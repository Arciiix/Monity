import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  allAccountsState,
  currentAccountsState,
} from "../../atoms/account/accounts.atom";
import IAccount from "../../types/account/account.interface";

import Account from "./Account";
import AllAccounts from "./AllAccounts";
import SelectAccountDialog from "./SelectAccountDialog";

const AccountWidget = () => {
  const [currentAccounts, setCurrentAccounts] =
    useRecoilState(currentAccountsState);
  const allAccounts = useRecoilValue(allAccountsState);
  const [isSelectAccountDialogOpen, setIsSelectAccountDialogOpen] =
    useState(false);

  const handleDialogToggle = () => {
    setIsSelectAccountDialogOpen((prev) => !prev);
  };
  const handleAccountsSelect = (selectedAccounts: IAccount[]) => {
    console.log(selectedAccounts);
    setCurrentAccounts(selectedAccounts);
  };

  return (
    <>
      <div
        className="flex flex-row shrink-1 flex-wrap w-full"
        onClick={handleDialogToggle}
      >
        {currentAccounts.length === allAccounts.length ? (
          <AllAccounts accounts={allAccounts} />
        ) : (
          currentAccounts.map((elem) => (
            <Account key={elem.id} account={elem} />
          ))
        )}
      </div>
      <SelectAccountDialog
        allAccounts={allAccounts}
        open={isSelectAccountDialogOpen}
        handleSelect={handleAccountsSelect}
        handleClose={handleDialogToggle}
      />
    </>
  );
};

export default AccountWidget;
