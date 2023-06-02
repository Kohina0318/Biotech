import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Form, Input, notification, Select, Divider } from "antd";
import { connect } from "react-redux";
import API from "../../../api/api";
import { languageLable } from "utilities/helpers";
import "antd/dist/antd.css";

var api;
const { Option } = Select;


class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      object: "",
    };
  }

  static getDerivedStateFromProps(props) {
    if (props.auth && props.auth.isLoggedIn) {
      props.history.push("/");
    }
    return false;
  }

  handleSubmit = (values) => {
    const { selectedLanguageData } = this.props.app;

    let payload = {
      isdCode: values.mobile && values.isdCode,
      mobile: values.mobile,
      email: values.email,
    };
    let payload1 = {
      email: values.email,
      isdCode: values.isdCode,
      mobile: 0
    };
    if (values.isdCode && values.mobile) {
      api
        .post("ForgotPassword", {
          data: payload,
        })
        .then((response) => {
          if (response.StatusCode === 200) {
            notification.success({
              message: "Success",
              description: languageLable(
                selectedLanguageData,
                response.Message
              ),
            });
            this.props.dispatch({
              type: "RESET_PASSWORD_REQUEST",
              resetPasswordRequestData: payload,
            });
            this.props.history.push("/account/verify-forgot-password-otp");
          }
          else {
            notification.info({
              message: "info",
              description: languageLable(
                selectedLanguageData,
                response.Message
              ),
            });
          }
        });
    }
    else if (values.email) {
      api
        .post("ForgotPassword", {
          data: payload1,
        })
        .then((response) => {
          if (response.StatusCode === 200) {
            notification.success({
              message: "Success",
              description: languageLable(
                selectedLanguageData,
                response.Message
              ),
            });
            this.props.dispatch({
              type: "RESET_PASSWORD_REQUEST",
              resetPasswordRequestData: payload1,
            });
            this.props.history.push("/account/verify-forgot-password-otp");
          }
          else {
            notification.info({
              message: "info",
              description: languageLable(
                selectedLanguageData,
                response.Message
              ),
            });
          }
        });
    }
    else {
      notification.info({
        message: "info",
        description: languageLable(
          selectedLanguageData,
          "Please enter Mobile or Email."
        ),
      });
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  

  render() {
    //  alert(JSON.stringify(this.props.auth &&
    //   this.props.auth.countries))
   
    const isdCodeSelector = (
      <Form.Item name="isdCode" noStyle>
        <Select
          style={{
            width: 170,
          }}
          showSearch
          optionFilterProp="children"
          // filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          // autoComplete="none"
        >
          {this.props.auth &&
            this.props.auth.countries.map((item) => (
              <Option value={item.phone_code}>{item.phone_code} - {item.name}</Option>
            ))}
        </Select>
      </Form.Item>
    );

    return (
      <div className="ps-my-account">
        <div className="container">
          <Form
            className="ps-form--account"
            onFinish={(values) => this.handleSubmit(values)}
            onFinishFailed={() => this.onFinishFailed()}
            initialValues={{
              isdCode: "91 - India",
            }}
          >
            <ul className="ps-tab-list">
              <li className="active">
                <Link to="/account/forgot-password">Reset Password</Link>
              </li>
            </ul>
            <div className="ps-tab active" id="register">
              <div className="ps-form__content">
                <div className="form-group form-forgot">
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "Please enter email",
                      },
                    ]}
                  >
                    <input
                      id="email"
                      className="form-control"
                      name="email"
                      type="email"
                      placeholder="Enter your email*"
                    ></input>
                  </Form.Item>
                </div>
                <Divider>OR</Divider>
                <div className="form-group">
                  <Form.Item
                    name="mobile"
                    rules={[
                      {
                        message: "Please enter mobile number.",
                      },
                    ]}
                  >
                    <Input
                      addonBefore={isdCodeSelector}
                      id="mobile"
                      name="mobile"
                      placeholder="Mobile*"
                      type="text"
                    />
                  </Form.Item>
                </div>
                <div className="form-group submit">
                  <button type="submit" className="ps-btn ps-btn--fullwidth">
                    Reset Password
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

export default connect(mapStateToProps, null)(withRouter(ForgotPassword));
