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

const currentAccountIndexesState = atom<number[]>({
  key: "currentAccountIndexes",
  default: [0],
});

const currentAccountsState = selector<IAccount[]>({
  key: "currentAccount",
  get: ({ get }) => {
    const allAccounts = get(allAccountsState);
    const currentAccountsIndex = get(currentAccountIndexesState);
    const accounts = currentAccountsIndex.map((index) => allAccounts[index]);
    // return allAccounts?.[currentAccountIndex ?? -1] || null;
    return accounts;
  },
  set: ({ get, set }, newValue) => {
    let newIndexes: number[] = [];
    const allAccounts = get(allAccountsState);

    if (newValue instanceof DefaultValue) {
      newIndexes = [0];
    } else {
      newIndexes = allAccounts
        .filter((elem) => newValue.find((e) => e.id === elem.id))
        .map((e) => allAccounts.findIndex((element) => element.id === e.id));
    }
    set(currentAccountIndexesState, newIndexes);
  },
});

export { allAccountsState, currentAccountIndexesState, currentAccountsState };
