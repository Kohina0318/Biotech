import React, { Component } from "react";
import { connect } from "react-redux";
import LazyLoad from "react-lazyload";
import { Link } from "react-router-dom";
import { IMAGE_BASE_URL, NoImg } from "utilities/constants";
import KycStrip from "components/partials/account/KycStrip";
import { languageLable } from "utilities/helpers";
import { notification} from "antd";
import API from "../../../api/api";

var api;
class Product extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      quantity: 0,
      selectedVariant: null,
      price: null,
      isQuickView: false,
      mediaBaseURL: null,
      selectedPackingSize: null,
      selectedOfferPrice: null,
      selectedListingId: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
      const { productData } = this.props;
      if (productData.ProductListings && productData.ProductListings.length > 0) {
      this.setState({
        isLoaded: true,
        selectedOfferPrice: productData.ProductListings[0].OfferPrice.toFixed(2),
        selectedListingId: productData.ProductListings[0].Id
      });
    }
  }

  componentDidUpdate = (props) => {
    const { productData } = this.props;
    if (
      props.auth &&
      props.auth.appDefaultSetting &&
      props.auth.appDefaultSetting.ImageUrl &&
      !this.state.mediaBaseURL
    ) {
        if (productData.ProductListings && productData.ProductListings.length > 0){
        this.setState({
          mediaBaseURL: this.props.auth.appDefaultSetting.ImageUrl,
          selectedOfferPrice: productData.ProductListings[0].OfferPrice.toFixed(2),
          selectedListingId: productData.ProductListings[0].Id
        });
      }
    }
  };

  handleIncreaseItemQty = (row) => {
    const businessId =
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping.BusinessId;

    const locationId =
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping.LocationId;

    // Add item to cart
    let addToCart = {
      businessId: businessId,
      listingId: row.ProductListingId,
      businessLocationId: locationId,
      productId: row.ProductId,
      amount: row.Price,
      offerId: ""
    };

    const { selectedLanguageData } = this.props.app;

    api
      .post("AddItemToCart", {
        data: addToCart,
      })
      .then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          notification.success({
            message: "Success",
            description: languageLable(
              selectedLanguageData,
              "Item has been successfully added to cart."
            ),
          });

          this.props.dispatch({
            type: "FETCH_CART_DATA",
            cartData: response.Result,
          });
        }
      });
  };

  handleDecreaseItemQty = (row, itemId, quantity) => {

    if (row && itemId) {
      if (quantity > 0) {
        // Update

        api
          .post(
            `QuantityUpdate?itemId=${itemId}&quantity=${-1
            }`
          )
          .then((response) => {
            if (response.StatusCode === 200 && response.Result) {
              this.props.dispatch({
                type: "FETCH_CART_DATA",
                cartData: response.Result,
              });
            }
          });
      } else {
        // Delete
        api.delete(`DeleteItem?itemId=${itemId}`).then((response) => {
          if (response.StatusCode === 200 && response.Result) {
            this.props.dispatch({
              type: "FETCH_CART_DATA",
              cartData: response.Result,
            });
          }
        });
      }
    }
  };

  handleChange = (e) => {
    var index = e.target.selectedIndex;
    var optionElement = e.target.childNodes[index]
    var option = optionElement.getAttribute('id');

    this.setState({ selectedOfferPrice: e.target.value });
    this.setState({ selectedListingId: option });
  };

  renderPackingSize = (props) => {
    const { productData } = this.props;
      if (productData.ProductListings && productData.ProductListings.length > 0){
      if (productData.ProductListings.length == 1) {
        return <span>{productData.ProductListings[0].PackingSize} {productData.ProductListings[0].Unit.Name}</span>
      } else {
      return  <select onChange={this.handleChange} value={this.state.selectedOfferPrice} id={this.state.selectedListingId}>
                {productData.ProductListings.map(function (ProductMultipleListing) {
                  return <option id={ProductMultipleListing.Id} value={ProductMultipleListing.OfferPrice.toFixed(2)}>{ProductMultipleListing.PackingSize} {ProductMultipleListing.Unit.Name} {"/"} {ProductMultipleListing.OfferPrice.toFixed(2)}</option>;
                })}
              </select>
      }
    }
    
  };

  renderDiscount = ( props ) => {
      const { productData } = this.props;
      if (productData.ProductListings && productData.ProductListings.length > 0){
      if(productData.ProductListings[0].DiscountPercent > 0){
        return <div className="ps-product__badge">
                <span>{Math.round(productData.ProductListings[0].DiscountPercent)}</span>
                {"%"}
              </div>
      }
    }
  };

  render() {
    const { productData, mediaBaseURL, isCombo } = this.props;
    
    let mediaId = productData.PrimaryMediaId;
    if (productData.MediaId) mediaId = productData.MediaId;

    const canOrder =
      this.props.auth &&
        this.props.auth.userData &&
        this.props.auth.userData.can_order === "true"
        ? true
        : false;
    const { selectedLanguageData } = this.props.app;

    let row = {};
    let RowPrice = this.state.selectedOfferPrice;
    let RowKey = this.state.selectedListingId;

    const ProductMultipleList = productData.ProductListings;

      if (productData.ProductListings && productData.ProductListings.length > 0) {
      if (this.props.auth && this.props.auth.isLoggedIn) {
        {
          ProductMultipleList.map(function (ProductMultipleListing) {
            row["PackingSize"] = ProductMultipleListing && ProductMultipleListing.PackingSize;
            if (ProductMultipleListing && canOrder) {
              row["ProductId"] = ProductMultipleListing.ProductId;
              row["key"] = ProductMultipleListing.ProductId;

              // Product Not availble set notify button
              if (ProductMultipleListing.Availability !== "Enquiry") {
                row["Availability"] =
                  ProductMultipleListing.Availability === "Unlimited"
                    ? ProductMultipleListing.Availability
                    : ProductMultipleListing.Quantity > 0
                      ? ProductMultipleListing.Quantity
                      : 0;

                row["Price"] = RowPrice;

                row["MaxRetailPrice"] =
                  ProductMultipleListing.MaxRetailPrice &&
                  ProductMultipleListing.MaxRetailPrice.toFixed(2);

                row["DiscountPercent"] =
                  ProductMultipleListing.DiscountPercent &&
                  ProductMultipleListing.DiscountPercent.toFixed(2);

                row["ProductListingId"] = RowKey;
              } else {
                row["Availability"] = "Enquiry";
                row["Price"] = "---";
                row["ProductListingId"] = RowKey;
              }

            } else {
              row["ProductId"] = "---";
              row["key"] = Math.random();
              row["Availability"] = "---";
              row["Price"] = "---";
            }
          })
        }
      }
    }
    return (
      <div className="ps-product">
        <div className="ps-product__thumbnail">
        {this.renderDiscount()}
          <Link
            to={`/product-details/${productData.Id}/${
              this.props.isCombo ? "combo" : productData.ProductType
              }`}
          >
            <LazyLoad>
              {mediaId ? (
                <img
                  src={`${IMAGE_BASE_URL}${mediaBaseURL}${mediaId}`}
                  alt={productData.ProductName}
                  width={100} 
                  height={100}
                />
              ) : (
                  <img src={NoImg} alt={productData.ProductName} />
                )}
            </LazyLoad>
            
          </Link>
        </div>
        <div className="ps-product__container">
          <Link
            to={`/product-details/${productData.Id}/${
              this.props.isCombo ? "combo" : productData.ProductType
              }`}
          > </Link>
          <div className="ps-product__vendor">
            {isCombo ? productData.ComboName : productData.ProductName}
            {/*<br />*/}
            {/*  {this.renderPackingSize()}  {this.state.selectedOfferPrice}*/}
           
            {/* {canOrder && (
              <div className="mb-20">{this.getCartButton(canOrder, row)}</div>
            )} */}
          </div>
         
          <div className="ps-product__content hover"></div>
        </div>
      </div>
    );
  }

  getCartButton = (canOrder, row) => {
    if (this.props.auth && this.props.auth.isLoggedIn && canOrder) {
      const { cartData } = this.props.app;
      let quantity = 0;
      let itemId = null;
      let packingSize = null;

      if (cartData) {
        cartData.CartItemViewModels &&
          cartData.CartItemViewModels.forEach((item) => {
            if (item.Id === row.ProductId) {
              quantity = item.Quantity;
              itemId = item.ItemId;
              packingSize = item.PackingSize;
            }
          });
      }

      const { selectedLanguageData } = this.props.app;

      return (
        <React.Fragment>
          <div className="ps-product__shopping ps-product__shopping-table">
            {row.Availability === "Enquiry" ? (
              <figure>
                <div className="form-group--number pointer">
                  <input
                    onClick={() => this.addProductEnquiry(row)}
                    className="form-control pointer"
                    type="text"
                    placeholder={languageLable(
                      selectedLanguageData,
                      "Notify Me"
                    )}
                    readOnly
                  />
                </div>
              </figure>
            ) : (
                <figure>
                  {quantity > 0 ? (
                    <React.Fragment>
                      <div className="form-group--number">
                        <button
                          className="up"
                          onClick={() => this.handleIncreaseItemQty(row)}
                        >
                          <i className="fa fa-plus"></i>
                        </button>
                        <button
                          className="down"
                          onClick={() =>
                            this.handleDecreaseItemQty(
                              row,
                              itemId,
                              quantity,
                              packingSize
                            )
                          }
                        >
                          <i className="fa fa-minus"></i>
                        </button>
                        <input
                          className="form-control"
                          type="text"
                          placeholder={quantity}
                          disabled
                        />
                      </div>
                    </React.Fragment>
                  ) : (
                      <React.Fragment>
                        {
                          /*row.Availability !== "Unlimited" &&
                        Number(row.Availability) === 0 ? (
                          <div className="form-group--number pointer">
                            ---
                          </div>
                        ) : ( */
                          <div className="form-group--number pointer">
                            <input
                              onClick={() => this.handleIncreaseItemQty(row)}
                              className="form-control pointer"
                              type="text"
                              placeholder={languageLable(
                                selectedLanguageData,
                                "Add +"
                              )}
                              readOnly
                            />
                          </div>
                          //)
                        }
                      </React.Fragment>
                    )}
                </figure>
              )}
          </div>
        </React.Fragment>
      );
    } else {
      return "---";
    }
  };


}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(Product);
