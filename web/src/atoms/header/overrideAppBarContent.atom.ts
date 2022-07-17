import React from "react";
import { atom } from "recoil";

const overrideAppBarContentState = atom<React.ReactNode | null>({
  key: "override-appbar-content",
  default: null,
});

export default overrideAppBarContentState;
