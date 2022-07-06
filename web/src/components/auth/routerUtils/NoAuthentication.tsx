import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import userState from "../../../atoms/user/user.atom";
import { IUser } from "../../../types/user/user.interface";
import { checkForLogin } from "../../utils/checkForLogin";
import getState from "../../utils/getState";

function NoAuthentication() {
  const [user, setUser] = useRecoilState(userState);

  const handleCheckForLogin = async () => {
    //Check if user is logged but the user variable is not set (user has the access token stored)
    console.log("Checking if user is logged...");

    let result: IUser | null = await checkForLogin();
    if (result) {
      setUser(result);
      toast(`👋 Hi, ${result.login}!`, {
        toastId: "welcome_toast",
      });
    }
  };

  useEffect(() => {
    handleCheckForLogin();
  }, []);

  if (user) {
    return <Navigate to="/app" />;
  }

  return <Outlet />;
}
export default NoAuthentication;
