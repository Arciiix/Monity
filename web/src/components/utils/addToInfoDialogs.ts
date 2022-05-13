import { SetterOrUpdater } from "recoil";
import IInfoDialogData from "../InfoDialog/types/infoDialogData.interface";

function addToInfoDialogs(
  message: IInfoDialogData,
  previous: IInfoDialogData[],
  setStateInstance: SetterOrUpdater<IInfoDialogData[]>
) {
  setStateInstance([...previous, message]);
}

export default addToInfoDialogs;
