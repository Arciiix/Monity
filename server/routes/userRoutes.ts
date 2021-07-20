import express from "express";
import { login, register } from "../services/User";

const router = express.Router();

router.get("/login", async (req, res) => {
  if (!req.query.login || !req.query.password) {
    return res
      .status(400)
      .send({ error: true, errorCode: "MISSING_QUERY_PARAMS" });
  }

  let result = await login(
    req.query.login as string,
    req.query.password as string
  );
  if (result.error) {
    if (result.errorCode === "NOT_FOUND") {
      res.status(404);
    } else if (result.errorCode === "WRONG_PASSWORD") {
      res.status(403);
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
  if (!req.query.login || !req.query.email || !req.query.password) {
    return res
      .status(400)
      .send({ error: true, errorCode: "MISSING_QUERY_PARAMS" });
  }

  let result = await register(
    req.query.login as string,
    req.query.email as string,
    req.query.password as string
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
  }
  res.send({
    error: result.error,
    errorCode: result.errorCode,
    data: result.data,
  });
});

export default router;
