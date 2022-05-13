import { SetterOrUpdater } from "recoil";
import IInfoDialogData from "../InfoDialog/types/infoDialogData.interface";
import InfoDialogTypes from "../InfoDialog/types/infoDialogTypes.enum";
import addToInfoDialogs from "./addToInfoDialogs";

function displayUnknownErrorDialog(
  infoDialogs: IInfoDialogData[],
  setInfoDialogs: SetterOrUpdater<IInfoDialogData[]>
) {
  return addToInfoDialogs(
    {
      title: "Unknown error",
      message: `An unknown error has occured :(`,
      type: InfoDialogTypes.error,
    },
    infoDialogs,
    setInfoDialogs
  );
}

export default displayUnknownErrorDialog;
