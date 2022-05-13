import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import LoginPage from "./components/auth/Login/LoginPage";
import RegisterPage from "./components/auth/Register/RegisterPage";
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
              <Route path="/" element={<Navigate to="/auth/login" />} />
              <Route path="auth">
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RecoilRoot>
      </ThemeProvider>
    </>
  );
}

export default App;
