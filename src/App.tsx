import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

//Components
import HomePage from "./components/HomePage/HomePage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
