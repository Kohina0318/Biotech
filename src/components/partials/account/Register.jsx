import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Form, Input, notification, Select } from "antd";
import { connect } from "react-redux";
import API from "../../../api/api";
import { validatePassword } from "./../../../utilities/helpers";
import { languageLable } from "utilities/helpers";
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
    let passwordErros = validatePassword(values.password);
    const { selectedLanguageData } = this.props.app;

    if (passwordErros.length > 0) {
      notification.info({
        message: "Info",
        description: languageLable(
          selectedLanguageData, passwordErros.join("\n")),
      });
    } else {
      let payload = {
        isdCode: values.isdCode,
        mobile: values.mobile,
        email: values.email,
        name: values.first_name + " " + values.last_name,
        password: values.password,
        confirmPassword: values.cpassword,
      };

      api
        .post("RegisterWithUserDetail", {
          data: payload,
        })
        .then((response) => {
          if (response.StatusCode === 200) {
            // SET DATA TO REDUX
            this.props.dispatch({
              type: "REGISTER_REQEUST",
              registerRequestData: payload,
            });

            localStorage.setItem("registerRequestData", payload);

            // SET DATA TO REDUX
            notification.success({
              message: "Success",
              description: languageLable(selectedLanguageData, response.Message),
            });
            this.props.history.push("/account/verify-otp");

          } else {
            notification.info({
              message: "info",
              description: languageLable(selectedLanguageData, response.Message),
            });
          }
        });
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const { selectedLanguageData } = this.props.app;

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
              <li>
                <Link to="/account/login">
                  {languageLable(selectedLanguageData, "Login")}
                </Link>
              </li>
              <li className="active">
                <Link to="/account/register">
                  {languageLable(selectedLanguageData, "Register")}
                </Link>
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
                        message: languageLable(
                          selectedLanguageData,
                          "Please enter first name."
                        ),
                      },
                    ]}
                  >
                    <input
                      id="first_name"
                      className="form-control"
                      name="first_name"
                      type="text"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "First name*"
                      )}
                    ></input>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    name="last_name"
                    rules={[
                      {
                        required: true,
                        message: languageLable(
                          selectedLanguageData,
                          "Please enter last name."
                        ),
                      },
                    ]}
                  >
                    <input
                      id="last_name"
                      className="form-control"
                      name="last_name"
                      type="text"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Last name*"
                      )}
                    ></input>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    name="mobile"
                    rules={[
                      {
                        required: true,
                        message: languageLable(
                          selectedLanguageData,
                          "Please enter mobile number."
                        ),
                      },
                    ]}
                  >
                    <Input
                      addonBefore={isdCodeSelector}
                      id="mobile"
                      name="mobile"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Mobile Number*"
                      )}
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
                      type="email"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Email Id*"
                      )}
                    ></input>
                  </Form.Item>
                </div>
                <div className="form-group">
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
                    ></input> */}
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
                  <span className="password-helper">
                    {languageLable(
                      selectedLanguageData,
                      "Your password length should be 6 to 20 characters & must contain 1-Uppercase, Lowercase, Numeric and Special Character"
                    )}
                  </span>
                </div>
                <div className="form-group">
                  <Form.Item
                    name="cpassword"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: languageLable(
                          selectedLanguageData,
                          "Please enter confirm password."
                        ),
                      },

                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          let passwordErros = validatePassword(value);
                          if (passwordErros.length > 0) {
                            return Promise.reject(passwordErros.join("\n"));
                          }

                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            languageLable(
                              selectedLanguageData,
                              "The passwords and confirm password does not match."
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    {/* <input
                      id="cpassword"
                      className="form-control"
                      name="cpassword"
                      type="password"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Confirm Password*"
                      )}
                    ></input> */}
                    <Input.Password
                      id="cpassword"
                      className="form-control"
                      name="cpassword"
                      type="password"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Confirm Password*"
                      )}
                    />
                  </Form.Item>
                </div>

                <div className="form-group submit">
                  <button type="submit" className="ps-btn ps-btn--fullwidth">
                    {languageLable(selectedLanguageData, "Register")}
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
