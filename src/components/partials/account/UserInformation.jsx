import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Form, Input } from "antd";
import AccountLinks from "./AccountLinks";
import { languageLable } from "utilities/helpers";

class UserInformation extends Component {
  render() {
    const initialValues = {};
    if (this.props && this.props.auth && this.props.auth.userData) {
      initialValues.name = this.props.auth.userData.name;
      initialValues.email = this.props.auth.userData.email;
      initialValues.mobile = this.props.auth.userData.mobile;
    }
    const { selectedLanguageData } = this.props.app;

    return (
      <section className="ps-my-account ps-page--account">
        <div className="ps-container">
          <div className="row">
            <AccountLinks page="user-information" />
            <div className="col-lg-8">
              <div className="ps-form--account-setting ps-form--user-info">
                <div className="ps-form__header">
                  <h3>
                    {languageLable(selectedLanguageData, "Account Information")}
                  </h3>
                </div>
                <div className="ps-form__content">
                  <figcaption>
                    <div className="field-title">
                      {languageLable(selectedLanguageData, "Name")}:
                    </div>
                    <div className="field-value">{initialValues.name}</div>
                  </figcaption>
                  <figcaption>
                    <div className="field-title">
                      {languageLable(selectedLanguageData, "Email")}:
                    </div>
                    <div className="field-value">{initialValues.email}</div>
                  </figcaption>
                  <figcaption>
                    <div className="field-title">
                      {languageLable(selectedLanguageData, "Mobile")}:
                    </div>
                    <div className="field-value">{initialValues.mobile}</div>
                  </figcaption>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  editUserDetailForm = (initialValues) => {
    return (
      <Form
        className="ps-form--account-setting"
        onSubmit={this.handleLoginSubmit}
        initialValues={{ ...initialValues }}
      >
        <div className="ps-form__header">
          <h3>Account Information</h3>
        </div>
        <div className="ps-form__content">
          <div className="control-label">Full Name</div>
          <div className="form-group">
            <Form.Item
              name="name"
              rules={[
                {
                  required: false,
                  message: "Please input your name!",
                },
              ]}
            >
              <Input
                name="name"
                className="form-control"
                type="text"
                placeholder="Username or email address"
              />
            </Form.Item>
          </div>
          <div className="form-group">
            <div className="control-label">Mobile</div>
            <Form.Item
              name="mobile"
              rules={[
                {
                  required: false,
                  message: "Please enter your mobile number.",
                },
              ]}
            >
              <Input
                name="mobile"
                className="form-control"
                disabled={true}
                type="text"
                placeholder="Enter your phone number"
              />
            </Form.Item>
          </div>
          <div className="control-label">Email</div>
          <div className="form-group">
            <Form.Item
              name="email"
              rules={[
                {
                  required: false,
                  message: "Please enter your email.",
                },
              ]}
            >
              <Input
                name="email"
                className="form-control"
                disabled={true}
                type="text"
                placeholder="Username or email address"
              />
            </Form.Item>
          </div>
          <div className="form-group submit">
            <button className="ps-btn">Update</button>
          </div>
        </div>
      </Form>
    );
  };
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(withRouter(UserInformation));
