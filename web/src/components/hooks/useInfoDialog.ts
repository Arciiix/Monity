import { useRecoilState } from "recoil";
import dialogStackState from "../../atoms/infoDialog/dialogStack.atom";
import IInfoDialogData from "../../types/infoDialog/infoDialogData.interface";
import InfoDialogTypes from "../../types/infoDialog/infoDialogTypes.enum";

const useInfoDialog = () => {
  const [infoDialogs, setInfoDialogs] = useRecoilState(dialogStackState);

  const addToInfoDialogs = (message: IInfoDialogData) => {
    setInfoDialogs((previous) => [...previous, message]);
  };

  const displayUnknownErrorDialog = () => {
    addToInfoDialogs({
      title: "Unknown error",
      message: `An unknown error has occured :(`,
      type: InfoDialogTypes.error,
    });
  };

  return { addToInfoDialogs, displayUnknownErrorDialog };
};

export default useInfoDialog;
