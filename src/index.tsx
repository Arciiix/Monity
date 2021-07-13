import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  createTheme,
  ThemeProvider,
  StylesProvider,
} from "@material-ui/core/styles";
import { lightBlue } from "@material-ui/core/colors";

const theme = createTheme({
  palette: {
    type: "dark",
    primary: lightBlue,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <Provider store={store}>
          <CssBaseline />
          <App />
        </Provider>
      </StylesProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

//TODO:
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
