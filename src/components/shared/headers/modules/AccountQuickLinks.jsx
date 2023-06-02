import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { languageLable } from "utilities/helpers";
class AccountQuickLinks extends Component {
  handleLogout = (e) => {
    e.preventDefault();
    this.props.dispatch({
      type: "LOGOUT_SUCCESS",
    });
    this.props.history.push("/account/login");
  };

  render() {
    const { selectedLanguageData } = this.props.app;

    const accountLinks = [
      {
        text: languageLable(selectedLanguageData, "Account Information"),
        url: "/account/user-information",
      },
      {
        text: languageLable(selectedLanguageData, "Notifications"),
        url: "/account/notifications",
      },
      {
        text: languageLable(selectedLanguageData, "Change Password"),
        url: "/account/change-password",
      },
    ];
    const { isLoggedIn } = this.props;
    if (isLoggedIn === true) {
      return (
        <div className="ps-block--user-account">
          <i className="icon-user"></i>
          <div className="ps-block__content">
            <ul className="ps-list--arrow">
              {accountLinks.map((link) => (
                <li key={link.text}>
                  <Link to={link.url}>{link.text}</Link>
                </li>
              ))}
              <li className="ps-block__footer">
                <Link to="#" onClick={this.handleLogout.bind(this)}>
                  {languageLable(selectedLanguageData, "Logout")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div className="ps-block--user-header">
          <div className="ps-block__left">
            <i className="icon-user"></i>
          </div>
          <div className="ps-block__right">
            <Link to="/account/login">
              {languageLable(selectedLanguageData, "Login")}
            </Link>
            <Link to="/account/register">
              {languageLable(selectedLanguageData, "Register")}
            </Link>
          </div>
        </div>
      );
    }
  }
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(AccountQuickLinks));
