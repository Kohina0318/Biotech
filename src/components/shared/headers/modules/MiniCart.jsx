import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import API from "api/api";
import { IMAGE_BASE_URL, NoImg } from "utilities/constants";
import { languageLable } from "utilities/helpers";

var api;
class MiniCart extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      mediaBaseURL: null,
    };
  }

  componentDidMount = () => {
    this.getCart();
  };

  componentDidUpdate = (props) => {
    if (
      props.auth &&
      props.auth.appDefaultSetting &&
      props.auth.appDefaultSetting.ImageUrl &&
      !this.state.mediaBaseURL
    ) {
      this.setState({
        mediaBaseURL: this.props.auth.appDefaultSetting.ImageUrl,
      });
    }
  };

  getCart = () => {
    api.get("GetMyCart").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.props.dispatch({
          type: "FETCH_CART_DATA",
          cartData: response.Result,
        });
      }
    });
  };

  render() {
    const { cartData } = this.props;
    const { mediaBaseURL } = this.state;
    const { selectedLanguageData } = this.props;
    const  currencySetting  = localStorage.getItem('currency');

    return (
      <div className="ps-cart--mini">
        <Link className="header__extra" to="/">
          <i className="icon-bag2"></i>
          <span>
            <i>
              {cartData &&
              cartData.CartItemViewModels &&
              cartData.CartItemViewModels.length > 0
                ? cartData.CartItemViewModels.length
                : 0}
            </i>
          </span>
        </Link>
        {cartData &&
        cartData.CartItemViewModels &&
        cartData.CartItemViewModels.length > 0 ? (
          <div className="ps-cart__content">
            <div className="ps-cart__items">
              {cartData.CartItemViewModels.map((product) => (
                <div className="ps-product--cart-mobile" key={product.ItemId}>
                  <div className="ps-product__thumbnail">
                    {product.ProductMediaIds ? (
                      <img
                        src={`${IMAGE_BASE_URL}${`/Media/GetMediaById?id=`}${product.ProductMediaIds}`}
                        alt={product.ProductName}
                      />
                    ) : (
                      <img src={NoImg} alt={product.ProductName} />
                    )}
                  </div>
                  <div className="ps-product__content">
                    <p className="ps-product__title">
                      <strong>
                        {product.ProductDetails &&
                          product.ProductDetails[0] &&
                          product.ProductDetails[0].Name}
                      </strong>
                    </p>
                    <p></p>
                    <small>
                      {product.Quantity} x {product.OfferPrice}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <div className="ps-cart__footer">
              <h3>
                {languageLable(selectedLanguageData, "Total")}:
                <strong>
                  {currencySetting}{" "}
                  {cartData && cartData.TotalAmount ? cartData.TotalAmount : 0}
                </strong>
              </h3>
              <figure>
                <Link to="/account/cart" className="ps-btn right">
                  {languageLable(selectedLanguageData, "View Cart")}
                </Link>
              </figure>
            </div>
          </div>
        ) : (
          <React.Fragment>
            {/*<div className="ps-cart__content">
            <div className="ps-cart__items">
              <span>No products in cart</span>
                </div>
            </div>*/}
          </React.Fragment>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return state.app;
};

export default connect(mapStateToProps)(withRouter(MiniCart));
