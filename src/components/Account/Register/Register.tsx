import { ReactElement, useEffect, useState } from "react";
import {
  Container,
  FormControl,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Link as LinkRouter } from "react-router-dom";
import errorToast from "../../Utils/errorToast";
import { setTitle } from "../../Utils/setTitle";
import { authorize } from "../../Utils/auth";

import styles from "./Register.module.css";

interface IErrorsObject {
  login: string[];
  password: string[];
  email: string[];
}

function Register(): ReactElement {
  let [login, setLogin] = useState("");
  let [password, setPassword] = useState("");
  let [showPassword, setShowPassword] = useState(false);
  let [email, setEmail] = useState("");

  let [errors, setErrors] = useState<IErrorsObject>({
    login: [],
    password: [],
    email: [],
  });

  const register = async (): Promise<void> => {
    let {
      isError,
      errors,
    }: { isError: boolean; errors: IErrorsObject } = validate();
    setErrors(errors);
    if (!isError) {
      let registerRequest = await fetch("/api/user/register", {
        method: "POST",
        body: JSON.stringify({
          login: login,
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      let registerResponse = await registerRequest.json();
      if (registerResponse.error) {
        if (
          (registerResponse.errorCode as string) &&
          registerResponse.errorCode.includes("VALIDATION")
        ) {
          let { errors }: { errors: IErrorsObject } = validate();
          setErrors(errors);
          return;
        } else if (
          (registerResponse.errorCode as string) &&
          registerResponse.errorCode === "ALREADY_EXISTS"
        ) {
          setErrors({
            ...errors,
            login: [
              ...errors.login,
              "Konto o podanym adresie e-mail lub loginie już istnieje.",
            ],
            email: [
              ...errors.email,
              "Konto o podanym adresie e-mail lub loginie już istnieje.",
            ],
          });
          return;
        } else {
          errorToast(
            `Unexpected error - ${JSON.stringify(
              registerResponse
            )} WITH STATUS ${registerRequest.status}`
          );
          return;
        }
      }

      window.location.href = "/app/overview";
    }
  };

  const validate = (): { isError: boolean; errors: IErrorsObject } => {
    let errors: string[] = [];

    //Login
    if (login.length < 4 || login.length > 32) {
      errors.push("VALIDATION_LOGIN_LENGTH");
    }

    let loginRegEx = /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d\.\-_]*$/;
    if (!loginRegEx.test(login)) {
      errors.push("VALIDATION_LOGIN_FORMAT");
    }

    //Password
    if (password.length < 4 || password.length > 32) {
      errors.push("VALIDATION_PASSWORD_LENGTH");
    }

    let passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&.ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
    if (!passwordRegEx.test(password)) {
      errors.push("VALIDATION_PASSWORD_FORMAT");
    }

    //E-mail
    let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test(email)) {
      errors.push("VALIDATION_EMAIL_FORMAT");
    }

    let errorsObject: IErrorsObject = errorCodesToString(errors);

    return { isError: errors.length !== 0, errors: errorsObject };
  };

  const errorCodesToString = (errorCodes: string[]): IErrorsObject => {
    let errorsObject: IErrorsObject = {
      login: [],
      password: [],
      email: [],
    };

    errorCodes.forEach((e) => {
      switch (e) {
        case "VALIDATION_LOGIN_LENGTH":
          errorsObject.login.push(
            "Login musi mieć przynajmniej 4 znaki, a maksymalnie - 32."
          );
          break;
        case "VALIDATION_LOGIN_FORMAT":
          errorsObject.login.push(
            "Login może zawierać tylko litery (bez polskich znaków), cyfry, kropki, myślniki i podkreślenia oraz zaczynać się od litery i kończyć cyfrą lub literą."
          );
          break;
        case "VALIDATION_PASSWORD_LENGTH":
          errorsObject.password.push(
            "Hasło musi mieć przynajmniej 8 znaków, a maksymalnie - 32."
          );
          break;
        case "VALIDATION_PASSWORD_FORMAT":
          errorsObject.password.push(
            "Hasło musi zawierać minimum 1 cyfrę, 1 wielką i małą literę oraz może zawierać jedynie następujące znaki specjalne: @$!%*?&."
          );
          break;
        case "VALIDATION_EMAIL_FORMAT":
          errorsObject.email.push("To nie jest prawidłowy adres e-mail.");
          break;
        default:
          errorToast(`Unexpected error: ${e}`);
          break;
      }
    });

    return errorsObject;
  };

  useEffect(() => {
    setTitle("rejestracja");

    //If user is logged already, redirect to the app
    authorize(true).then(({ authorized }) => {
      if (authorized) {
        window.location.href = "/app/overview";
      }
    });
  }, []);

  return (
    <Container className={styles.container}>
      <div className={styles.logoWrapper}>
        <LinkRouter to="/">
          <img
            className={styles.logo}
            src={`${process.env.PUBLIC_URL}/img/logo1024.png`}
            alt="Monity"
            width="200"
            height="200"
          />
        </LinkRouter>
        <span className={styles.header}>Zarejestruj się</span>
      </div>
      <FormControl className={styles.formControl}>
        <TextField
          className={styles.input}
          label="Login"
          variant="outlined"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          helperText={
            errors.login.length === 0
              ? "Np. nick, imię i nazwisko (min. 4 znaki, max. 32 znaki)"
              : errors.login.join(" ")
          }
          error={errors.login.length > 0}
          required
        />

        <TextField
          className={styles.input}
          label="Hasło"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          helperText={
            errors.password.length === 0
              ? "Min. 8 znaków (max. 32 znaki), min. 1 cyfra i 1 wielka oraz mała litera"
              : errors.password.join(" ")
          }
          error={errors.password.length > 0}
          required
        />
        <TextField
          className={styles.input}
          label="Adres e-mail"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          helperText={errors.email.join(" ")}
          error={errors.email.length > 0}
          required
        />

        <Button
          className={styles.button}
          variant="outlined"
          color="primary"
          onClick={register}
        >
          Zarejestruj się
        </Button>
      </FormControl>
    </Container>
  );
}

export default Register;
