import { Logout } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userState from "../../../atoms/user/user.atom";
import InfoDialogTypes from "../../../types/infoDialog/infoDialogTypes.enum";
import useInfoDialog from "../../hooks/useInfoDialog";
import { AxiosErr, fetch, isAxiosErr } from "../../utils/axios";

const LogOut = () => {
  const { addToInfoDialogs } = useInfoDialog();
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(userState);

  const handleLogOut = async () => {
    try {
      await fetch.delete("/v1/auth/logout");
      setUser(null);
      navigate("/auth/login");
    } catch (err: AxiosErr) {
      let parsedErr = isAxiosErr(err);
      if (parsedErr) {
        addToInfoDialogs({
          type: InfoDialogTypes.error,
          title: "Couldn't log out",
          message: `Server error ${
            parsedErr.statusCode
          } with response ${JSON.stringify(parsedErr.response)}`,
        });
      } else {
        addToInfoDialogs({
          type: InfoDialogTypes.error,
          title: "Couldn't log out",
          message: `Unknown error`,
        });
      }
      console.error(err);
    }
  };

  return (
    <Tooltip title="Log out">
      <IconButton onClick={handleLogOut}>
        <Logout />
      </IconButton>
    </Tooltip>
  );
};
export default LogOut;
