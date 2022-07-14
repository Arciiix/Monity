import { Settings } from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { routerMapping, routes } from "../../../App";
import userState from "../../../atoms/user/user.atom";
import IRoute from "../../../types/routing/route.interface";
import RoutesType from "../../../types/routing/routes.type";
import UserWidget from "../../auth/UserWidget/UserWidget";

const DrawerContent = () => {
  const location = useLocation();
  const [currentActiveListItem, setCurrentActiveListItem] =
    useState<RoutesType>("default");
  const user = useRecoilValue(userState);

  const renderRoutes = useMemo((): JSX.Element[] => {
    return routes.map((e: IRoute) => {
      return (
        <ListItem disablePadding>
          <ListItemButton
            selected={routerMapping[currentActiveListItem] === e.name}
          >
            <ListItemIcon>{e.icon}</ListItemIcon>
            <ListItemText>{e.displayName}</ListItemText>
          </ListItemButton>
        </ListItem>
      );
    });
  }, [currentActiveListItem]);

  useEffect(() => {
    if (location.pathname in routerMapping) {
      setCurrentActiveListItem(location.pathname as RoutesType);
    } else {
      setCurrentActiveListItem("default");
    }
  }, [location]);

  return (
    <Box>
      <UserWidget user={user} />
      <List>{renderRoutes}</List>
    </Box>
  );
};
export default DrawerContent;
