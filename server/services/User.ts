import { Op, Sequelize } from "sequelize";
import User from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { constants } from "../utils";

let refreshTokens: { id: string; token: string }[] = [];

async function login(
  login: string,
  password: string
): Promise<{
  error: boolean;
  errorCode?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  data?: {
    id: string;
    login: string;
    email: string;
  };
}> {
  login = login.toLowerCase();
  let user: any;

  if (login.includes("@")) {
    //Prevent SQL Injection
    let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegEx.test(login)) {
      return { error: true, errorCode: "WRONG_EMAIL_FORMAT" };
    }

    user = await User.findOne({
      where: {
        email: login,
      },
    });
  } else {
    //Prevent SQL Injection
    let loginRegEx = /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d\.\-_]*$/;
    if (!loginRegEx.test(login)) {
      return { error: true, errorCode: "WRONG_LOGIN_FORMAT" };
    }

    user = await User.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("login")),
        Sequelize.fn("lower", login)
      ),
    });
  }
  if (!user) return { error: true, errorCode: "NOT_FOUND" };

  let compare: boolean = await bcrypt.compare(password, user.password);
  if (!compare) return { error: true, errorCode: "WRONG_PASSWORD" };

  //In case user provides correct credentials, generate the access and refresh token
  let accessToken: string = generateAccessToken(
    user.id,
    user.login,
    user.email
  );
  let refreshToken: string = generateRefreshToken(
    user.id,
    user.login,
    user.email
  );

  return {
    error: false,
    tokens: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
    data: {
      id: user.id,
      login: user.login,
      email: user.email,
    },
  };
}

function generateRefreshToken(
  id: string,
  login: string,
  email: string
): string {
  let refreshToken: string = jwt.sign(
    { id: id, login: login, email: email },
    constants.jwtSecretRefersh,
    { expiresIn: "60d" }
  );

  //Add the refreshToken to an array
  refreshTokens.push({ id: id, token: refreshToken });

  return refreshToken;
}

function generateAccessToken(id: string, login: string, email: string): string {
  return jwt.sign(
    { id: id, login: login, email: email },
    constants.jwtSecretAccess,
    { expiresIn: "30m" }
  );
}

async function register(
  login: string,
  email: string,
  password: string
): Promise<{
  error: boolean;
  errorCode?: string;
  tokens?: { accessToken: string; refreshToken: string };
  data?: {
    id: string;
    login: string;
    email: string;
  };
}> {
  email = email.toLowerCase();

  //The same validation as on the client-side. I don't want the client to call the server every time - I have to do the same on the server to avoid making a cross-site request.

  //Login
  if (login.length < 4 || login.length > 32) {
    return { error: true, errorCode: "VALIDATION_LOGIN_LENGTH" };
  }

  let loginRegEx = /^(?=.*[A-Za-z0-9]$)[A-Za-z][A-Za-z\d\.\-_]*$/;
  if (!loginRegEx.test(login)) {
    return { error: true, errorCode: "VALIDATION_LOGIN_FORMAT" };
  }

  //Password
  if (password.length < 4 || password.length > 32) {
    return { error: true, errorCode: "VALIDATION_PASSWORD_LENGTH" };
  }

  let passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&.ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/;
  if (!passwordRegEx.test(password)) {
    return { error: true, errorCode: "VALIDATION_PASSWORD_FORMAT" };
  }

  //E-mail
  let emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegEx.test(email)) {
    return { error: true, errorCode: "VALIDATION_EMAIL_FORMAT" };
  }

  //Check whether user exists already, and if so, return an error
  let userExistObj = await User.findOne({
    where: {
      [Op.or]: [
        Sequelize.where(
          Sequelize.fn("lower", Sequelize.col("login")),
          Sequelize.fn("lower", login)
        ),
        {
          email: email,
        },
      ],
    },
  });

  if (userExistObj) {
    return { error: true, errorCode: "ALREADY_EXISTS" };
  }

  //Create the user
  let userInstancePromise: any = await new Promise(
    (resolve: any, reject: any) => {
      User.create({
        login,
        email,
        password,
      })
        .then((data) => resolve({ error: false, data: data }))
        .catch((err) => resolve({ error: true, data: err.toString() }));
    }
  );

  if (userInstancePromise.error) {
    return { error: true, errorCode: userInstancePromise.data };
  }

  let userInstance = userInstancePromise.data;

  //Create a default "cash" account for the user
  userInstance.createAccount({ name: "Gotówka" });

  let accessToken: string = generateAccessToken(
    userInstance.id,
    userInstance.login,
    userInstance.email
  );
  let refreshToken: string = generateRefreshToken(
    userInstance.id,
    userInstance.login,
    userInstance.email
  );

  return {
    error: false,
    tokens: {
      accessToken: accessToken,
      refreshToken: refreshToken,
    },
    data: {
      id: userInstance.id,
      login: userInstance.login,
      email: userInstance.email,
    },
  };
}

async function validateToken(
  token: string,
  isAccessToken: boolean
): Promise<{
  error: boolean;
  errorCode?: string;
  data?: any;
}> {
  return await new Promise((resolve: any) => {
    jwt.verify(
      token,
      isAccessToken ? constants.jwtSecretAccess : constants.jwtSecretRefersh,
      (err, decoded) => {
        if (err) {
          resolve({ error: true, errorCode: err.name });
        } else {
          resolve({ error: false, data: decoded });
        }
      }
    );
  });
}

async function authorize(
  refreshToken: string,
  accessToken?: string
): Promise<{
  error: boolean;
  errorCode?: string;
  accessToken?: string;
  data?: { id: string; login: string; email: string };
}> {
  let refreshTokenValidation = await validateToken(refreshToken, false);
  if (refreshTokenValidation.error) {
    if (refreshTokenValidation?.errorCode === "TokenExpiredError") {
      return { error: true, errorCode: "REFRESHTOKEN_EXPIRED" };
    } else {
      return { error: true, errorCode: "WRONG_REFRESHTOKEN" };
    }
  }
  if (!refreshTokens.find((e) => e.token === refreshToken)) {
    return { error: true, errorCode: "REFRESHTOKEN_NOTFOUND" };
  }

  let newAccessToken: string = "";

  if (accessToken) {
    let accessTokenValidation = await validateToken(accessToken, true);
    if (!accessTokenValidation.error) newAccessToken = accessToken;
  }

  if (!newAccessToken) {
    //If the access token is invalid/expired/empty, generate a new one
    newAccessToken = generateAccessToken(
      refreshTokenValidation.data.id,
      refreshTokenValidation.data.login,
      refreshTokenValidation.data.email
    );
  }

  return {
    error: false,
    accessToken: newAccessToken,
    data: {
      id: refreshTokenValidation.data.id,
      login: refreshTokenValidation.data.login,
      email: refreshTokenValidation.data.email,
    },
  };
}

function removeRefreshToken(token: string): void {
  refreshTokens = refreshTokens.filter((e) => e.token !== token);
}

export {
  login,
  register,
  authorize,
  generateRefreshToken,
  generateAccessToken,
  validateToken,
  removeRefreshToken,
};
