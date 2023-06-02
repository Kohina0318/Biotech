import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Form, notification, Select, Input } from "antd";
import { connect } from "react-redux";
import API from "../../../api/api";
const { Option } = Select;

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
    e.preventDefault();
    notification.open({
      message: "Opp! Something went wrong.",
      description: "This feature has been updated later!",
      duration: 500,
    });
  }

  handleLoginSubmit = (values) => {
    let payload = {
      isdCode: values.isdCode,
      mobile: values.mobile,
    };

    api
      .post("Login", {
        data: payload,
      })
      .then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          // SET DATA TO REDUX
          this.props.dispatch({
            type: "REGISTER_REQEUST",
            registerRequestData: payload,
          });

          // REGISTER AND LOGIN SAME VALIDATE OTP
          localStorage.setItem("registerRequestData", JSON.stringify(payload));

          this.props.history.push("/account/verify-otp");
        } else {
          notification.info({
            message: "info",
            description: response.StatusMessage,
          });
        }
      });
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const isdCodeSelector = (
      <Form.Item name="isdCode" noStyle>
        <Select
          style={{
            width: 70,
          }}
        >
          {this.props.auth &&
            this.props.auth.countries &&
            this.props.auth.countries.map((item) => (
              <Option value={item.phone_code}>{item.phone_code}</Option>
            ))}
        </Select>
      </Form.Item>
    );

    return (
      <div className="ps-my-account">
        <div className="container">
          <Form
            className="ps-form--account"
            onFinish={(values) => this.handleLoginSubmit(values)}
            onFinishFailed={() => this.onFinishFailed()}
            initialValues={{
              isdCode: "+91",
            }}
          >
            <ul className="ps-tab-list">
              <li className="active">
                <Link to="/account/login">Login</Link>
              </li>
              <li>
                <Link to="/account/register">Register</Link>
              </li>
            </ul>
            <div className="ps-tab active" id="sign-in">
              <div className="ps-form__content">
                <h5>Login With Mobile</h5>
                <div className="form-group">
                  <div className="form-group">
                    <div className="form-group">
                      <Form.Item
                        name="mobile"
                        rules={[
                          {
                            required: true,
                            message: "Please enter mobile number.",
                          },
                        ]}
                      >
                        <Input
                          addonBefore={isdCodeSelector}
                          id="mobile"
                          name="mobile"
                          placeholder="Mobile Number*"
                          type="text"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <div className="form-group submit">
                  <button type="submit" className="ps-btn ps-btn--fullwidth">
                    Login
                  </button>
                </div>
                <div className="text-container">
                  <Link to="/account/forgot-password">
                    Forgot Password? Click here.
                  </Link>
                </div>
                <div className="text-container terms-container">
                  By Continuing, you agree to our&nbsp;
                  <Link to="#">Terms of Use</Link>
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
