import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { routerMapping, routes } from "../../../App";
import userState from "../../../atoms/user/user.atom";
import IRoute from "../../../types/routing/route.interface";
import RoutesType from "../../../types/routing/routes.type";
import UserWidget from "../../auth/UserWidget/UserWidget";

const DrawerContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentActiveListItem, setCurrentActiveListItem] =
    useState<RoutesType>("default");
  const [routesState, setRoutesState] = useState<IRoute[]>([]);
  const user = useRecoilValue(userState);

  const handleSubroutesToggle = (
    parentIndex: number,
    overrideOpen?: boolean
  ) => {
    setRoutesState((prev) => {
      let newState = [...prev];
      newState[parentIndex].open =
        overrideOpen ?? !prev[parentIndex].open ?? false;
      return newState;
    });
  };

  const navigateToRoute = (routeName: string) => {
    const route = Object.entries(routerMapping).find(
      ([key, value]) => value === routeName
    );
    if (!route) {
      return;
    } else {
      navigate(route[0]);
    }
  };

  const renderRoute = (e: IRoute, index: number) => {
    if (e.subroutes) {
      return (
        <>
          <ListItem disablePadding key={`${e.name}-route-item`}>
            <ListItemButton
              key={`${e.name}-route-item-btn`}
              onClick={() => handleSubroutesToggle(index)}
            >
              <ListItemIcon>{e.icon}</ListItemIcon>
              <ListItemText>{e.displayName}</ListItemText>
              {!!routesState[index].open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse
            key={`${e.name}-collapse-item`}
            in={!!routesState[index].open}
            timeout="auto"
            unmountOnExit
          >
            <List key={`${e.name}-subroutes-list`}>
              {e.subroutes.map(renderRoute)}
            </List>
          </Collapse>
        </>
      );
    } else {
      return (
        <ListItem key={`${e.name}-route-item`} disablePadding>
          <ListItemButton
            key={`${e.name}-route-item-btn`}
            selected={routerMapping[currentActiveListItem] === e.name}
            onClick={() => navigateToRoute(e.name)}
          >
            <ListItemIcon>{e.icon}</ListItemIcon>
            <ListItemText>{e.displayName}</ListItemText>
          </ListItemButton>
        </ListItem>
      );
    }
  };

  const renderRoutes = useMemo((): JSX.Element[] => {
    return routesState.map(renderRoute);
  }, [currentActiveListItem, routesState]);

  const handleSubroutesExpand = (currentActiveListItem: RoutesType) => {
    //If the route is the subroute, expand the 'higher levels' of the route
    let routeName = routerMapping[currentActiveListItem];
    if (routeName?.includes("/")) {
      let levels = routeName.split("/"); //e.g. ["app", "manage", "accounts"]

      setRoutesState((prev) => {
        let newState = [...prev];

        let currLevel: IRoute[] | null = null;
        for (let i = 0; i < levels.length - 1; i++) {
          let index;

          //Iterate through the tree of routes. The first level is 0th, so find the root of the path.
          if (currLevel) {
            index = currLevel?.findIndex(
              (elem) => elem.name.includes(levels[i - 1]) //e.g. levels[i - 1] is "manage" and elem.name is "app/name"
            );
          } else {
            index = prev.findIndex((e) => e.name === levels[0]); //The element from the global root tree
          }
          if (index === -1) {
            continue;
          }
          newState[index].open = true; //Open the current level of tree
          currLevel = newState[index].subroutes as IRoute[] | null; //Set the current level of tree to the children of the previous current level
        }

        return newState;
      });
    }
  };

  useEffect(() => {
    if (location.pathname in routerMapping) {
      setCurrentActiveListItem(location.pathname as RoutesType);
      handleSubroutesExpand(location.pathname as RoutesType);
    } else {
      setCurrentActiveListItem("default");
    }
  }, [location]);
  useEffect(() => {
    setRoutesState(routes);
    handleSubroutesExpand(location.pathname as RoutesType);
  }, []);

  return (
    <Box>
      <UserWidget user={user} />
      <List>{renderRoutes}</List>
    </Box>
  );
};
export default DrawerContent;
