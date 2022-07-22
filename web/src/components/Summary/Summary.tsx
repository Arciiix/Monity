import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userState from "../../atoms/user/user.atom";
import useTitle from "../hooks/useTitle";
import { fetch } from "../utils/axios";

const Summary = () => {
  const user = useRecoilValue(userState);
  const [testFetchData, setTestFetchData] = useState({});

  const title = useTitle();

  const testFetch = async () => {
    const response = await fetch.get("/v1/user/me");
    setTestFetchData({ ...response.data, ...{ date: new Date() } });
  };
  useEffect(() => {
    const interval = setInterval(testFetch, 5000);
    title("Dashboard");

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <h1>Hi, {user?.login}</h1>
      <span>{JSON.stringify(testFetchData, null, 2)}</span>
    </>
  );
};
export default Summary;
