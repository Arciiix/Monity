import { Avatar, Box, Typography } from "@mui/material";
import { IUser } from "../../../types/user/user.interface";
import LogOut from "../LogOut/LogOut";

interface IUserWidgetProps {
  user: IUser | null;
}
const UserWidget = ({ user }: IUserWidgetProps) => {
  return (
    <Box
      className="py-2 px-5 rounded-2xl bg-gray-100 w-max"
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={1}
      m={1}
    >
      <Box display="flex" flexDirection="row" alignItems="center" gap={"4px"}>
        <div className={"p-2 bg-gray-600 rounded-full"}>
          <Avatar
            src={user?.avatarURI ?? ""}
            alt={user?.login ?? "User avatar"}
            sx={{
              width: 32,
              height: 32,
            }}
          />
        </div>
        <Typography className="text-slate-800 text-xl">
          {user?.login ?? ""}
        </Typography>
      </Box>
      <LogOut whiteTheme />
    </Box>
  );
};
export default UserWidget;
