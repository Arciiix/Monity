import { useEffect, useState } from "react";
import { authorize, IUserData } from "../Utils/auth";

function HomePage() {
  let [isLoading, setIsLoading] = useState(true);
  let [userData, setUserData] = useState<IUserData>({
    id: "",
    login: "",
    email: "",
  });

  const auth = async (): Promise<void> => {
    let authData: IUserData = await authorize();
    setUserData(authData);
  };

  useEffect(() => {
    auth().then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>; //TODO: Make the loading site
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
export default HomePage;
