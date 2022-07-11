import { useEffect, useState } from "react";
import IAccount from "../../types/account/account.interface";
import AccountIcons from "../../types/account/accountIcons.enum";
import AccountIcon from "./AccountIcon";

interface IAllAccountsProps {
  accounts: IAccount[];
}
interface IAccountSum {
  currency: string;
  value: number;
}

const AllAccounts = ({ accounts }: IAllAccountsProps) => {
  let [sums, setSums] = useState<IAccountSum[]>([]);
  useEffect(() => {
    const currencies = Array.from(new Set(accounts.map((e) => e.currency)));
    setSums(
      currencies.map((e) => {
        return {
          currency: e,
          value: accounts
            .filter((elem) => elem.currency === e)
            .map((elem) => elem.currentBalance)
            .reduce((prev, curr) => prev + curr),
        };
      })
    );
  }, [accounts]);

  return (
    <div className="p-2 w-max rounded-lg flex flex-row items-center gap-3">
      <div className="p-3 rounded-xl w-12 h-12 flex justify-center items-center bg-blue-500">
        <AccountIcon name={AccountIcons.calculator} color={"#ffffff"} />
      </div>
      <div className="flex flex-col p-2">
        <span className="text-xl font-bold text-slate-200">All accounts</span>
        {sums.map((e) => {
          return (
            <span className="text-lg text-slate-300">
              {e.value} {e.currency}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export type { IAccountSum };
export default AllAccounts;
