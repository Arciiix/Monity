import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//Components
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

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
      </Switch>
    </Router>
  );
}

export default App;
