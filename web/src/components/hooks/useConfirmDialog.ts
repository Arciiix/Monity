import { useContext } from "react";
import { ConfirmContext } from "../../context/ConfirmationDialogContext";

function useConfirmDialog() {
  const context = useContext<(description: string) => Promise<boolean>>(
    ConfirmContext as any
  );
  return context;
}
export default useConfirmDialog;
