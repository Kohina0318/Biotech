import React, { Component } from "react";
import { connect } from "react-redux";
import MiniCart from "./MiniCart";
import AccountQuickLinks from "./AccountQuickLinks";

class HeaderActions extends Component {
  render() {
    const { auth } = this.props;
    return (
      <div className="header__actions">
        {this.props.auth && this.props.auth.isLoggedIn && (
          <React.Fragment>
            <MiniCart />
          </React.Fragment>
        )}
        {auth.isLoggedIn && Boolean(auth.isLoggedIn) === true ? (
          <AccountQuickLinks isLoggedIn={true} />
        ) : (
          <AccountQuickLinks isLoggedIn={false} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(HeaderActions);
