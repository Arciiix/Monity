import { IconButton, Toolbar } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { useRecoilState } from "recoil";
import isDrawerOpenState from "../../../atoms/drawer/isDrawerOpen.atom";

const DrawerToggle = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Toolbar>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="Open drawer"
        onClick={toggleDrawer}
        sx={{ mr: 2, display: { sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>
    </Toolbar>
  );
};
export default DrawerToggle;
