import { ReactElement, useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import { authorize, IUserData } from "../Utils/auth";

import {
  Drawer,
  AppBar,
  IconButton,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";

import styles from "./AppWrapper.module.css";
import { Menu as MenuIcon, Edit as EditIcon } from "@material-ui/icons";

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

  const handleAccountsMenuClose = () => {
    setAccountsMenuAnchor(null);
  };

  useEffect(() => {
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
            value: 2133,
          },
        ]);

        setIsLoading(false);
      }
    });
  }, []);

  const drawerContent: ReactElement = (
    <div className={styles.drawer}>
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
        {simplifiedAccounts?.map(
          (elem: IAccountSimplified): ReactElement => {
            return (
              <MenuItem
                className={styles.accountsMenuItem}
                key={elem.id}
                selected={elem.id === currentAccount?.id}
                onClick={() => handleAccountSelectionClick(elem.id)}
              >
                <span className={styles.accountsMenuItemText}>{elem.name}</span>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    //TODO: Handle edit
                    //DEV
                    console.log(`DEV: EDIT/${elem.id}/${elem.name}`);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </MenuItem>
            );
          }
        )}
      </Menu>
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
          <AppBar className={styles.appBar} position="fixed">
            <Box display={{ xs: "flex", md: "none" }}>
              <IconButton onClick={handleToggleMobileDrawer}>
                <MenuIcon className={styles.appBarIcon} />
              </IconButton>
            </Box>
            <div className={styles.accountDetails}>
              <span className={styles.accountName}>Nazwa konta</span>
              <span className={styles.accountValue}>999,99 zł</span>
            </div>
          </AppBar>
        </div>
      </div>
    );
  }
}
export default AppWrapper;
export { components };
