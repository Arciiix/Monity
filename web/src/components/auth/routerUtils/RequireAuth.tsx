import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userState from "../../../atoms/user/user.atom";

function RequireAuth() {
  const user = useRecoilValue(userState);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
export default RequireAuth;
