import { IUser } from "../../types/user/user.interface";
import { fetch } from "./axios";

async function checkForLogin(): Promise<IUser | null> {
  try {
    const response = await fetch.get("/v1/auth/me");
    return response.data as IUser;
  } catch (_) {
    return null;
  }
}
export { checkForLogin };
