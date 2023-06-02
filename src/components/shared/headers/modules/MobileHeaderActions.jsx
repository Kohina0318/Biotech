import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AccountQuickLinksMobile from "./AccountQuickLinksMobile";
class MobileHeaderActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuDrawer: false,
      cartDrawer: false,
      searchDrawer: false,
      categoriesDrawer: false,
    };
  }

  handleDrawerClose = () => {
    this.setState({
      menuDrawer: false,
      cartDrawer: false,
      searchDrawer: false,
      categoriesDrawer: false,
    });
  };
  render() {
    const { auth } = this.props;
    const { cartTotal } = this.props.cart;
    return (
      <div className="navigation__right">
        {auth.isLoggedIn && Boolean(auth.isLoggedIn) === true && (
          <Link to="/account/cart" className="header__extra">
            <i className="icon-bag2"></i>
            <span>
              <i>{cartTotal ? cartTotal : 0}</i>
            </span>
          </Link>
        )}

        {auth.isLoggedIn && Boolean(auth.isLoggedIn) === true ? (
          <AccountQuickLinksMobile />
        ) : (
          <div className="header__extra">
            <Link to="/account/login">
              <i className="icon-user"></i>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(MobileHeaderActions);
