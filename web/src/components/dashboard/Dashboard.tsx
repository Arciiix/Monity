import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { allAccountsState } from "../../atoms/account/accounts.atom";
import userState from "../../atoms/user/user.atom";
import IAccount from "../../types/account/account.interface";
import InfoDialogTypes from "../../types/infoDialog/infoDialogTypes.enum";
import { IUser } from "../../types/user/user.interface";
import useData from "../hooks/useData";
import useInfoDialog from "../hooks/useInfoDialog";
import LoadingOverlay from "../Loading/LoadingOverlay/LoadingOverlay";
import { fetch, isAxiosErr } from "../utils/axios";
import MainAppBar from "./MainAppBar/MainAppBar";
import MainDrawer from "./MainDrawer/MainDrawer";

const drawerWidth = 250;
function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { fetchAccounts } = useData();

  useEffect(() => {
    fetchAccounts().then((isSuccess) => {
      if (isSuccess) setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <LoadingOverlay isLoading={true} />;
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
          <Outlet />
        </Box>
      </Box>
    </div>
  );
}

export default Dashboard;
