import { atom } from "recoil";
import { IUser } from "../types/user.interface";

const userState = atom<IUser | null>({
  key: "userData",
  default: null,
});

export default userState;
