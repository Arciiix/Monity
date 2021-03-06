import DrawerToggle from "./DrawerToggle";
import { AppBar } from "@mui/material";
import { useRecoilValue } from "recoil";
import userState from "../../../atoms/user/user.atom";
import AccountWidget from "../../Account/AccountWidget";
import UserWidget from "../../auth/UserWidget/UserWidget";
import isDrawerOpenState from "../../../atoms/drawer/isDrawerOpen.atom";
import overrideAppBarContentState from "../../../atoms/header/overrideAppBarContent.atom";

interface IMainAppBarProps {
  drawerWidth: number;
}

const MainAppBar = ({ drawerWidth }: IMainAppBarProps) => {
  const isDrawerOpen = useRecoilValue(isDrawerOpenState);
  const overrideAppBarContent = useRecoilValue(overrideAppBarContentState);

  return (
    <AppBar
      position="static"
      className="flex flex-row py-3 justify-start"
      sx={{
        width: {
          xs: "100%",
          sm: `calc(100% - ${drawerWidth}px)`,
        },
        marginLeft: {
          xs: "0px",
          sm: `${drawerWidth}px`,
        },
      }}
    >
      <DrawerToggle />
      {overrideAppBarContent ?? <AccountWidget />}
    </AppBar>
  );
};
export default MainAppBar;
