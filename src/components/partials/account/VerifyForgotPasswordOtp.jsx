import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Form, notification } from "antd";
import { connect } from "react-redux";
import API from "../../../api/api";
import { languageLable } from "utilities/helpers";

var api;
class VerifyForgotPasswordOtp extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {};
  }

  static getDerivedStateFromProps(props) {
    if (props.isLoggedIn === true) {
      props.history.push("/");
    }
    return false;
  }

  handleLoginSubmit = (values) => {
    const { selectedLanguageData } = this.props.app;

    if (this.props.auth && this.props.auth.resetPasswordRequestData) {
      let payload = {
        isdCode: this.props.auth.resetPasswordRequestData.isdCode,
        mobile: this.props.auth.resetPasswordRequestData.mobile,
        email: this.props.auth.resetPasswordRequestData.email,
        code: values.code,
      };

      api
        .post("ValidateForgotPasswordOtp", {
          data: payload,
        })
        .then((response) => {
          if (response.StatusCode === 200 && response.Result) {
            if (response.Result.Token) {
              // Set the token to RESET_PASSWORD_REQUEST
              payload.token = response.Result.Token;
              this.props.dispatch({
                type: "RESET_PASSWORD_REQUEST",
                resetPasswordRequestData: payload,
              });
            }
            this.props.history.push("/account/reset-password");
          } else {
            notification.info({
              message: "info",
              description: languageLable(
                selectedLanguageData,response.StatusMessage),
            });
          }
        });
    } else {
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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
                  {languageLable(selectedLanguageData, "Verify OTP")}
                </Link>
              </li>
            </ul>
            <div className="ps-tab active" id="sign-in">
              <div className="ps-form__content">
                <h5>
                  {languageLable(
                    selectedLanguageData,
                    "Enter six digit verification code sent on mobile number and email id"
                  )}
                </h5>
                <div className="form-group">
                  <div className="form-group">
                    <Form.Item
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: languageLable(
                            selectedLanguageData,
                            "Please enter otp code."
                          ),
                        },
                      ]}
                    >
                      <input
                        id="code"
                        className="form-control"
                        name="code"
                        type="text"
                        placeholder={languageLable(selectedLanguageData, "OTP")}
                      ></input>
                    </Form.Item>
                  </div>
                </div>
                <div className="form-group submit">
                  <button type="submit" className="ps-btn ps-btn--fullwidth">
                    {languageLable(selectedLanguageData, "Verify")}
                  </button>
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

export default connect(mapStateToProps)(withRouter(VerifyForgotPasswordOtp));
