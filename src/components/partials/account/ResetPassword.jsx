import React, { Component } from "react";
import { Link, withRouter, } from "react-router-dom";
import { Form, notification,Input } from "antd";
import { connect } from "react-redux";
import API from "../../../api/api";
import { validatePassword } from "./../../../utilities/helpers";
import { languageLable } from "utilities/helpers";

var api;
class ResetPassword extends Component {
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
    if (
      this.props.auth &&
      this.props.auth.resetPasswordRequestData &&
      this.props.auth.resetPasswordRequestData.token
    ) { 

      let passwordErros = validatePassword(values.password);
      if (passwordErros.length > 0) {
        notification.info({
          message: "Info",
          description: languageLable(
            selectedLanguageData,
            passwordErros.join("\n")
          ),
        });
      } else {

        let payload = {
          isdCode: this.props.auth.resetPasswordRequestData.isdCode,
          mobile: this.props.auth.resetPasswordRequestData.mobile,
          email: this.props.auth.resetPasswordRequestData.email,
          token: this.props.auth.resetPasswordRequestData.token,
          password: values.password,
          confirmPassword: values.cpassword,
        };

        api
          .post("ResetPassword", {
            data: payload,
          })
          .then((response) => {
            
            if (response.StatusCode === 200) {
              this.props.history.push("/account/login");

              notification.success({
                message: "Success",
                description: languageLable(
                  selectedLanguageData,
                  response.Message
                ),
              });
            } else {
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
            onFinish={(values) => this.handleSubmit(values)}
            onFinishFailed={() => this.onFinishFailed()}
            initialValues={{
              isdCode: "+91",
            }}
          >
            <ul className="ps-tab-list">
              <li className="active">
                <Link to="/account/register">
                  {languageLable(selectedLanguageData, "Reset Password")}
                </Link>
              </li>
            </ul>
            <div className="ps-tab active" id="register">
              <div className="ps-form__content">
                <h5>{languageLable(selectedLanguageData, "Reset Password")}</h5>
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
                    hasFeedback
                  >
                    {/* <input
                      id="password"
                      className="form-control"
                      name="password"
                      type="password"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Password"
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
                        "Confirm Password"
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
                    {languageLable(selectedLanguageData, "Save")}
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

export default connect(mapStateToProps, null)(withRouter(ResetPassword));
