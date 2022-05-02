import {
  Checkbox,
  Typography,
  Link as MUILink,
  FormControlLabel,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

import styles from "./Login.module.css";

interface ILoginProps {
  hideRegister?: boolean;
  hideRememberMe?: boolean;
  hideResetPassword?: boolean;
}

function Login(props: ILoginProps) {
  return (
    <Box
      width={"100%"}
      height="100%"
      display={"flex"}
      flexDirection="column"
      justifyContent={"center"}
      alignItems="center"
      p="15px"
    >
      <h1>Login</h1>
      <Box width="100%" mb="5px">
        <TextField label="Login/e-mail" margin="normal" fullWidth />
        <TextField label="Password" margin="normal" fullWidth />
      </Box>

      <Button fullWidth className={styles.submit} variant="outlined">
        Login
      </Button>

      <Box display="flex" flexDirection="column" alignItems={"center"} m="20px">
        {!props.hideRememberMe && (
          <FormControlLabel
            label="Remember me"
            control={<Checkbox defaultChecked />}
          />
        )}
        {!props.hideResetPassword && (
          <MUILink
            component={Link}
            className={styles.link}
            to="/auth/passwordReset"
          >
            Forgot your password?
          </MUILink>
        )}
      </Box>

      {!props.hideRegister && (
        <Box
          m="10px"
          mt="15px"
          display="flex"
          flexDirection={"column"}
          alignItems="center"
        >
          <Typography>Don't have an account?</Typography>
          <Link to="/auth/register" className={styles.link}>
            <Button color="secondary">Create one now!</Button>
          </Link>
        </Box>
      )}
    </Box>
  );
}

export default Login;
