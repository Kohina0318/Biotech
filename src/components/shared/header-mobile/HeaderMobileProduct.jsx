import React from "react";
import MobileHeaderActions from "../headers/modules/MobileHeaderActions";
import { Link, withRouter } from "react-router-dom";

class HeaderMobileProduct extends React.Component {
  handleBackToPrevious = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <header
        className="header header--mobile header--mobile-product"
        data-sticky="true"
      >
        <div className="navigation--mobile">
          <div className="navigation__left">
            <Link to="/shop">
              <a href="/" className="header__back">
                <i className="icon-chevron-left"></i>
                <strong>Back to previous</strong>
              </a>
            </Link>
          </div>
          <div className="navigation__right">
            <MobileHeaderActions />
          </div>
        </div>
      </header>
    );
  }
}

export default withRouter(HeaderMobileProduct);
