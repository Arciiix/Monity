import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { allAccountsState } from "../../atoms/account/accounts.atom";
import userState from "../../atoms/user/user.atom";
import IAccount from "../../types/account/account.interface";
import InfoDialogTypes from "../../types/infoDialog/infoDialogTypes.enum";
import { IUser } from "../../types/user/user.interface";
import useInfoDialog from "../hooks/useInfoDialog";
import Loading from "../Loading/Loading/Loading";
import { fetch, isAxiosErr } from "../utils/axios";
import MainAppBar from "./MainAppBar/MainAppBar";
import MainDrawer from "./MainDrawer/MainDrawer";

const drawerWidth = 250;
function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  let user = useRecoilValue(userState) as IUser;
  const [testFetchData, setTestFetchData] = useState({});
  const [allAccounts, setAllAccounts] = useRecoilState(allAccountsState);
  const { addToInfoDialogs, displayUnknownErrorDialog } = useInfoDialog();

  const testFetch = async () => {
    const response = await fetch.get("/v1/user/me");
    setTestFetchData({ ...response.data, ...{ date: new Date() } });
  };

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

  useEffect(() => {
    const interval = setInterval(testFetch, 5000);
    fetchAccounts().then((isSuccess) => {
      if (isSuccess) setIsLoading(false);
    });

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <MainAppBar drawerWidth={drawerWidth} />
      <Box display="flex" flexDirection="row">
        <MainDrawer width={drawerWidth} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <h1>Hi, {user.login}</h1>
          <span>{JSON.stringify(testFetchData, null, 2)}</span>
        </Box>
      </Box>
    </div>
  );
}

export default Dashboard;
