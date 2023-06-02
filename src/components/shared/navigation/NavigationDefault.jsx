import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { notification } from "antd";
import Menu from "../../elements/menu/Menu";
import menuData from "../../../public/static/data/menu";
import LanguageSwicher from "../headers/modules/LanguageSwicher";
import API from "api/api";
import { languageLable } from "utilities/helpers";
var api;

class NavigationDefault extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      categoryList: [],
    };
  }

  handleFeatureWillUpdate(e) {
    e.preventDefault();
    notification.open({
      message: "Opp! Something went wrong.",
      description: "This feature has been updated later!",
      duration: 500,
    });
  }

  componentDidMount = () => {
    this.getAllCategories();
  };

  getAllCategories = () => {
    api.get("GetAllCategories").then((response) => {
      if (
        response.StatusCode === 200 &&
        response.Result &&
        response.Result.length > 0
      ) {
        this.props.dispatch({
          type: "FETCH_CATEGORIES",
          categories: response.Result,
        });

        // Prepare categories for menu
        let categoryList = [];
        response.Result.forEach((item) => {
          categoryList.push({
            text: item.Name,
            url: `/search-product/${item.Id}`,
          });
        });

        this.setState({
          categoryList,
        });
      }
    });
  };

  render() {
    const { selectedLanguageData } = this.props.app;
    const paymentProvider = localStorage.getItem('paymentProvider');
    var menu = <Menu data={menuData.menuPrimary.menu_2} className="menu" />;
    if (paymentProvider == 'Razorpay') {
        menu = <Menu data={menuData.menuPrimary.menu_1} className="menu" />;
    }
    return (
      <nav className="navigation">
        <div className="ps-container">
          <div className="navigation__left">
            <div className="menu--product-categories">
              <div className="menu__toggle">
                <i className="icon-menu"></i>
                <span>{languageLable(selectedLanguageData, "Categories")}</span>
              </div>
              <div className="menu__content">
                <Menu
                  data={this.state.categoryList}
                  className="menu--dropdown"
                />
              </div>
            </div>
          </div>
          <div className="navigation__right">
            {menu}
            <ul className="navigation__extra">
              {this.props.auth && this.props.auth.isLoggedIn && (
                <li>
                  <Link to="/account/orders">
                    {languageLable(selectedLanguageData, "Order History")}
                  </Link>
                </li>
              )}
              <li>
                <LanguageSwicher />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(NavigationDefault));
