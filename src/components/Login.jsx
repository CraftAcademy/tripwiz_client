import React from "react";
import auth from "../modules/auth";
import { connect } from "react-redux";

const Login = props => {
  const onLogin = event => {
    event.preventDefault();
    auth
      .signIn(event.target.email.value, event.target.password.value)
      .then(userDatas => {
        props.changeAuth(true);
        props.setUserAttrs(userDatas.data);
        props.changeAuthMessage(`${('login.loggedInMess')} ${userDatas.data.email}`);
      })
      .catch(error => {
        props.changeAuthMessage(error.response.data.errors);
      });
  };
  

  return (
    <form id="login-form" onSubmit={onLogin}>
      <label>Email</label>
      <input name="email" type="email" id="email"></input>

      <label>Password</label>
      <input name="password" type="password" id="password"></input>

      <button id="submit" >Submit</button>
    </form>
  );
};
  const mapStateToProps = state => ({
    authenticated: state.authenticated,
    userAttrs: state.userAttrs,
    authMessage: state.authMessage,
    displaySignupButton: state.displaySignupButton,
    displayLoginButton: state.displayLoginButton
  });
  const mapDispatchToProps = dispatch => {
    return {
      changeAuth: auth => {
        dispatch({ type: "CHANGE_AUTHENTICATED", payload: auth });
      },
      changeAuthMessage: message => {
        dispatch({ type: "CHANGE_AUTHMESSAGE", payload: message });
      },
      changeLoginButton: value => {
        dispatch({ type: "CHANGE_LOGINBUTTON", payload: value });
      },
      changeSignupButton: value => {
        dispatch({ type: "CHANGE_SIGNUPBUTTON", payload: value });
      },
      setUserAttrs: userAttrs => {
        dispatch({ type: "CHANGE_USER_ATTRIBUTES", payload: userAttrs });
      }
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(Login);