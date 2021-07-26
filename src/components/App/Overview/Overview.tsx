import { useEffect, useState } from "react";
import Loading from "../../Loading/Loading";
import { authorize, IUserData } from "../../Utils/auth";

function Overview() {
  let [isLoading, setIsLoading] = useState(true);
  let [userData, setUserData] = useState<IUserData>({
    id: "",
    login: "",
    email: "",
    authorized: false,
  });

  const auth = async (): Promise<boolean> => {
    let authData: IUserData = await authorize();
    setUserData(authData);
    return authData.authorized;
  };

  useEffect(() => {
    auth().then((authorized) => {
      if (authorized) {
        setIsLoading(false);
      }
    });
  }, []);

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>Monity</span>
        <span>TODO: Make this page</span>
        <span>Logged as:</span>
        <span>Id: {userData.id}</span>
        <span>Login: {userData.login}</span>
        <span>E-mail: {userData.email}</span>
      </div>
    );
  }
}
export default Overview;
