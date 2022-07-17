import { useRecoilState } from "recoil";
import { allAccountsState } from "../../atoms/account/accounts.atom";
import IAccount from "../../types/account/account.interface";
import InfoDialogTypes from "../../types/infoDialog/infoDialogTypes.enum";
import { fetch, isAxiosErr } from "../utils/axios";
import useInfoDialog from "./useInfoDialog";

const useData = () => {
  const { addToInfoDialogs, displayUnknownErrorDialog } = useInfoDialog();

  const [allAccounts, setAllAccounts] = useRecoilState(allAccountsState);

  const fetchAccounts = async (): Promise<boolean> => {
    try {
      const response = await fetch.get("/v1/account");
      setAllAccounts(response.data as IAccount[]);
      return true;
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
      return false;
    }
  };

  return { fetchAccounts };
};
export default useData;
