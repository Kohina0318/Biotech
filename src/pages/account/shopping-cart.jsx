import React, { Component} from "react";
import { connect } from "react-redux";
import FooterDefault from "../../components/shared/footers/FooterDefault";
import HeaderDefault from "../../components/shared/headers/HeaderDefault";
import BreadCrumb from "../../components/elements/BreadCrumb";
import ShoppingCart from "../../components/partials/account/ShoppingCart";
import HeaderMobile from "../../components/shared/headers/HeaderMobile";
import NavigationList from "../../components/shared/navigation/NavigationList";
import API from "api/api";

var api;
const breadCrumb = [
  {
    text: "Home",
    url: "/",
  },
  {
    text: "Cart",
  },
];

class ShoppingCartPage extends Component {
  constructor(props) {
    super(props);
    api = new API();
  }

  handleClearCart = () => {
    api.delete("ClearCart").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.props.dispatch({
          type: "FETCH_CART_DATA",
          cartData: response.Result,
        });
      }
    });
  };

  render() {
    return (
      <div className="site-content">
        <HeaderDefault />
        <HeaderMobile />
        <NavigationList />
        <div className="ps-page--simple">
          <BreadCrumb
            breacrumb={breadCrumb}
            isShoppingCart={true}
            handleClearCart={this.handleClearCart}
          />
          <ShoppingCart />
        </div>
        <FooterDefault />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(ShoppingCartPage);