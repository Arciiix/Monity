import { toast } from "react-toastify";
import { ErrorOutline } from "@material-ui/icons";

function errorToast(error: string): void {
  toast.error(
    <div className={"errorToastContainer"}>
      <ErrorOutline /> <span>{error}</span>
    </div>,
    {
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      draggable: false,
      onClick: (e) => console.log("TODO: Redirect to the error page"),
    }
  );
}

export default errorToast;
