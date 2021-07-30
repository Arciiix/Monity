import { authorize } from "../services/User";

async function requireLogin(req, res, next) {
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
    req.userData = tokenAuthorization.data;
    next();
  }
}

export default requireLogin;
