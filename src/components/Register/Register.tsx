import { ReactElement, useState } from "react";
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

import styles from "./Register.module.css";

interface IErrorsObject {
  login: string[];
  password: string[];
  email: string[];
  forgotPasswordQuestion: { question: string[]; answer: string[] };
}

function Register(): ReactElement {
  let [login, setLogin] = useState("");
  let [password, setPassword] = useState("");
  let [showPassword, setShowPassword] = useState(false);
  let [email, setEmail] = useState("");
  let [forgotPasswordQuestion, setForgotPasswordQuestion] = useState({
    question: "",
    answer: "",
  });

  let [errors, setErrors] = useState<IErrorsObject>({
    login: [],
    password: [],
    email: [],
    forgotPasswordQuestion: { question: [], answer: [] },
  });

  const register = async (): Promise<void> => {
    let errors: IErrorsObject = validate();
    setErrors(errors);
    //DEV
    //TODO: If there's no error, register the user
  };

  const validate = (): IErrorsObject => {
    let prevErrorsObject: IErrorsObject = {
      login: [],
      password: [],
      email: [],
      forgotPasswordQuestion: { question: [], answer: [] },
    };

    //Login
    if (login.length < 4 || login.length > 32) {
      prevErrorsObject.login.push(
        "Login musi mieć przynajmniej 4 znaki, a maksymalnie - 32."
      );
    }

    let loginRegEx = /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d.-_]*$/;
    if (!loginRegEx.test(login)) {
      prevErrorsObject.login.push(
        "Login może zawierać tylko litery (bez polskich znaków), cyfry, kropki, myślniki i podkreślenia oraz zaczynać się od litery."
      );
    }

    //Password
    if (password.length < 4 || password.length > 32) {
      prevErrorsObject.password.push(
        "Hasło musi mieć przynajmniej 8 znaków, a maksymalnie - 32."
      );
    }

    let passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&.ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
    if (!passwordRegEx.test(password)) {
      prevErrorsObject.password.push(
        "Hasło musi zawierać minimum 1 cyfrę, 1 wielką i małą literę oraz może zawierać jedynie następujące znaki specjalne: @$!%*?&."
      );
    }

    //E-mail
    let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test(email)) {
      prevErrorsObject.email.push("To nie jest prawidłowy adres e-mail.");
    }

    let lettersAndNumbersOnly = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ\d]+$/;

    //Forgot password question
    if (
      forgotPasswordQuestion.question.length < 8 ||
      forgotPasswordQuestion.question.length > 64
    ) {
      prevErrorsObject.forgotPasswordQuestion.question.push(
        "Pytanie musi zawierać minimum 8 znaki, a maksymalne - 64."
      );
    }
    if (!lettersAndNumbersOnly.test(forgotPasswordQuestion.question)) {
      prevErrorsObject.forgotPasswordQuestion.question.push(
        "Pytanie może zawierać tylko litery i cyfry."
      );
    }

    //Forgot password answer
    if (
      forgotPasswordQuestion.answer.length < 4 ||
      forgotPasswordQuestion.answer.length > 32
    ) {
      prevErrorsObject.forgotPasswordQuestion.answer.push(
        "Odpowiedź musi zawierać minimum 4 znaki, a maksymalne - 32."
      );
    }
    if (!lettersAndNumbersOnly.test(forgotPasswordQuestion.answer)) {
      prevErrorsObject.forgotPasswordQuestion.answer.push(
        "Odpowiedź może zawierać tylko litery i cyfry."
      );
    }

    return prevErrorsObject;
  };

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
      <FormControl>
        <span className={styles.formSectionHeader}>Podstawowe dane</span>
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

        <span className={styles.formSectionHeader}>Pytanie pomocnicze</span>

        <span className={styles.optionHelper}>
          Pytanie pomocnicze to pytanie, które umożliwi Ci odzyskanie dostępu do
          konta wtedy, gdy nie pamiętasz hasła. Powinno być trudne - tylko Ty
          powinieneś znać na nie odpowiedź.
        </span>
        <TextField
          className={styles.input}
          label="Pytanie"
          variant="outlined"
          value={forgotPasswordQuestion.question}
          onChange={(e) =>
            setForgotPasswordQuestion({
              question: e.target.value,
              answer: forgotPasswordQuestion.answer,
            })
          }
          helperText={
            errors.forgotPasswordQuestion.question.length === 0
              ? "Min. 8 znaków, max. 64 znaki, litery i cyfry"
              : errors.forgotPasswordQuestion.question.join(" ")
          }
          error={errors.forgotPasswordQuestion.question.length > 0}
          required
        />
        <TextField
          className={styles.input}
          label="Odpowiedź"
          variant="outlined"
          value={forgotPasswordQuestion.answer}
          onChange={(e) =>
            setForgotPasswordQuestion({
              answer: e.target.value,
              question: forgotPasswordQuestion.question,
            })
          }
          helperText={
            errors.forgotPasswordQuestion.answer.length === 0
              ? "Min. 4 znaki, max. 32 znaki, litery i cyfry"
              : errors.forgotPasswordQuestion.answer.join(" ")
          }
          error={errors.forgotPasswordQuestion.answer.length > 0}
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
