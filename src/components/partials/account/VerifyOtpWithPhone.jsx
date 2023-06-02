import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { parseJwt } from "../../../utilities/helpers";
import { Form, notification } from "antd";
import { connect } from "react-redux";
import API from "../../../api/api";

var api;
class VerifyOtp extends Component {
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

  handleFeatureWillUpdate(e) {
    e.preventDefault();
    notification.open({
      message: "Opp! Something went wrong.",
      description: "This feature has been updated later!",
      duration: 500,
    });
  }

  handleLoginSubmit = (values) => {
    console.log(
      "🚀 ~ file: VerifyOtpWithPhone.jsx ~ line 34 ~ VerifyOtp ~ this.props.auth",
      this.props.auth
    );
    if (this.props.auth.registerRequestData) {
      let payload = {
        isdCode: this.props.auth.registerRequestData.isdCode,
        mobile: this.props.auth.registerRequestData.mobile,
        code: values.code,
      };

      api
        .post("Validate", {
          data: payload,
        })
        .then((response) => {
          if (response.StatusCode === 200 && response.Result) {
            // Remove register details
            localStorage.removeItem("registerRequestData");

            localStorage.setItem("authToken", response.Result.Token);
            const tokenData = parseJwt(response.Result.Token);
            localStorage.setItem("userData", JSON.stringify(tokenData));
            localStorage.setItem("isLoggedIn", true);

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
              description: response.StatusMessage,
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
                <Link to="/account/login">Verify OTP</Link>
              </li>
            </ul>
            <div className="ps-tab active" id="sign-in">
              <div className="ps-form__content">
                <h5>We have sent you an OTP on Mobile and Email.</h5>
                <div className="form-group">
                  <div className="form-group">
                    <Form.Item
                      name="code"
                      rules={[
                        {
                          required: true,
                          message: "Please enter otp code.",
                        },
                      ]}
                    >
                      <input
                        id="code"
                        className="form-control"
                        name="code"
                        type="text"
                        placeholder="OTP"
                      ></input>
                    </Form.Item>
                  </div>
                </div>
                <div className="form-group submit">
                  <button type="submit" className="ps-btn ps-btn--fullwidth">
                    Verify
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

export default connect(mapStateToProps)(withRouter(VerifyOtp));
