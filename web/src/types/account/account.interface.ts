import AccountIcons from "./accountIcons.enum";

interface IAccount {
  id?: string;
  name: string;
  icon: AccountIcons;
  color: string;
  currentBalance: number;
  currency: string;
}
export default IAccount;
