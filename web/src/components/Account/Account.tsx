import { AccountBalance } from "@mui/icons-material";
import IAccount from "../../types/account/account.interface";
import AccountIcons from "../../types/account/accountIcons.enum";
import getFontContrastingColor from "../utils/getFontContrastingColor";
import AccountIcon from "./AccountIcon";

interface IAccountProps {
  account: IAccount;
  onClick?: () => void;
}
const Account = ({ account, onClick }: IAccountProps) => {
  return (
    <div
      className="p-2 w-max rounded-lg flex flex-row items-center gap-3"
      style={{
        cursor: onClick ? "pointer" : "inherit",
      }}
      onClick={onClick}
    >
      <div
        className={`p-3 rounded-xl w-12 h-12 flex justify-center items-center`}
        style={{
          backgroundColor: account.color,
        }}
      >
        <AccountIcon
          name={AccountIcons[account.icon] as unknown as AccountIcons}
          color={getFontContrastingColor(account.color)}
        />
      </div>
      <div className="flex flex-col p-2">
        <span className="text-xl font-bold text-slate-200">{account.name}</span>
        <span className="text-lg text-slate-300">
          {account.currentBalance.toFixed(2)} {account.currency}
        </span>
      </div>
    </div>
  );
};

export default Account;
