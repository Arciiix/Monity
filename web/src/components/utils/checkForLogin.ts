import { IUser } from "../../types/user/user.interface";
import { fetch } from "./axios";

async function checkForLogin(): Promise<IUser | null> {
  try {
    const response = await fetch.get("/v1/auth/me", {
      dontReload: true, //Don't reload the window if the refresh token interceptor fails (because it would cause the infinite loop)
    } as any);
    return response.data as IUser;
  } catch (_) {
    return null;
  }
}
export { checkForLogin };
