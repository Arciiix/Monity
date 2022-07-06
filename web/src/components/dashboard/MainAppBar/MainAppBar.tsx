import { AppBar, Toolbar } from "@mui/material";
import { useRecoilValue } from "recoil";
import userState from "../../../atoms/user/user.atom";
import { IUser } from "../../../types/user/user.interface";
import LogOut from "../../auth/LogOut/LogOut";
import UserWidget from "../../auth/UserWidget/UserWidget";

const MainAppBar = () => {
  const user = useRecoilValue(userState);

  return (
    <AppBar position="static">
      <UserWidget user={user} />
    </AppBar>
  );
};
export default MainAppBar;
