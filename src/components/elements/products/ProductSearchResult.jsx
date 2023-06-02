import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import LazyLoad from "react-lazyload";
import { formatCurrency } from "../../../utilities/product-helper";
import Rating from "../Rating";
import { IMAGE_BASE_URL } from "../../../utilities/constants";
import NoImage from "public/static/img/not-found.jpg";

class ProductResult extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isQuickView: false,
      mediaBaseURL: null,
    };
  }

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

  imageRender = () => {
    const { product } = this.props;
    let mediaId = product.PrimaryMediaId;

    if(mediaId != null){
        return <img
                  src={`${IMAGE_BASE_URL}${`/Media/GetMediaById?id=`}${mediaId}`}
                  alt={product.ProductName}
                />;
    }else{
        return <img src={NoImage} alt={product.ProductName} />;
    }

  };

  render() {
    const { product, currency, mediaBaseURL } = this.props;

    //let mediaId = product.PrimaryMediaId;
    //console.log(mediaId);
    //if (product.MediaId) mediaId = product.MediaId;

    return (
      <div className="ps-product ps-product--wide ps-product--search-result">
        <div className="ps-product__thumbnail">
        <Link
            to={`/product-details/${product.Id}/${
              this.props.isCombo ? "combo" : product.ProductType
            }`}
            onClick={() => window.location.reload()}>
          
            {this.imageRender()}
              {/* {mediaId ? (
                <img
                  src={`${IMAGE_BASE_URL}${`/Media/GetMediaById?id=`}${mediaId}`}
                  alt={product.ProductName}
                />
              ) : (
                <img src={NoImg} alt={product.ProductName} />
              )} */}
          
          </Link>
        </div>
        <div className="ps-product__content">
        <Link
            to={`/product-details/${product.Id}/${
              this.props.isCombo ? "combo" : product.ProductType
            }`}
            onClick={() => window.location.reload()}>
            <Link
              to={`/product-details/${product.Id}/${
                this.props.isCombo ? "combo" : product.ProductType
              }`}
              as={`/product/${product.Id}`}
              className="ps-product__title"
              onClick={() => window.location.reload()}>
              {product.ProductName}
            </Link>
          </Link>
          {/* <div className="ps-product__rating">
            <Rating />
            <span>{product.ratingCount}</span>
          </div> */}
          {/* {product.is_sale === true ? (
            <p className="ps-product__price sale">
              {currency ? currency.symbol : "$"}
              {formatCurrency(product.ProductListings[0].MaxRetailPrice)}
              <del className="ml-1">
                {currency ? currency.symbol : "$"}
                {formatCurrency(product.ProductListings[0].OfferPrice)}
              </del>
            </p>
          ) : (
            <p className="ps-product__price">
              {currency ? currency.symbol : "$"}
              {formatCurrency(product.ProductListings[0].OfferPrice)}
            </p>
          )} */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.setting;
};
export default connect(mapStateToProps)(ProductResult);
