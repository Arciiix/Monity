import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userState from "../atoms/user.atom";

function NoAuthentication() {
  const user = useRecoilValue(userState);

  if (user) {
    return <Navigate to="/app" />;
  }

  return <Outlet />;
}
export default NoAuthentication;
