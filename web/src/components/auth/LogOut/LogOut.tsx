import { Logout } from "@mui/icons-material";
import {
  createTheme,
  IconButton,
  Theme,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import userState from "../../../atoms/user/user.atom";
import InfoDialogTypes from "../../../types/infoDialog/infoDialogTypes.enum";
import useInfoDialog from "../../hooks/useInfoDialog";
import { AxiosErr, fetch, isAxiosErr } from "../../utils/axios";

interface ILogOutProps {
  whiteTheme?: boolean;
}
const LogOut = ({ whiteTheme = false }: ILogOutProps) => {
  const { addToInfoDialogs } = useInfoDialog();
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(userState);
  const [theme, setTheme] = useState<Theme>();

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

  useEffect(() => {
    setTheme(
      createTheme({
        palette: {
          mode: whiteTheme ? "light" : "dark",
        },
      })
    );
  }, [whiteTheme]);

  return (
    <ThemeProvider theme={theme as Theme}>
      <Tooltip title="Log out">
        <IconButton onClick={handleLogOut}>
          <Logout />
        </IconButton>
      </Tooltip>
    </ThemeProvider>
  );
};
export default LogOut;
