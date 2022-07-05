import { atom } from "recoil";
import IInfoDialogData from "../../types/infoDialog/infoDialogData.interface";
const dialogStackState = atom<IInfoDialogData[]>({
  key: "dialogStack",
  default: [],
});

export default dialogStackState;
