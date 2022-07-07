import { Avatar, Box, Menu, MenuItem, Typography } from "@mui/material";
import { useId, useState } from "react";
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
      <div className="flex flex-row items-center gap-1">
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
      </div>

      <LogOut whiteTheme />
    </Box>
  );
};
export default UserWidget;
