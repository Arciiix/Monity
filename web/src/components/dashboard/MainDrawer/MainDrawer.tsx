import { Box, Drawer } from "@mui/material";
import { useRecoilState } from "recoil";
import isDrawerOpenState from "../../../atoms/drawer/isDrawerOpen.atom";
import DrawerContent from "./DrawerContent";

interface IMainDrawerProps {
  width: number | string;
}
const MainDrawer = ({ width }: IMainDrawerProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useRecoilState(isDrawerOpenState);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Box component="nav" sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}>
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: width },
        }}
      >
        <DrawerContent />
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: width },
        }}
        open
      >
        <DrawerContent />
      </Drawer>
    </Box>
  );
};

export default MainDrawer;
