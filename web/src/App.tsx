import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import userState from "./components/auth/atoms/user.atom";
import LoginPage from "./components/auth/Login/LoginPage";
import RegisterPage from "./components/auth/Register/RegisterPage";
import NoAuthentication from "./components/auth/routerUtils/NoAuthentication";
import RequireAuth from "./components/auth/routerUtils/RequireAuth";
import Dashboard from "./components/dashboard/Dashboard";
import InfoDialog from "./components/InfoDialog/InfoDialog";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <RecoilRoot>
          <CssBaseline />
          <InfoDialog />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/app" />} />
              <Route path="auth" element={<NoAuthentication />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>
              <Route path="app" element={<RequireAuth />}>
                <Route path="" element={<Dashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
}

export default App;
