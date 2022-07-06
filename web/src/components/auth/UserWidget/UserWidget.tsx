import { Avatar, Box, Typography } from "@mui/material";
import { IUser } from "../../../types/user/user.interface";
import LogOut from "../LogOut/LogOut";

import styles from "./UserWidget.module.css";

interface IUserWidgetProps {
  user: IUser | null;
}
const UserWidget = ({ user }: IUserWidgetProps) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" gap={1} m={1}>
      <Box display="flex" flexDirection="row" alignItems="center" gap={"4px"}>
        <div className={styles.avatar}>
          <Avatar
            src={user?.avatarURI ?? ""}
            alt={user?.login ?? "User avatar"}
            sx={{
              width: 32,
              height: 32,
            }}
          />
        </div>
        <Typography>{user?.login ?? ""}</Typography>
      </Box>
      <LogOut />
    </Box>
  );
};
export default UserWidget;
