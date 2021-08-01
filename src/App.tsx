import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

//Components
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Account/Login/Login";
import Register from "./components/Account/Register/Register";
import AppWrapper, { components } from "./components/App/AppWrapper";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/register" exact>
          <Register />
        </Route>

        <Route path="/app/overview" exact>
          <AppWrapper component={components.OVERVIEW} />
        </Route>
        <Route path="/app/account/add" exact>
          <AppWrapper component={components.ADD_ACCOUNT} />
        </Route>
        <Route path="/app/">
          <Redirect to="/app/overview" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
