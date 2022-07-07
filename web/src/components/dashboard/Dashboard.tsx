import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/user/user.atom";
import { IUser } from "../../types/user/user.interface";
import { fetch } from "../utils/axios";
import MainAppBar from "./MainAppBar/MainAppBar";

function Dashboard() {
  let user = useRecoilValue(userState) as IUser;
  let [testFetchData, setTestFetchData] = useState({});

  const testFetch = async () => {
    let response = await fetch.get("/v1/user/me");
    setTestFetchData({ ...response.data, ...{ date: new Date() } });
  };
  useEffect(() => {
    const interval = setInterval(testFetch, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <MainAppBar />
      <h1>Hi, {user.login}</h1>
      <span>{JSON.stringify(testFetchData, null, 2)}</span>
    </div>
  );
}

export default Dashboard;
