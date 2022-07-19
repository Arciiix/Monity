import {
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import userState from "./atoms/user/user.atom";
import LoginPage from "./components/auth/Login/LoginPage";
import RegisterPage from "./components/auth/Register/RegisterPage";
import NoAuthentication from "./components/auth/routerUtils/NoAuthentication";
import RequireAuth from "./components/auth/routerUtils/RequireAuth";
import Dashboard from "./components/Dashboard/Dashboard";
import InfoDialog from "./components/Dialogs/InfoDialog/InfoDialog";
import ConfirmationDialogProvider from "./context/ConfirmationDialogContext";

import "react-toastify/dist/ReactToastify.css";
import Summary from "./components/Summary/Summary";
import IRoute from "./types/routing/route.interface";
import {
  AccountBalanceWallet,
  Home,
  Menu,
  PermContactCalendar,
  Person,
  Settings,
} from "@mui/icons-material";
import ManageAccounts from "./components/manage/ManageAccounts/ManageAccounts";
import AccountForm from "./components/Account/AccountForm/AccountForm";
import ManagePeople from "./components/manage/ManagePeople/ManagePeople";
import PersonForm from "./components/Person/PersonForm/PersonForm";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

//Remember to provide the global route (ie. "/app/...")
const routerMapping = {
  "/app/summary": "summary",
  "/app/settings": "settings",
  "/app/manage/accounts": "manage/accounts",
  "/app/manage/accounts/add": "manage/accounts",
  "/app/manage/accounts/edit/:id": "manage/accounts",
  "/app/manage/people": "manage/people",
  "/app/manage/people/add": "manage/people",
  "/app/manage/people/edit/:id": "manage/people",
  default: null,
};
const routes: IRoute[] = [
  {
    name: "summary",
    displayName: "Summary",
    icon: <Home />,
  },
  {
    name: "manage",
    displayName: "Manage",
    icon: <Menu />,
    subroutes: [
      {
        name: "manage/accounts",
        displayName: "Accounts",
        icon: <AccountBalanceWallet />,
      },
      {
        name: "manage/people",
        displayName: "People",
        icon: <PermContactCalendar />,
      },
    ],
  },
  {
    name: "settings",
    displayName: "Settings",
    icon: <Settings />,
  },
];

function App() {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={darkTheme}>
          <RecoilRoot>
            <CssBaseline />
            <InfoDialog />
            <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              toastStyle={{
                backgroundColor: "#333333",
                color: "#ffffff",
              }}
            />
            <ConfirmationDialogProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Navigate to="/app" />} />
                  <Route path="auth" element={<NoAuthentication />}>
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                  </Route>
                  <Route path="app" element={<RequireAuth />}>
                    <Route path="" element={<Dashboard />}>
                      <Route path="" element={<Navigate to="summary" />} />
                      <Route path="summary" element={<Summary />} />
                      <Route path="manage">
                        <Route path="accounts" element={<ManageAccounts />} />
                        <Route path="accounts/add" element={<AccountForm />} />
                        <Route
                          path="accounts/edit/:id"
                          element={<AccountForm />}
                        />

                        <Route path="people" element={<ManagePeople />} />
                        <Route path="people/add" element={<PersonForm />} />
                        <Route
                          path="people/edit/:id"
                          element={<PersonForm />}
                        />
                      </Route>
                    </Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </ConfirmationDialogProvider>
          </RecoilRoot>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
}

export { routerMapping, routes };
export default App;
