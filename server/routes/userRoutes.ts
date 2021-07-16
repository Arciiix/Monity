import express from "express";
import { login } from "../services/User";

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

export default router;
