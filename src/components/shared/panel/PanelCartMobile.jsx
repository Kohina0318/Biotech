import React, { Component } from "react";
import { connect } from "react-redux";
import { getCart, removeItem } from "redux/cart/action";
import { Link } from "react-router-dom";
import { isStaticData } from "../../../utilities/app-settings";
import { baseUrl } from "../../../repositories/Repository";

class PanelCartMobile extends Component {
  componentDidMount() {
    this.props.dispatch(getCart());
  }

  handleRemoveCartItem = (product) => {
    this.props.dispatch(removeItem(product));
  };

  render() {
    const { amount, cartItems } = this.props;
    return (
      <div className="ps-cart--mobile">
        <div className="ps-cart__content">
          {cartItems && cartItems.length > 0 ? (
            cartItems.map((product) => (
              <div className="ps-product--cart-mobile" key={product.id}>
                <div className="ps-product__thumbnail">
                  <Link to="/product/[pid]" as={`/product/${product.id}`}>
                    <img
                      src={
                        isStaticData === true
                          ? product.thumbnail.url
                          : `${baseUrl}${product.thumbnail.url}`
                      }
                      alt={process.env.REACT_APP_NAME}
                    />
                  </Link>
                </div>
                <div className="ps-product__content">
                  <Link
                    className="ps-product__remove"
                    onClick={this.handleRemoveCartItem.bind(this, product)}
                  >
                    <i className="icon-cross"></i>
                  </Link>
                  <Link to="/product/[pid]" as={`/product/${product.id}`}>
                    <Link className="ps-product__title">{product.title}</Link>
                  </Link>
                  <p>
                    <strong>Sold by:</strong> {product.vendor}
                  </p>
                  <small>
                    {product.quantity} x ${product.price}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <div className="ps-cart__items">
              <span>No products in cart</span>
            </div>
          )}
        </div>
        {cartItems && cartItems.length > 0 ? (
          <div className="ps-cart__footer">
            <h3>
              Total:<strong>${amount}</strong>
            </h3>
            <figure>
              <Link to="/account/shopping-cart">
                <Link className="ps-btn">View Cart</Link>
              </Link>
              <Link to="/account/checkout">
                <Link className="ps-btn">Checkout</Link>
              </Link>
            </figure>
          </div>
        ) : (
          <div className="ps-cart__footer">
            <Link to="/shop">
              <Link className="ps-btn ps-btn--fullwidth">Shop now</Link>
            </Link>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.cart;
};
export default connect(mapStateToProps)(PanelCartMobile);
