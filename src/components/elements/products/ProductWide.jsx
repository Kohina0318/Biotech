import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { IMAGE_BASE_URL, NoImg } from "utilities/constants";

class ProductWide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isQuickView: false,
      mediaBaseURL: null,
    };
  }

  render() {
    const { productData, mediaBaseURL, isCombo } = this.props;

    return (
      <div className="ps-product ps-product--wide">
        <div className="ps-product__thumbnail">
          <Link
            to={`/product-details/${productData.Id}/${
              this.props.isCombo ? "combo" : productData.ProductType
            }`}
          >
            {productData.PrimaryMediaId ? (
              <img
                src={`${IMAGE_BASE_URL}${mediaBaseURL}${productData.PrimaryMediaId}`}
                alt={productData.ProductName}
              />
            ) : (
              <img src={NoImg} alt={productData.ProductName} />
            )}
          </Link>
        </div>
        <div className="ps-product__container">
          <div className="ps-product__content">
            <Link
              to={`/product-details/${productData.Id}/${
                this.props.isCombo ? "combo" : productData.ProductType
              }`}
              className="ps-product__title"
            >
              {isCombo ? productData.ComboName : productData.ProductName}
            </Link>
            <ul className="ps-product__desc">
              <li>
                {isCombo
                  ? productData.ComboDescription
                  : productData.ProductSummary}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(ProductWide);
