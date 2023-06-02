import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Dropdown, Menu } from "antd";
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
        text: languageLable(selectedLanguageData, "Address"),
        url: "/account/edit-address",
      },
    ];
    const menu = (
      <Menu>
        {accountLinks.map((link) => (
          <Menu.Item key={link.url}>
            <Link to={link.url}>{link.text}</Link>
          </Menu.Item>
        ))}

        <Menu.Item>
          <Link to="#" onClick={this.handleLogout.bind(this)}>
            {languageLable(selectedLanguageData, "Logout")}
          </Link>
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} placement="bottomLeft">
        <Link to="#" className="header__extra ps-user--mobile">
          <i className="icon-user"></i>
        </Link>
      </Dropdown>
    );
  }
}
const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(AccountQuickLinks));
