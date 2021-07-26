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
import Overview from "./components/App/Overview/Overview";

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
        <Route path="/app/" exact>
          <Redirect to="/app/overview" />
        </Route>
        <Route path="/app/overview" exact>
          <Overview />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
