import { atom, DefaultValue, selector } from "recoil";
import IAccount from "../../types/account/account.interface";
import AccountIcons from "../../types/account/accountIcons.enum";
import { IUser } from "../../types/user/user.interface";

const allAccountsState = atom<IAccount[]>({
  key: "allAccounts",
  default: [
    {
      name: "test",
      color: "#123321",
      icon: AccountIcons.wallet,
      currency: "PLN",
      currentBalance: 123,
    },
    {
      name: "test kolejny",
      color: "#ab001d",
      icon: AccountIcons.atlas,
      currency: "USD",
      currentBalance: 123,
    },
    {
      name: "test123",
      color: "#321123",
      icon: AccountIcons.coins,
      currency: "PLN",
      currentBalance: 200,
    },
  ],
});

const currentAccountIndexState = atom<number | null>({
  key: "currentAccountIndex",
  default: 0,
});

const currentAccountState = selector<IAccount>({
  key: "currentAccount",
  get: ({ get }) => {
    const allAccounts = get(allAccountsState);
    const currentAccountIndex = get(currentAccountIndexState);
    return allAccounts?.[currentAccountIndex ?? -1] || null;
  },
  set: ({ get, set }, newValue) => {
    let newIndex = get(allAccountsState).findIndex((e) =>
      newValue instanceof DefaultValue ? false : e.id === newValue.id
    );
    if (newIndex === -1) newIndex = 0;
    set(currentAccountIndexState, newIndex);
  },
});

export { allAccountsState, currentAccountState };
