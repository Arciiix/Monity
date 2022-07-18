import { useRecoilState } from "recoil";
import { allAccountsState } from "../../atoms/account/accounts.atom";
import allPeopleState from "../../atoms/person/allPeople.atom";
import IAccount from "../../types/account/account.interface";
import InfoDialogTypes from "../../types/infoDialog/infoDialogTypes.enum";
import IPerson from "../../types/person/person.interface";
import { fetch, isAxiosErr } from "../utils/axios";
import useInfoDialog from "./useInfoDialog";

const useData = () => {
  const { addToInfoDialogs, displayUnknownErrorDialog } = useInfoDialog();

  const [allAccounts, setAllAccounts] = useRecoilState(allAccountsState);
  const [allPeople, setAllPeople] = useRecoilState(allPeopleState);

  const simpleAxiosFetch = async <T>(
    body: () => Promise<T>
  ): Promise<T | null> => {
    try {
      const result: T = await body();
      return result;
    } catch (err) {
      const error = isAxiosErr(err);
      if (error) {
        addToInfoDialogs({
          title: "Unknown server error",
          type: InfoDialogTypes.error,
          message: `Status code: ${
            error.statusCode
          }, response: ${JSON.stringify(error)}`,
        });
      } else {
        displayUnknownErrorDialog();
      }
      console.error(err);
      return null;
    }
  };

  const fetchAccounts = async (): Promise<IAccount[] | null> => {
    return simpleAxiosFetch(async () => {
      const response = await fetch.get("/v1/account");
      const accounts = response.data as IAccount[];

      setAllAccounts(accounts);
      return accounts;
    });
  };

  const fetchPeople = async (): Promise<IPerson[] | null> => {
    return simpleAxiosFetch(async () => {
      const response = await fetch.get("/v1/person");
      const people = response.data as IPerson[];

      setAllPeople(people);
      return people;
    });
  };

  return { fetchAccounts, fetchPeople };
};
export default useData;
