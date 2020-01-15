import React, { Component } from "react";
import "./form.css";

let JWT = null;

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };
  handlePasswordChange = event => {
    this.setState({ password: event.target.value });
  };

  handleRegister = event => {
    event.preventDefault();

    const { email, password } = this.state;

    // REGISTER FETCH
    fetch("https://cab230.hackhouse.sh/register", {
      method: "POST",
      body: `email=${email}&password=${password}`,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok");
      })
      .then(function() {
        let appDiv = document.getElementById("queryText");
        appDiv.innerHTML = "You have signed up successfull! \n Please log in.";
      })

      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: ",
          error.message
        );
        let appDiv = document.getElementById("queryText");
        appDiv.innerHTML = "Email is invalid or already in use";
      });
  };

  handleLogin = event => {
    event.preventDefault();
    const { email, password } = this.state;

    //LOGIN FETCH
    fetch("https://cab230.hackhouse.sh/login", {
      method: "POST",
      body: `email=${email}&password=${password}`,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok");
      })
      .then(function(result) {
        let appDiv = document.getElementById("queryText");
        JWT = result.token;
        appDiv.innerHTML = "You have logged in successfully";

        console.log(JWT);
      })

      .catch(function(error) {
        console.log(
          "There has been a problem with your fetch operation: ",
          error.message
        );
        let appDiv = document.getElementById("queryText");
        appDiv.innerHTML = "Email or password is incorrect";
      });
  };

  render() {
    return (
      <form className="form">
        <label>
          <input
            autocomplete="off"
            required
            type="text"
            name="email"
            className="Email"
            placeholder={"Email"}
            value={this.state.email}
            onChange={this.handleEmailChange}
          />
        </label>
        <label>
          <input
            required
            type="password"
            name="password"
            className="Password"
            placeholder={"Password"}
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
        </label>
        <button className="register" onClick={this.handleRegister}>
          Register
        </button>

        <button className="login" onClick={this.handleLogin}>
          Login
        </button>

        {/* <button
        onClick={function(e) {
          let JWT = null;
        }}
        id="LogBtn"
      >
        Log Out
      </button> */}
      </form>
    );
  }
}
export { JWT };
export default Form;
