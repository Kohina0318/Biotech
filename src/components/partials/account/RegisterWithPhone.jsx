import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Form, Input, notification, Select } from "antd";
import { connect } from "react-redux";
import API from "../../../api/api";

var api;
const { Option } = Select;
class Register extends Component {
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
    let payload = {
      isdCode: values.isdCode,
      mobile: values.mobile,
      email: values.email,
      name: values.first_name + " " + values.last_name,
    };

    api
      .post("Register", {
        data: payload,
      })
      .then((response) => {
        if (response.StatusCode === 200) {
          // SET DATA TO REDUX
          this.props.dispatch({
            type: "REGISTER_REQEUST",
            registerRequestData: payload,
          });

          localStorage.setItem("registerRequestData", JSON.stringify(payload));

          // SET DATA TO REDUX
          notification.success({
            message: "Success",
            description: response.Message,
          });
          this.props.history.push("/account/verify-otp");
        } else {
          notification.info({
            message: "info",
            description: response.Message,
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
            onFinish={(values) => this.handleSubmit(values)}
            onFinishFailed={() => this.onFinishFailed()}
            initialValues={{
              isdCode: "+91",
            }}
          >
            <ul className="ps-tab-list">
              <li>
                <Link to="/account/login">Login</Link>
              </li>
              <li className="active">
                <Link to="/account/register">Register</Link>
              </li>
            </ul>
            <div className="ps-tab active" id="register">
              <div className="ps-form__content">
                <div className="form-group">
                  <Form.Item
                    name="first_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter first name.",
                      },
                    ]}
                  >
                    <input
                      id="first_name"
                      className="form-control"
                      name="first_name"
                      type="text"
                      placeholder="First name*"
                    ></input>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    name="last_name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter last name.",
                      },
                    ]}
                  >
                    <input
                      id="last_name"
                      className="form-control"
                      name="last_name"
                      type="text"
                      placeholder="Last name*"
                    ></input>
                  </Form.Item>
                </div>
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
                <div className="form-group form-forgot">
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        type: "email",
                        required: true,
                        message: "Please enter email",
                      },
                    ]}
                  >
                    <input
                      id="email"
                      className="form-control"
                      name="email"
                      type="email"
                      placeholder="Email Id*"
                    ></input>
                  </Form.Item>
                </div>
                <div className="form-group submit">
                  <button type="submit" className="ps-btn ps-btn--fullwidth">
                    Register
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

export default connect(mapStateToProps, null)(withRouter(Register));
