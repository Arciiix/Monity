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
      message: `An unknown error has occured 😒`,
      type: InfoDialogTypes.error,
    });
  };

  const displayUnreleasedFeatureDialog = () => {
    addToInfoDialogs({
      title: "Oops!",
      message: `You've just discovered an unreleased feature! Wooow... wait a minute! 👀`,
      type: InfoDialogTypes.warning,
    });
  };

  return {
    addToInfoDialogs,
    displayUnknownErrorDialog,
    displayUnreleasedFeatureDialog,
  };
};

export default useInfoDialog;
