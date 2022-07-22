import { Grid } from "@mui/material";
import Login from "./Login/Login";
import RandomPicture from "../../RandomPicture/RandomPicture";
import useTitle from "../../hooks/useTitle";
import { useEffect } from "react";

function LoginPage() {
  const title = useTitle();

  useEffect(() => {
    title("Login");
  }, []);

  return (
    <Grid
      container
      classes={{ root: "height-screen justify-center" }}
      flexDirection="row"
    >
      <Grid
        item
        xs={false}
        md={8}
        display={{
          md: "flex",
          xs: "none",
        }}
      >
        <RandomPicture />
      </Grid>
      <Grid item xs={12} md={4} px="50px">
        <Login hideResetPassword />{" "}
        {/* Reset password not implemented yet, and probably will not be implemented due to security */}
      </Grid>
    </Grid>
  );
}

export default LoginPage;
