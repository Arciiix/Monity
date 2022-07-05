import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import userState from "../../../atoms/user/user.atom";
import { IUser } from "../../../types/user/user.interface";
import { checkForLogin } from "../../utils/checkForLogin";

function NoAuthentication() {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    //Check if user is logged but the user variable is not set (user has the access token stored)
    checkForLogin().then((e: IUser | null) => {
      if (e) {
        setUser(e);
        toast(`👋 Hi, ${e.login}!`, {
          toastId: "welcome_toast",
        });
      }
    });
  }, []);

  if (user) {
    return <Navigate to="/app" />;
  }

  return <Outlet />;
}
export default NoAuthentication;
