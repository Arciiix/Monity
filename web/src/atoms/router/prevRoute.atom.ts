import { atom } from "recoil";

const prevRouteState = atom<string>({
  key: "prevRoute",
  default: "/app",
});

export default prevRouteState;
