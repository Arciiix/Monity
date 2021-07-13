import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//Components
import HomePage from "./components/HomePage/HomePage";
import Login from "./components/Login/Login";

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
      </Switch>
    </Router>
  );
}

export default App;
