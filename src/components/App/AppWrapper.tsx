import { ReactElement, useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { authorize, IUserData, logOut } from "../Utils/auth";
import { setTitle } from "../Utils/setTitle";
import { valueToString } from "../Utils/valueToString";

import {
  Drawer,
  AppBar,
  IconButton,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  Button,
} from "@material-ui/core";

import styles from "./AppWrapper.module.css";
import {
  Menu as MenuIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Home as HomeIcon,
  ViewHeadline as ViewHeadlineIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";

import { IAccountSimplified } from "./components/Account";

enum components {
  OVERVIEW,
}

function AppWrapper({
  component = components.OVERVIEW,
}: {
  component: components;
}) {
  let [isLoading, setIsLoading] = useState(true);
  let [userData, setUserData] = useState<IUserData>({
    id: "",
    login: "",
    email: "",
    authorized: false,
  });

  let [simplifiedAccounts, setSimplifiedAccounts] = useState<
    IAccountSimplified[] | null
  >(null);
  let [currentAccount, setCurrentAccount] = useState<IAccountSimplified | null>(
    null
  );

  let [isMobileDrawerOpened, setIsMobileDrawerOpened] = useState(false);
  let [accountsMenuAnchor, setAccountsMenuAnchor] = useState(null);

  const auth = async (): Promise<boolean> => {
    let authData: IUserData = await authorize();
    setUserData(authData);
    return authData.authorized;
  };

  const calculateTotalAccountsValue = (): number => {
    return (
      simplifiedAccounts
        ?.map((e) => e.value)
        .reduce((prev: number, curr: number) => prev + curr) || 0
    );
  };

  const handleToggleMobileDrawer = (): void => {
    setIsMobileDrawerOpened(!isMobileDrawerOpened);
  };

  const handleAccountsSelectionToogle = (e: any): void => {
    setAccountsMenuAnchor(e.currentTarget);
  };

  const handleAccountSelectionClick = (id: string | null): void => {
    if (id === null) {
      setCurrentAccount(null);
    } else {
      let newCurrentAccount =
        simplifiedAccounts?.find((e) => e.id === id) || null;
      setCurrentAccount(newCurrentAccount);
    }
    setAccountsMenuAnchor(null);
  };

  const handleAccountsMenuClose = (): void => {
    setAccountsMenuAnchor(null);
  };

  const handleCreateNewAccountClick = (): void => {
    //TODO: Redirect to the create new account page
    //DEV
    console.log("DEV: CREATE/ACCOUNT");
    setAccountsMenuAnchor(null);
  };

  const handleLogOut = async (): Promise<void> => {
    let logOutStatus: { error: boolean } = await logOut();
    if (!logOutStatus.error) {
      //TODO: Make the "You've been successfully logged out" page
      window.location.href = "/";
    }
  };

  useEffect(() => {
    setTitle("");
    auth().then((authorized) => {
      if (authorized) {
        //TODO: Fetch the simplified accounts
        //DEV
        setSimplifiedAccounts([
          {
            id: "13b7c6a4-b503-42a6-970b-2fc07235e9d9",
            name:
              "Przykładowe konto nr 1 - długi tekst, aby sprawdzić, czy wszystko dostosowywuje się do ekranu",
            color: "#eb4034",
            value: 12345,
          },
          {
            id: "05fa3eef-03ea-4704-bcd2-a74fc085e7b0",
            name: "Przykładowe konto nr 2",
            color: "#4287f5",
            value: 54321,
          },
          {
            id: "8d49af67-764c-4b56-810c-afd893672e7b",
            name: "Przykładowe konto nr 3",
            color: "#32a852",
            value: 5840,
          },
          {
            id: "b765351e-7274-4a45-89c7-5463ee8cd68d",
            name: "Przykładowe konto nr 4",
            color: "#fcba03",
            value: 0,
          },
        ]);

        setIsLoading(false);
      }
    });
  }, []);

  const drawerContent: ReactElement = (
    <div className={styles.drawer}>
      <div>
        <Divider />
        <List>
          <ListItem button onClick={handleAccountsSelectionToogle}>
            <ListItemText
              primary="Konto"
              secondary={currentAccount?.name || "Wybierz konto"}
              classes={{ secondary: styles.accountsSelectionText }}
            ></ListItemText>
          </ListItem>
        </List>
        <Menu
          anchorEl={accountsMenuAnchor}
          keepMounted
          open={Boolean(accountsMenuAnchor)}
          onClose={handleAccountsMenuClose}
        >
          <MenuItem
            key="allAccounts"
            selected={currentAccount === null}
            onClick={() => handleAccountSelectionClick(null)}
          >
            Wybierz konto
          </MenuItem>
          <Divider />
          {simplifiedAccounts?.map(
            (elem: IAccountSimplified): ReactElement => {
              return (
                <MenuItem
                  className={styles.accountsMenuItem}
                  key={elem.id}
                  selected={elem.id === currentAccount?.id}
                  onClick={() => handleAccountSelectionClick(elem.id)}
                >
                  <div className={styles.accountsMenuItemTextWrapper}>
                    <div
                      className={styles.accountsMenuColorCircle}
                      style={{ backgroundColor: elem.color || "#03a9f4" }}
                    ></div>
                    <span className={styles.accountsMenuItemText}>
                      {elem.name}
                    </span>
                  </div>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      //TODO: Handle edit
                      //DEV
                      console.log(`DEV: EDIT/ACCOUNT/${elem.id}/${elem.name}`);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <EditIcon />
                  </IconButton>
                </MenuItem>
              );
            }
          )}
          <Divider />
          <MenuItem
            key="createNewAccount"
            onClick={() => handleCreateNewAccountClick()}
          >
            <AddIcon className={styles.addIcon} />
            <span className={styles.accountsMenuItemText}>Nowe konto</span>
          </MenuItem>
        </Menu>
        <Divider />
        <List>
          <ListItem button key="overviewLink">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>Podsumowanie</ListItemText>
          </ListItem>
          <ListItem button key="recordsLink">
            <ListItemIcon>
              <ViewHeadlineIcon />
            </ListItemIcon>
            <ListItemText>Wpisy</ListItemText>
          </ListItem>
        </List>
      </div>
      <div>
        <Divider />
        <div className={styles.drawerAccountInfoWrapper}>
          <span className={styles.drawerAccountLogin}>{userData.login}</span>
          <IconButton>
            <SettingsIcon />
          </IconButton>
        </div>
        <Button variant="text" color="primary" fullWidth onClick={handleLogOut}>
          Wyloguj się
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <div className={styles.container}>
        <nav className={styles.drawerWrapper}>
          <Box display={{ xs: "none", md: "flex" }}>
            <Drawer variant="permanent" open>
              {drawerContent}
            </Drawer>
          </Box>
          <Box display={{ xs: "flex", md: "none" }}>
            <Drawer
              variant="temporary"
              open={isMobileDrawerOpened}
              onClose={handleToggleMobileDrawer}
            >
              {drawerContent}
            </Drawer>
          </Box>
        </nav>
        <div className={styles.content}>
          <AppBar
            className={styles.appBar}
            style={{ backgroundColor: currentAccount?.color || "#03a9f4" }}
            position="fixed"
          >
            <Box display={{ xs: "flex", md: "none" }}>
              <IconButton onClick={handleToggleMobileDrawer}>
                <MenuIcon className={styles.appBarIcon} />
              </IconButton>
            </Box>
            <div className={styles.accountDetails}>
              <span className={styles.accountName}>
                {currentAccount?.name || "Wszystkie konta"}
              </span>
              <span className={styles.accountValue}>
                {valueToString(
                  currentAccount
                    ? currentAccount.value
                    : calculateTotalAccountsValue()
                )}
              </span>
            </div>
          </AppBar>
        </div>
      </div>
    );
  }
}
export default AppWrapper;
export { components };
