import User from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { constants } from "../utils";

const refreshTokens: string[] = [];

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
  let user: any = await User.findOne({
    where: {
      login: login,
    },
  });

  if (!user) return { error: true, errorCode: "NOT_FOUND" };

  let compare: boolean = await bcrypt.compare(password, user.password);
  if (!compare) return { error: true, errorCode: "WRONG_PASSWORD" };

  //In case user provides correct credentials, generate the access and refresh token
  let accessToken = jwt.sign(
    { id: user.id, login: user.login, email: user.email },
    constants.jwtSecretAccess,
    { expiresIn: "30m" }
  );
  let refreshToken = jwt.sign(
    { id: user.id, login: user.login, email: user.email },
    constants.jwtSecretRefersh,
    { expiresIn: "60d" }
  );

  refreshTokens.push(refreshToken);

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

export { login };
