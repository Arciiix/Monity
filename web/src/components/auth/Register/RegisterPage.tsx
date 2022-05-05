import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Logo from "../../Logo/Logo";
import { useState } from "react";
import LoadingOverlay from "../../Loading/LoadingOverlay/LoadingOverlay";
import validator from "validator";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { VisibilityOff, Visibility } from "@mui/icons-material";

function RegisterPage() {
  let [login, setLogin] = useState("");
  let [password, setPassword] = useState("");
  let [passwordConfirm, setPasswordConfirm] = useState("");
  let [email, setEmail] = useState("");

  let [showPassword, setShowPassword] = useState(false);
  let [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  let [errors, setErrors] = useState<{
    login: string;
    password: string;
    passwordConfirm: string;
    email: string;
  }>({
    login: "",
    password: "",
    passwordConfirm: "",
    email: "",
  });

  let [isLoading, setIsLoading] = useState(false);

  const handleClickShowPassword = (isConfirm: boolean) => {
    if (isConfirm) {
      setShowPasswordConfirm(!showPasswordConfirm);
    } else {
      setShowPassword(!showPassword);
    }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const validate = (): boolean => {
    let isThereAnyError = false;
    let errorObj = { ...errors };

    if (
      !validator.isLength(login, {
        min: 4,
        max: 20,
      })
    ) {
      isThereAnyError = true;
      errorObj.login = "Login must be between 4 and 20 characters";
    } else if (!validator.isAlphanumeric(login)) {
      isThereAnyError = true;
      errorObj.login = "Login must contain only English letters and numbers";
    } else {
      errorObj.login = "";
    }

    let passwordErrors = [];

    //Check for minimal length
    if (password.length < 8) {
      passwordErrors.push("be at least 8 characters long");
    }
    //Check for maximum length
    if (password.length > 32) {
      passwordErrors.push("be at most 32 characters long");
    }

    //Check for one uppercase letter
    if (!password.match(/[A-Z]/)) {
      passwordErrors.push("contain at least one uppercase letter");
    }

    //Check for one lowercase letter
    if (!password.match(/[a-z]/)) {
      passwordErrors.push("contain at least one lowercase letter");
    }

    //Check for one number
    if (!password.match(/[0-9]/)) {
      passwordErrors.push("contain at least one number");
    }

    //Check for allowed chars
    if (!/[a-zA-Z0-9!@#$%^&*]/.test(password)) {
      passwordErrors.push(
        "contain only characters from the list: a-z, A-Z, 0-9, !@#$%^&*"
      );
    }

    if (passwordErrors.length > 0) {
      isThereAnyError = true;
      errorObj.password = "Password must: " + passwordErrors.join(", ");
    } else {
      errorObj.password = "";
    }

    if (password !== passwordConfirm) {
      isThereAnyError = true;
      errorObj.passwordConfirm = "Passwords do not match";
    } else {
      errorObj.passwordConfirm = "";
    }

    if (!validator.isEmail(email)) {
      isThereAnyError = true;
      errorObj.email = "Email is not valid";
    } else {
      errorObj.email = "";
    }

    setErrors(errorObj);
    return !isThereAnyError;
  };

  const register = async () => {
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    //TODO: Register
  };

  return (
    <Box>
      <LoadingOverlay isLoading={isLoading} />

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        m="30px"
      >
        <Logo logoHeight={"150px"} />
        <h1>Register</h1>

        <FormControl>
          <TextField
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            label="Login"
            margin="normal"
            fullWidth
            required
            error={!!errors.login} //Convert string to boolean
            helperText={
              errors.login ||
              "From 4 to 20 characters, only English letters and numbers"
            }
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            fullWidth
            required
            error={!!errors.password} //Convert string to boolean
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword(false)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={
              errors.password ||
              "From 8 to 32 characters, at least one number, one lowercase and one uppercase letter, only the following special characters: !@#$%^&*"
            }
          />
          <TextField
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            label="Confirm password"
            type={showPasswordConfirm ? "text" : "password"}
            margin="normal"
            fullWidth
            required
            error={!!errors.passwordConfirm} //Convert string to boolean
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleClickShowPassword(true)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={errors.passwordConfirm || "Confirm your password"}
          />

          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            margin="normal"
            fullWidth
            required
            placeholder="you@example.com"
            error={!!errors.email} //Convert string to boolean
            helperText={errors.email || "Your email address"}
          />

          <Box my="20px">
            <Button
              onClick={register}
              variant="outlined"
              color="primary"
              fullWidth
            >
              Register
            </Button>
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
}

export default RegisterPage;