import express from "express";
import {
  login,
  register,
  authorize,
  removeRefreshToken,
} from "../services/User";

const router = express.Router();

router.get("/login", async (req, res) => {
  if (!req.query.login || !req.query.password) {
    return res
      .status(400)
      .send({ error: true, errorCode: "MISSING_QUERY_PARAMS" });
  }

  let result = await login(
    decodeURIComponent(req.query.login as string),
    decodeURIComponent(req.query.password as string)
  );
  if (result.error) {
    if (result.errorCode === "NOT_FOUND") {
      res.status(404);
    } else if (result.errorCode === "WRONG_PASSWORD") {
      res.status(403);
    } else if (
      result.errorCode === "WRONG_EMAIL_FORMAT" ||
      result.errorCode === "WRONG_LOGIN_FORMAT"
    ) {
      res.status(400);
    } else {
      res.status(500);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.send({ error: true, errorCode: result.errorCode });
  } else {
    res.cookie("accessToken", result.tokens.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    });
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 60,
    });
  }

  res.send({ error: false, data: result.data });
});

router.post("/register", async (req, res) => {
  if (!req.body.login || !req.body.email || !req.body.password) {
    return res.status(400).send({ error: true, errorCode: "MISSING_PARAMS" });
  }

  let result = await register(
    req.body.login as string,
    req.body.email as string,
    req.body.password as string
  );

  if (result.error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    if (
      (result.errorCode as string) &&
      result.errorCode.includes("VALIDATION")
    ) {
      res.status(400);
    } else if (
      (result.errorCode as string) &&
      result.errorCode === "ALREADY_EXISTS"
    ) {
      res.status(409);
    } else {
      res.status(500);
    }
  } else {
    res.cookie("accessToken", result.tokens.accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    });
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 60,
    });
    res.status(201);
  }
  res.send({
    error: result.error,
    errorCode: result.errorCode,
    data: result.data,
  });
});

router.get("/auth", async (req, res) => {
  if (!req.cookies.refreshToken)
    return res.status(403).send({ error: true, errorCode: "NO_REFRESHTOKEN" });

  let tokenAuthorization: {
    error: boolean;
    errorCode?: string;
    accessToken?: string;
    data?: { id: string; login: string; email: string };
  } = await authorize(req.cookies.refreshToken, req.cookies?.accessToken);

  if (tokenAuthorization.error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res
      .status(403)
      .send({ error: true, errorCode: tokenAuthorization.errorCode });
  } else {
    if (tokenAuthorization.accessToken !== req.cookies.accessToken) {
      res.cookie("accessToken", tokenAuthorization.accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });
    }
    res.send({ error: false, data: tokenAuthorization.data });
  }
});

router.delete("/logout", (req, res) => {
  if (!req.cookies.accessToken || !req.cookies.refreshToken) {
    return res.status(400).send({ error: true, errorCode: "NO_TOKEN" });
  }

  removeRefreshToken(req.cookies.refreshToken || "");
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.send({ error: false });
});

export default router;
