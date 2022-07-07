import { Grid } from "@mui/material";
import Login from "./Login/Login";
import RandomPicture from "../../RandomPicture/RandomPicture";

function LoginPage() {
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
        <Login />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
