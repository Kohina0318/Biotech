import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class ProtectedRoute extends Component {
  render() {
    const { isLoggedIn, children } = this.props;
    return (
      <div>
        {!isLoggedIn ? (
          <Redirect to={"/account/login"} />
        ) : (
          <Fragment>{children}</Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps, null)(ProtectedRoute);
