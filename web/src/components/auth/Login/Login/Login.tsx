import { useEffect, useState } from "react";
import {
  Checkbox,
  Typography,
  Link as MUILink,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import isEmpty from "validator/lib/isEmpty";

import styles from "./Login.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface ILoginProps {
  hideRegister?: boolean;
  hideRememberMe?: boolean;
  hideResetPassword?: boolean;
}

function Login(props: ILoginProps) {
  let [login, setLogin] = useState("");
  let [password, setPassword] = useState("");
  let [rememberMe, setRememberMe] = useState(false);

  let [showPassword, setShowPassword] = useState(false);

  //Contains the error messages of the login form
  let [errors, setErrors] = useState<{
    login: string;
    password: string;
  }>({
    login: "",
    password: "",
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const signIn = async () => {
    let isThereAnyError = false;
    let errorObj = { ...errors };

    if (isEmpty(login)) {
      errorObj.login = "Please enter your login";

      isThereAnyError = true;
    } else {
      errorObj.login = "";
    }

    if (isEmpty(password)) {
      errorObj.password = "Please enter your password";
      isThereAnyError = true;
    } else {
      errorObj.password = "";
    }

    setErrors(errorObj);

    if (isThereAnyError) {
      return;
    }

    //TODO: Log in

    // If user has successfully logged in and the remember me checkbox is checked,
    // then save the login in the local storage

    //DEV TODO: Ensure it runs only when user has successfully logged in
    localStorage.setItem("cachedLogin", login);
  };

  useEffect(() => {
    //If there's any cached login in the local storage, set the login to it
    let cachedLogin = localStorage.getItem("cachedLogin");

    if (cachedLogin) {
      setLogin(cachedLogin);
    }
  }, []);

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
        <TextField
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          label="Login/e-mail"
          error={!!errors.login} //Convert string to boolean
          helperText={errors.login}
          margin="normal"
          fullWidth
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password} //Convert string to boolean
          helperText={errors.password}
          label="Password"
          type={showPassword ? "text" : "password"}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Box>

      <Button
        className={styles.submit}
        onClick={signIn}
        fullWidth
        variant="outlined"
      >
        Login
      </Button>

      <Box display="flex" flexDirection="column" alignItems={"center"} m="20px">
        {!props.hideRememberMe && (
          <FormControlLabel
            label="Remember me"
            control={
              <Checkbox
                value={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
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
