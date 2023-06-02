import React, { Component } from "react";
import { connect } from "react-redux";
import CurrencyDropdown from "./modules/CurrencyDropdown";
import { Link } from "react-router-dom";
import LanguageSwicher from "./modules/LanguageSwicher";
import MobileHeaderActions from "./modules/MobileHeaderActions";

class HeaderMobile extends Component {
  constructor({ props }) {
    super(props);
  }

  render() {
    return (
      <header className="header header--mobile">
        <div className="header__top">
          <div className="header__left">
            <p>Welcome to Online Store !</p>
          </div>
          <div className="header__right">
            <ul className="navigation__extra">
              <li>
                <CurrencyDropdown />
              </li>
              <li>
                <LanguageSwicher />
              </li>
            </ul>
          </div>
        </div>
        <div className="navigation--mobile">
          <div className="navigation__left">
            <Link to="/" className="ps-logo">
              <img src="/static/img/logo_light.png" alt={process.env.REACT_APP_NAME} />
            </Link>
          </div>
          <MobileHeaderActions />
        </div>
        <div className="ps-search--mobile">
          <form className="ps-form--search-mobile" action="/" method="get">
            <div className="form-group--nest">
              <input
                className="form-control"
                type="text"
                placeholder="Search something..."
              />
              <button>
                <i className="icon-magnifier"></i>
              </button>
            </div>
          </form>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, null)(HeaderMobile);
