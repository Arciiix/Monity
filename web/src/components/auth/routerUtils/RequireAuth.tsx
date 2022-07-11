import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import prevRouteState from "../../../atoms/router/prevRoute.atom";
import userState from "../../../atoms/user/user.atom";

function RequireAuth() {
  const user = useRecoilValue(userState);
  const [prevRoute, setPrevRoute] = useRecoilState(prevRouteState);
  const location = useLocation();

  useEffect(() => {
    setPrevRoute(location.pathname);
  }, [location]);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
export default RequireAuth;
