import { atom } from "recoil";
const isDrawerOpenState = atom<boolean>({
  key: "isDrawerOpen",
  default: false,
});

export default isDrawerOpenState;
