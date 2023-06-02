import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { notification, Popconfirm } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import API from "api/api";
import DeleteIcon from "public/static/img/delete.png";
import { IMAGE_BASE_URL, NoImg } from "utilities/constants";
import { languageLable } from "utilities/helpers";

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

var api;
class ShoppingCart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mediaBaseURL: null,
      orderNote: "",
      myDefaultAddress: {},
      myDefaultAddressId: '',
      myDefaultAddressBusinessId: "",

    };
    api = new API();
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

  handleItemDelete = (row) => {
    // Delete
    api.delete(`DeleteItem?itemId=${row.ItemId}`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.props.dispatch({
          type: "FETCH_CART_DATA",
          cartData: response.Result,
        });
      }
    });
  };

  handleAddItemToCart = (row) => {
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
      productId: row.Id,
      businessId: businessId,
      businessLocationId: locationId,
      quantity: row.IncrementalStep,
      amount: row.OfferPrice,
      offerAmount: row.OfferPrice,
      offerId: "",
      listingId: row.ListingId,
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
  }

  handleIncreaseItemQty = (row) => {
    if (row && row.ItemId) {
      if (row.Quantity > 0) {
        // Update
        api
          .post(
            `QuantityUpdate?itemId=${row.ItemId}&quantity=${1
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
        api.delete(`DeleteItem?itemId=${row.ItemId}`).then((response) => {
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

  handleDecreaseItemQty = (row) => {
    if (row && row.ItemId) {
      if (row.Quantity > 0) {
        // Update
        api
          .post(
            `QuantityUpdate?itemId=${row.ItemId}&quantity=${-1
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
        api.delete(`DeleteItem?itemId=${row.ItemId}`).then((response) => {
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

  handleCheckOut = () => {
    const locationId =
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping.LocationId;

    if (this.state.myDefaultAddressId != "") {
      api.post("CheckOut", {
        data: {
          shippingScheduleId: "",
          LocationId: locationId,
          addressId: this.state.myDefaultAddressId,
          orderNote: this.state.orderNote,
        },
      })
        .then((response) => {
          if (response.StatusCode === 200 && response.Result) {
            // alert(JSON.stringify(response.Result))
            this.props.history.push({
              pathname: "/account/payment",
              state: { myDefaultAddressBusinessId: this.state.myDefaultAddressBusinessId}
            })
            // this.props.history.push("/account/payment");   
          }
        });
    }
    else {
      alert("Address Not Found!")
    }
  };

  handleCoupanCode = () => {
    const { selectedLanguageData } = this.props.app;

    notification.info({
      message: languageLable(
        selectedLanguageData,
        "Sorry, no available coupan yet."
      ),
    });
  };

  handleOrderNoteChange = (e) => {
    this.setState({
      orderNote: e.target.value,
    });
  };

  GetMyDefaultAddress = () => {
    api.get("GetMyDefaultAddress").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.setState({
          myDefaultAddress: response.Result,
          myDefaultAddressId: response.Result.Id,
          myDefaultAddressBusinessId: response.Result.BusinessCustomerAddressMapping.BusinessId,
        });
        console.log('GetMyDefaultAddress.......api data:', response.Result)
      }
    });
  };

  componentDidMount = () => {
    this.GetMyDefaultAddress()
  };

  render() {
    const { cartData } = this.props.app;
    const { mediaBaseURL, myDefaultAddress } = this.state;
    const { selectedLanguageData } = this.props.app;
    const currencySetting = localStorage.getItem('currency');

    return (
      <div className="ps-section--shopping ps-shopping-cart payment-conformation">
        <div className="ps-container">
          <div className="ps-section__content">
            <div className="table-responsive">
              <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12 ">
                  <table className="table ps-table--shopping-cart">
                    <thead>
                      <tr>
                        <th>{languageLable(selectedLanguageData, "Product")}</th>
                        <th>{languageLable(selectedLanguageData, "Name")}</th>
                        <th>{languageLable(selectedLanguageData, "Price")}</th>
                        <th>{languageLable(selectedLanguageData, "Packing Size")}</th>
                        <th>{languageLable(selectedLanguageData, "Quantity")}</th>
                        <th>{languageLable(selectedLanguageData, "Total")}</th>
                        <th>{languageLable(selectedLanguageData, "Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartData &&
                        cartData.CartItemViewModels &&
                        cartData.CartItemViewModels.map((product) => (

                          <tr key={product.ItemId}>
                            <td
                              className="table-image-container"
                              style={{ height: "100px", width: "100px" }}
                            >
                              {product.ProductMediaIds &&
                                product.ProductMediaIds[0] ? (
                                <img
                                  src={`${IMAGE_BASE_URL}${mediaBaseURL}${product.ProductMediaIds[0]}`}
                                  alt={product.ProductName}
                                />
                              ) : (
                                <img src={NoImg} alt={product.ProductName} />
                              )}
                              {!product.ComboId &&
                                product.DiscountPercent > 0 && (
                                  <div className="discount-container">
                                    {product.DiscountPercent &&
                                      product.DiscountPercent.toFixed(2)}{" "}
                                    %
                                  </div>
                                )}
                            </td>
                            <td>
                              {product.ComboId && (
                                <React.Fragment>
                                  <strong className="theme-color">
                                    {languageLable(
                                      selectedLanguageData,
                                      "Combo Product"
                                    )}
                                    *
                                  </strong>
                                  <br />
                                </React.Fragment>
                              )}
                              {product.ProductDetails &&
                                product.ProductDetails[0] &&
                                product.ProductDetails[0].Name}
                              {product.Attributes &&
                                product.Attributes.length > 0 &&
                                product.Attributes.map((i) => (
                                  <div className="attribute">
                                    {i.attributeName}
                                  </div>
                                ))}
                            </td>
                            <td className="price">
                              {currencySetting} {product.ComboId
                                ? product.Price
                                : product.OfferPrice.toFixed(2)}{" "}
                              {!product.ComboId &&
                                product.DiscountPercent > 0 && (
                                  <s>{currencySetting} {product.Price.toFixed(2)}</s>
                                )}
                            </td>
                            <td className="packingsize">
                              {product.PackingSize} {product.Unit}
                            </td>
                            <td>
                              {product.ComboId ? (
                                <React.Fragment>
                                  {product.Quantity}
                                </React.Fragment>
                              ) : (
                                <div className="form-group--number">
                                  <button
                                    className="up"
                                    onClick={() =>
                                      this.handleIncreaseItemQty(product)
                                    }
                                  >
                                    +
                                  </button>
                                  <button
                                    className="down"
                                    onClick={() =>
                                      this.handleDecreaseItemQty(product)
                                    }
                                  >
                                    -
                                  </button>
                                  <input
                                    className="form-control"
                                    type="text"
                                    placeholder="1"
                                    value={product.Quantity}
                                    readOnly={true}
                                  />
                                </div>
                              )}
                            </td>
                            <td>{currencySetting} {parseFloat(product.Quantity * product.OfferPrice).toFixed(2)}</td>
                            <td className="text-center">
                              <Popconfirm
                                placement="top"
                                title={languageLable(
                                  selectedLanguageData,
                                  "Are you sure?"
                                )}
                                onConfirm={() => this.handleItemDelete(product)}
                                okText={languageLable(
                                  selectedLanguageData,
                                  "Yes"
                                )}
                                cancelText={languageLable(
                                  selectedLanguageData,
                                  "No"
                                )}
                              >
                                <img
                                  src={DeleteIcon}
                                  alt={languageLable(
                                    selectedLanguageData,
                                    "delete"
                                  )}
                                  className="pointer"
                                />
                              </Popconfirm>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">
                  <div className="ps-block--shipping" >
                    <div className="ps-block--payment-method">
                      <div className="ps-block__header" >
                        <input
                          id="suggestion"
                          value={this.state.orderNote}
                          className="form-control"
                          name="suggestion"
                          type="text"
                          placeholder={languageLable(
                            selectedLanguageData,
                            "Write your comment/suggestions"
                          )}
                          onChange={(e) => this.handleOrderNoteChange(e)}
                        ></input>
                      </div>
                      {/*<div className="coupons-container pointer">
                        <div
                          className="item-container"
                          onClick={this.handleCoupanCode}
                        >
                          <div className="name">
                            <h4>COUPON</h4>
                          </div>
                          <div className="value">
                            <h4> {">"} </h4>
                          </div>
                        </div>
                      </div>*/}
                    </div>
                  </div>

                  <div className="ps-form__orders" >
                    <div className="ps-block--checkout-order">
                      <div className="ps-block__content">
                        <figure>
                          <figcaption>
                            <strong >
                              {languageLable(
                                selectedLanguageData,
                                "Bill Details"
                              )}
                            </strong>
                          </figcaption>
                        </figure>
                        <figure>
                          <figcaption>
                            <strong>
                              {languageLable(
                                selectedLanguageData,
                                "Item Total"
                              )}
                            </strong>
                            <strong>
                              {currencySetting}{" "}
                              {cartData && cartData.ItemTotal
                                ? cartData.ItemTotal.toFixed(2)
                                : 0}
                            </strong>
                          </figcaption>
                        </figure>
                        <figure>
                          <figcaption>
                            <strong>
                              {languageLable(selectedLanguageData, "Discount")}
                            </strong>
                            <strong>
                              ({currencySetting}{" "}
                              {cartData && cartData.Discount
                                ? cartData.Discount
                                : 0}{" "}
                              )
                            </strong>
                          </figcaption>
                        </figure>
                        <figure>
                          <figcaption>
                            <strong>
                              {languageLable(
                                selectedLanguageData,
                                "Delivery Charges"
                              )}
                            </strong>
                            <strong>{currencySetting}{" "}
                              {cartData && cartData.ShippingCharge
                                ? cartData.ShippingCharge
                                : 0}</strong>
                          </figcaption>
                        </figure>
                        <figure className="ps-block__total">
                          <h3>
                            {languageLable(selectedLanguageData, "To Pay")}
                            <strong>
                              {currencySetting}{" "}
                              {cartData && cartData.TotalAmount
                                ? cartData.TotalAmount.toFixed(2)
                                : 0}
                            </strong>
                          </h3>
                        </figure>
                      </div>
                    </div>
                  </div>

                  {Object.values(myDefaultAddress).length >0 ?
                  <div className="ps-block__content" >
                    <figure>
                      <figcaption>
                        <h4><strong>{languageLable(selectedLanguageData, "Shipping Address")}</strong></h4>
                      </figcaption>
                    </figure>
                    <div className="ps-block--checkout-order">
                      <div className="ps-block__content">
                        <figcaption >
                          <strong>
                            {myDefaultAddress.Name}
                          </strong>
                        </figcaption>
                        <div style={{ marginTop: 5 }} />
                        <figcaption>
                          <div className="field-title">
                            {myDefaultAddress.AddressLine1}, {myDefaultAddress.AddressLine2}, {myDefaultAddress.City}, {myDefaultAddress.State}, {myDefaultAddress.Country}, {myDefaultAddress.Pin}.
                          </div>
                        </figcaption>
                        <div style={{display:"flex",justifyContent:'flex-end',marginTop:5}}>
                           
                            <button onClick={() => this.props.history.push({
                              pathname: "/account/edit-address",
                              state: { comeIn: "ComeInCartPage" }
                            })}
                                  style={{ borderRadius: 3, textAlign: 'center', background: '#396470', color: '#FFF', padding: "8px 10px", fontSize: 13, border: 0 }}
                                >
                                  {languageLable(selectedLanguageData, "Select Shipping Address")}
                                </button>
                          </div>
                      </div>
                    </div>
                  </div>
                  :""}

                  {cartData &&
                    cartData.TotalAmount &&
                    parseInt(cartData.TotalAmount) > 0 && (
                      <button
                        onClick={() => this.handleCheckOut()}
                        className="ps-btn ps-btn--fullwidth"
                      >
                        {languageLable(selectedLanguageData, "Continue")}
                      </button>
                    )}
                </div>
                <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12 "></div>
              </div>
            </div>
            <div className="ps-section__cart-actions">
              <Link to="/">
                <i className="icon-arrow-left mr-2"></i>
                {languageLable(selectedLanguageData, "Back to Categories")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(ShoppingCart));

