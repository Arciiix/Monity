import { ReactElement, useEffect, useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Link,
  Button,
  Box,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Link as LinkRouter } from "react-router-dom";

import styles from "./Login.module.css";
import errorToast from "../../Utils/errorToast";

function Login(): ReactElement {
  let [login, setLogin] = useState("");
  let [password, setPassword] = useState("");
  let [showPassword, setShowPassword] = useState(false);
  let [rememberMe, setRememberMe] = useState(false);
  let [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  let [errors, setErrors] = useState({ login: false, password: false });

  let calculateImageSizeTimeout: ReturnType<typeof setTimeout> | null = null;

  const calculateImageSize = (): void => {
    //Don't reload the image every single time the window size changes - instead wait for the end of the resize (until user stops changing the window size)
    if (calculateImageSizeTimeout) {
      clearTimeout(calculateImageSizeTimeout);
    }
    calculateImageSizeTimeout = setTimeout(() => {
      let height: number = document.body.clientHeight;
      let width = document.body.clientWidth;

      setWindowSize({ width: (2 / 3) * width - 20, height: height });
    }, 500);
  };

  const tryToLogin = async (): Promise<void> => {
    if (!login) {
      setErrors({ login: true, password: errors.password });
      return;
    }
    if (!password) {
      setErrors({ password: true, login: errors.login });
      return;
    }

    let loginRequest = await fetch(
      `/api/user/login?${new URLSearchParams({
        login: encodeURIComponent(login),
        password: encodeURIComponent(password),
      })}`
    );

    switch (loginRequest.status) {
      case 404:
        setErrors({ login: true, password: false });
        return;
      case 403:
        setErrors({ login: false, password: true });
        return;
      case 200:
        setErrors({ login: false, password: false });
        break;
      default:
        errorToast(
          `Unexpected error - ${JSON.stringify(
            await loginRequest.json()
          )} WITH STATUS ${loginRequest.status}`
        );
        return;
    }

    //If user has selected "remember me", save the login to the localStorage
    window.localStorage.setItem("rememberMeLogin", rememberMe ? login : "");

    let loginResponse = await loginRequest.json();
  };

  useEffect(() => {
    calculateImageSize();

    window.addEventListener("resize", () => calculateImageSize());

    //In case user wanted the app to remember his login, set it as an input value
    setLogin(window.localStorage.getItem("rememberMeLogin") ?? "");
  }, []);

  return (
    <Grid container spacing={0}>
      <Grid className={styles.sidebar} container item md={8} xs={false}>
        <Box display={{ xs: "none", md: "flex" }}>
          <img
            className={styles.backgroundImage}
            src={`https://source.unsplash.com/random/${windowSize.width}x${windowSize.height}`}
            alt=""
            width={windowSize.width}
            height={windowSize.height + 8}
          />
        </Box>
        <Box
          className={styles.sidebarWrapper}
          display={{ xs: "none", md: "flex" }}
        >
          <LinkRouter className={styles.logoLink} to="/">
            <img
              className={styles.logo}
              src={`${process.env.PUBLIC_URL}/img/logo1024.png`}
              alt="Monity"
              width="200"
              height="200"
            />
            <span className={styles.loginText}>Monity</span>
          </LinkRouter>

          <div className={styles.registerLinkWrapper}>
            <span className={styles.registerText}>Nie masz konta?</span>
            <Button
              className={styles.button}
              variant="outlined"
              color="secondary"
              onClick={() => (window.location.href = "/register")}
            >
              Zarejestruj się
            </Button>
          </div>
        </Box>
      </Grid>
      <Grid className={styles.loginForm} container item md={4} xs={12}>
        <Box display={{ xs: "flex", md: "none" }}>
          <LinkRouter to="/">
            <img
              className={styles.logo}
              src={`${process.env.PUBLIC_URL}/img/logo1024.png`}
              alt="Monity"
              width="200"
              height="200"
            />
          </LinkRouter>
        </Box>
        <span className={styles.loginText}>Zaloguj się</span>
        <FormControl>
          <TextField
            className={styles.inputElement}
            label="Login lub e-mail"
            variant="outlined"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            error={errors.login}
          />
          <TextField
            className={styles.inputElement}
            label="Hasło"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    component="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <div className={styles.formOptionsWrapper}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Zapamiętaj mnie"
            />
            <Link className={styles.link} href="/forgotPassword">
              Nie pamiętasz hasła?
            </Link>
          </div>

          <Button
            className={styles.button}
            variant="outlined"
            color="primary"
            onClick={tryToLogin}
          >
            Zaloguj się
          </Button>
        </FormControl>
        <Box display={{ xs: "flex", md: "none" }}>
          <div className={styles.registerLinkWrapper}>
            <span className={styles.registerText}>Nie masz konta?</span>
            <Button
              className={styles.button}
              variant="outlined"
              color="secondary"
              onClick={() => (window.location.href = "/register")}
            >
              Zarejestruj się
            </Button>
          </div>
        </Box>
      </Grid>
    </Grid>
  );
}

export default Login;
