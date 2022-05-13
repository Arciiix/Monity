import { useRecoilValue } from "recoil";
import userState from "../auth/atoms/user.atom";
import { IUser } from "../auth/types/user.interface";

function Dashboard() {
  let user = useRecoilValue(userState) as IUser;

  return <h1>Hi, {user.login}</h1>;
}

export default Dashboard;
