import { Settings } from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import userState from "../../../atoms/user/user.atom";
import UserWidget from "../../auth/UserWidget/UserWidget";

const DrawerContent = () => {
  const user = useRecoilValue(userState);

  return (
    <Box>
      <UserWidget user={user} />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};
export default DrawerContent;
