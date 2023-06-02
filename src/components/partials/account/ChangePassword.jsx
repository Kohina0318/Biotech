import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Form, Input, notification } from "antd";
import AccountLinks from "./AccountLinks";
import API from "api/api";
import { validatePassword } from "utilities/helpers";
import { languageLable } from "utilities/helpers";

var api;

class ChangePassord extends Component {
  constructor(props) {
    super(props);
    api = new API();
  }

  handleSubmit = (values) => {
    const { selectedLanguageData } = this.props.app;

    let passwordErros = validatePassword(values.newPassword);
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
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        newConfirmPassword: values.newConfirmPassword,
      };

      api
        .post("ChangePassword", {
          data: payload,
        })
        .then((response) => {
          if (response.StatusCode === 200) {
            notification.success({
              message: languageLable(
                selectedLanguageData, "Passowrd has been successfully change."),
            });
            this.props.history.push("/");
          } else {
            notification.info({
              message: "info",
              description: languageLable(
                selectedLanguageData,
                response.Message
                  ? response.Message
                  : "Please verify your old password once."
              ),
            });
          }
        });
    }
  };

  render() {
    const initialValues = {};
    const { selectedLanguageData } = this.props.app;

    return (
      <section className="ps-my-account ps-page--account">
        <div className="ps-container">
          <div className="row">
            <AccountLinks page="change-password" />
            <div className="col-lg-8">
              <div className="ps-page__content">
                <Form
                  className="ps-form--account-setting"
                  onFinish={(values) => this.handleSubmit(values)}
                  initialValues={{ ...initialValues }}
                >
                  <div className="ps-form__header">
                    <h3>
                      {languageLable(selectedLanguageData, "Change Password")}
                    </h3>
                  </div>
                  <div className="ps-form__content">
                    <div className="control-label">
                      {languageLable(selectedLanguageData, "Old Password")}
                    </div>
                    <div className="form-group">
                      <Form.Item
                        name="currentPassword"
                        rules={[
                          {
                            required: true,
                            message: languageLable(
                              selectedLanguageData,
                              "Please enter your old password."
                            ),
                          },
                        ]}
                      >
                        {/* <Input
                          name="currentPassword"
                          className="form-control"
                          type="password"
                          placeholder={languageLable(
                            selectedLanguageData,
                            "Old Password"
                          )}
                        /> */}
                        <Input.Password
                        name="currentPassword"
                        className="form-control"
                        type="password"
                        placeholder={languageLable(
                          selectedLanguageData,
                          "Old Password"
                        )}
                      />
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <div className="control-label">
                        {languageLable(selectedLanguageData, "New Password")}
                      </div>
                      <Form.Item
                        name="newPassword"
                        rules={[
                          {
                            required: true,
                            message: languageLable(
                              selectedLanguageData,
                              "Please enter new password."
                            ),
                          },
                        ]}
                      >
                        <Input.Password
                          name="newPassword"
                          className="form-control"
                          type="password"
                          placeholder={languageLable(
                            selectedLanguageData,
                            "New Password"
                          )}
                        />
                      </Form.Item>
                    </div>
                    <div className="control-label">
                      {languageLable(selectedLanguageData, "Confirm Password")}
                    </div>
                    <div className="form-group">
                      <Form.Item
                        name="newConfirmPassword"
                        dependencies={["newPassword"]}
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

                              if (
                                !value ||
                                getFieldValue("newPassword") === value
                              ) {
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
                        <Input.Password
                          name="newConfirmPassword"
                          className="form-control"
                          type="password"
                          placeholder={languageLable(
                            selectedLanguageData,
                            "Confirm Password"
                          )}
                        />
                      </Form.Item>
                    </div>
                    <div className="form-group submit">
                      <button type="submit" className="ps-btn">
                        {languageLable(selectedLanguageData, "Update")}
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(ChangePassord));
