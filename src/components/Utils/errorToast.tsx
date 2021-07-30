import { toast } from "react-toastify";
import { ErrorOutline } from "@material-ui/icons";

function errorToast(error: string, isFatal?: boolean): void {
  if (isFatal) {
    //TODO: Redirect to the error page instantly
    console.log("TODO: Redirect to the error page");
    //return;
  }
  toast.error(
    <div className="errorToastContainer">
      <ErrorOutline />{" "}
      <span
        style={{
          overflowWrap: "break-word",
          wordWrap: "break-word",
          width: "60%",
        }}
      >
        {error}
      </span>
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
