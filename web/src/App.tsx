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
import { Home, Settings } from "@mui/icons-material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const routerMapping = {
  "/app/summary": "summary",
  "/app/settings": "settings",
  default: null,
};
const routes: IRoute[] = [
  {
    name: "summary",
    displayName: "Summary",
    icon: <Home />,
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
