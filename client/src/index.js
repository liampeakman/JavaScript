import React from "react";
import ReactDOM from "react-dom";
import Form from "./components/form";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Offences from "./components/offences";

import "./styles.css";

const RegisterPage = () => (
  <div className="container">
    <h1>Queensland Crime Statistics</h1>
    <div className="box">
      <div id="Register">
        <Form />
      </div>
      <div className="query">
        <p id="queryText" />
      </div>
    </div>
  </div>
);

const OffencesPage = () => (
  <div className="container">
    <div id="Offences">
      <Offences />
    </div>
  </div>
);

const NavBar = () => (
  <div className="navbar">
    <Link exact to="/">
      <button id="HomeBtn">Home</button>
    </Link>{" "}
    <Link exact to="/OffencesPage">
      <button id="OffencesBtn">Offences</button>
    </Link>{" "}
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />

        <Route path="/" exact component={RegisterPage} />

        <Route path="/OffencesPage" exact component={OffencesPage} />
      </div>
    </Router>
  );
}

export { OffencesPage };
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
