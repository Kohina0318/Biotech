import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Form, notification, Input } from "antd";
import { connect } from "react-redux";
import { parseJwt } from "../../../utilities/helpers";
import API from "../../../api/api";
import { languageLable } from "utilities/helpers";

var api;
class Login extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {};
  }

  componentDidMount = () => {
    if (this.props.auth && this.props.auth.isLoggedIn) {
      this.props.history.push("/");
    }
  };

  handleFeatureWillUpdate(e) {

    const { selectedLanguageData } = this.props.app;

    e.preventDefault();
    notification.open({
      message: languageLable(selectedLanguageData, "Opp! Something went wrong."),
      description: languageLable(selectedLanguageData, "This feature has been updated later!"),
      duration: 500,
    });
  }

  handleLoginSubmit = (values) => {
    const { selectedLanguageData } = this.props.app;

    api
      .post("LoginPlus", {
        data: {
          email: values.email,
          password: values.password,
        },
      })
      .then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("authToken", response.Result.Token);
          const tokenData = parseJwt(response.Result.Token);
          localStorage.setItem("userData", JSON.stringify(tokenData));

          // SET DATA TO REDUX
          this.props.dispatch({
            type: "LOGIN_USER",
            authToken: response.Result.Token,
            userData: tokenData,
          });

          this.props.history.push("/");
        } else {
          notification.info({
            message: "info",
            description: languageLable(
              selectedLanguageData, response.StatusMessage),
          });
        }
      });
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  myFunction = () => {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }


  render() {
    const { selectedLanguageData } = this.props.app;

    return (
      <div className="ps-my-account">
        <div className="container">
          <Form
            className="ps-form--account"
            onFinish={(values) => this.handleLoginSubmit(values)}
            onFinishFailed={() => this.onFinishFailed()}
          >
            <ul className="ps-tab-list">
              <li className="active">
                <Link to="/account/login">
                  {languageLable(selectedLanguageData, "Login")}
                </Link>
              </li>
              <li>
                <Link to="/account/register">
                  {languageLable(selectedLanguageData, "Register")}
                </Link>
              </li>
            </ul>
            <div className="ps-tab active" id="sign-in">
              <div className="ps-form__content">
                <h5>
                  {languageLable(
                    selectedLanguageData,
                    `Login with Email and Password`
                  )}
                </h5>
                <div className="form-group">
                  <div className="form-group">
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          type: "email",
                          required: true,
                          message: languageLable(
                            selectedLanguageData,
                            "Please enter email"
                          ),
                        },
                      ]}
                    >
                      <input
                        id="email"
                        className="form-control"
                        name="email"
                        type="text"
                        placeholder={languageLable(
                          selectedLanguageData,
                          "Email Id*"
                        )}
                      ></input>
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: languageLable(
                            selectedLanguageData,
                            "Please enter password."
                          ),
                        },
                      ]}
                    >
                      {/* <input
                        id="password"
                        className="form-control"
                        name="password"
                        type="password"
                        placeholder={languageLable(
                          selectedLanguageData,
                          "Password*"
                        )}  
                      />  */}
                      <Input.Password
                        id="password"
                        className="form-control"
                        name="password"
                        type="password"
                        placeholder={languageLable(
                          selectedLanguageData,
                          "Password*"
                        )}
                      />
                    </Form.Item>


                  </div>
                </div>
                <div className="form-group submit">
                  <button type="submit" className="ps-btn ps-btn--fullwidth">
                    {languageLable(selectedLanguageData, `Login`)}
                  </button>
                </div>
                <div className="text-container">
                  <Link to="/account/forgot-password">
                    {languageLable(
                      selectedLanguageData,
                      "Forgot Password? Click here."
                    )}
                  </Link>
                </div>
                <div className="text-container terms-container">
                  {languageLable(
                    selectedLanguageData,
                    "By Continuing, you agree to our"
                  )}
                  &nbsp;
                  <Link to="#">
                    {languageLable(selectedLanguageData, "Terms of Use")}
                  </Link>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(withRouter(Login));
