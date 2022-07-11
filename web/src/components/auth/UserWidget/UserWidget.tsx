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
      className="py-2 px-2 rounded-xl bg-slate-800 w-11/12"
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap={1}
      m={1}
    >
      <div className="flex flex-row items-center gap-1 w-9/12">
        <div className={"p-1 bg-slate-600 rounded-full"}>
          <Avatar
            src={user?.avatarURI ?? ""}
            alt={user?.login ?? "User avatar"}
            sx={{
              width: 24,
              height: 24,
            }}
          />
        </div>
        <Typography className="text-slate-200 text-xl m-1 w-6/12 break-words">
          {user?.login ?? ""}
        </Typography>
      </div>

      <LogOut />
    </Box>
  );
};
export default UserWidget;
