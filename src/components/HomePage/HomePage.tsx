import { useEffect, useState } from "react";

interface IUserData {
  id: string;
  login: string;
  email: string;
}

function HomePage() {
  let [isLoading, setIsLoading] = useState(true);
  let [userData, setUserData] = useState<IUserData>({
    id: "",
    login: "",
    email: "",
  });

  const authorize = async (): Promise<void> => {
    let request = await fetch(`/api/user/auth`);
    if (request.status !== 200) {
      window.location.href = "/login";
    } else {
      let response = await request.json();
      if (response.error) {
        //TODO: Handle an error
      } else {
        setUserData(response.data);
      }
    }
  };

  useEffect(() => {
    authorize().then(() => setIsLoading(false));
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
