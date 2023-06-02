import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import NavigationDefault from "../navigation/NavigationDefault";
import HeaderActions from "./modules/HeaderActions";
import MenuCategories from "./modules/MenuCategories";
import SearchHeader from "./modules/SearchHeader";
import { addItem } from "redux/cart/action";
import { stickyHeader } from "../../../utilities/common-helpers";
import { isStaticData } from "../../../utilities/app-settings";
import { baseUrl } from "../../../repositories/Repository";

class HeaderProduct extends Component {
  componentDidMount() {
    if (process.browser) {
      window.addEventListener("scroll", stickyHeader);
    }
  }

  handleAddItemToCart = (e) => {
    e.preventDefault();
    const { productData } = this.props;
    this.props.dispatch(addItem(productData));
  };

  handleScroll = () => {
    let number =
      window.pageXOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (number >= 300) {
      document.getElementById("headerSticky").classList.add("header--sticky");
    } else {
      document
        .getElementById("headerSticky")
        .classList.remove("header--sticky");
    }
  };

  render() {
    const { productData } = this.props;
    return (
      <header
        className="header header--1 header--product"
        data-sticky="true"
        id="headerSticky"
      >
        <div className="header__top">
          <div className="ps-container">
            <div className="header__left">
              <Link to="/">
                <a className="ps-logo">
                  <img src="/static/img/logo_light.png" alt="martfury" />
                </a>
              </Link>
              <div className="menu--product-categories">
                <div className="menu__toggle">
                  <i className="icon-menu"></i>
                  <span> Shop by Department</span>
                </div>
                <div className="menu__content">
                  <MenuCategories />
                </div>
              </div>
            </div>
            <div className="header__center">
              <SearchHeader />
            </div>
            <div className="header__right">
              <HeaderActions />
            </div>
          </div>
        </div>
        <NavigationDefault />
      </header>
    );
  }
}
export default connect((state) => state.product)(HeaderProduct);
