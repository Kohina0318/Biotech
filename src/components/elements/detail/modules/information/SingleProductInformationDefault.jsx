import React, { Component } from "react";
import { notification, Select } from "antd";
import { connect } from "react-redux";
import API from "api/api";
import KycStrip from "components/partials/account/KycStrip";
import { languageLable } from "utilities/helpers";
import Rating from "../../../../../components/elements/Rating";
import { TimerSharp } from "@material-ui/icons";

const { Option } = Select;
var api;
class InformationDefault extends Component {

  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      quantity: 0,
      selectedVariant: null,
      selectedPackingSize: null,
      selectedOfferPrice: 0,
      availableStock: 0,
      selectedListingId: null,
      price: null,
      loyaltypoint: 0,
      // customFieldData: [],
      customFieldDataUSD: '',
      customFieldDataUSDValue: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const canOrder =
      this.props.auth &&
        this.props.auth.userData &&
        this.props.auth.userData.can_order === "true" ? true : false;
    const { productData } = this.props;
    const { cartData } = this.props.app;
    const currencySetting = localStorage.getItem('currency');


    if (productData.ProductListings && productData.ProductListings.length > 0 && canOrder) {
      this.setState({
        isLoaded: true,
        selectedOfferPrice: productData.ProductListings[0].OfferPrice.toFixed(2),
        selectedListingId: productData.ProductListings[0].Id,
        availableStock: productData.ProductListings[0].Quantity
      });
    } else {
      this.setState({
        isLoaded: true,
        selectedOfferPrice: "---",
        selectedListingId: 0,
        availableStock: "---"
      });
    }

    if (cartData && cartData.CartItemViewModels) {
      const productItem = cartData.CartItemViewModels.map((product) => {
        productData.ProductListings.map((productListing) => {
          if (product.ListingId == productListing.Id) {
            this.setState({
              isLoaded: true,
              selectedOfferPrice: product.OfferPrice.toFixed(2),
              selectedListingId: product.ListingId,
              availableStock: productListing.Quantity
            });
          }
        });
      });
    }
    this.handleLoyaltyProductPoint();

    /*.....customFieldData Start......*/
    try {
      if (productData.ProductListings[0].CustomFieldData != undefined) {
        var datacustom = JSON.parse(productData.ProductListings[0].CustomFieldData);

        var data = [];
        var data1 = [];

        function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

        data = datacustom.filter((item) => {
          return (
            isNumber(item.Value) == false ? item : ""
          )
        })
        data1 = datacustom.filter((item) => {
          return (
            isNumber(item.Value) == true ? item : ""
          )
        })
        this.setState({
          //   customFieldData: productData.ProductListings[0].CustomFieldData,
          customFieldDataUSD: data[0].Value,
          customFieldDataUSDValue: data1[0].Value,
        });
      }
    } catch (e) {
      console.log("customFieldData not Fount!...", e)
    }
    /*.....customFieldData End......*/

  }

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
  }

  handleIncreaseItemQty = (row, itemId, quantity) => {
    if (row && itemId) {
      if (quantity > 0) {
        // Update

        api
          .post(
            `QuantityUpdate?itemId=${itemId}&quantity=${1}`
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

  handleDecreaseItemQty = (row, itemId, quantity) => {

    if (row && itemId) {
      if (quantity > 0) {
        // Update

        api
          .post(
            `QuantityUpdate?itemId=${itemId}&quantity=${-1}`
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

  prepareAttributeOption = () => {
    const { productData } = this.props;

    return (
      <div className="attribute-container">
        {productData.Attributes &&
          productData.Attributes.map((item, index) => {
            const options =
              productData.AttributeValues &&
              productData.AttributeValues.filter(
                (value) => value.attributeid === item.Id
              );
            return (
              <div className="attribute">
                <div className="title-container">
                  <strong>{item.Name}</strong>
                </div>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder={`Select a ${item.Name}`}
                  optionFilterProp="children"
                //onChange={onChange}
                >
                  {options &&
                    options.map((option) => (
                      <Option value={option.id}>{option.text}</Option>
                    ))}
                </Select>
              </div>
            );
          })}
      </div>
    );
  };

  handleChange = (e) => {
    var index = e.target.selectedIndex;
    var optionElement = e.target.childNodes[index]
    var option = optionElement.getAttribute('id');
    var stock = optionElement.getAttribute('stock');

    if (this.state.selectedListingId == option) {
      this.setState({ selectedOfferPrice: e.target.value });
      this.setState({ selectedListingId: option });
      this.setState({ availableStock: stock });
    } else {
      this.setState({ selectedOfferPrice: e.target.value });
      this.setState({ selectedListingId: option });
      this.setState({ availableStock: stock });
    }

  };

  renderPackingSize = (props) => {
    const { productData } = this.props;

    const { selectedLanguageData } = this.props.app;
    const canOrder =
      this.props.auth &&
        this.props.auth.userData &&
        this.props.auth.userData.can_order === "true"
        ? true
        : false;
    if (canOrder && productData.ProductListings && productData.ProductListings.length > 0) {
      if (productData.ProductListings.length == 1) {
        return <span>{languageLable(selectedLanguageData, "Packing Size ")}:{" "}{productData.ProductListings[0].PackingSize} {productData.ProductListings[0].Unit.Code}</span>
      } else {
        return <span>{languageLable(selectedLanguageData, "Packing Size ")}:{" "}
          <select onChange={this.handleChange} value={this.state.selectedOfferPrice} id={this.state.selectedListingId} stock={this.state.availableStock}>
            {productData.ProductListings.map(function (ProductMultipleListing) {
              return <option id={ProductMultipleListing.Id} stock={ProductMultipleListing.Quantity > 0 ? ProductMultipleListing.Quantity : "0"} value={ProductMultipleListing.OfferPrice.toFixed(2)}>{ProductMultipleListing.PackingSize} {ProductMultipleListing.Unit.Code}</option>;
            })}
          </select></span>

      }
    }
  };

  renderDiscount = (props) => {
    const { productData } = this.props;
    if (productData.ProductListings[0].DiscountPercent > 0) {
      return <div className="ps-product__badge">
        <span>{Math.round(productData.ProductListings[0].DiscountPercent)}</span>
        {"%"}
      </div>
    }
  };

  renderAddButton = (row) => {
    const { productData } = this.props;
    const { selectedLanguageData, cartData } = this.props.app;

    let quantity = 0;
    let itemId = null;
    let packingSize = null;
    console.log("row", cartData);
    if (cartData && cartData.CartItemViewModels) {
      cartData.CartItemViewModels &&
        cartData.CartItemViewModels.forEach((item) => {
          if (item.Id === row.ProductId && row.ProductListingId == item.ListingId) {
            quantity = item.Quantity;
            itemId = item.ItemId;
            packingSize = item.PackingSize;
          }
        });

      return <figure>
        {quantity > 0 ? (
          <React.Fragment>
            <div className="form-group--number">
              <button
                className="up"
                onClick={() => this.handleIncreaseItemQty(row,
                  itemId,
                  quantity,
                  packingSize)}
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

              <div className="form-group--number pointer">
                <input
                  onClick={() => this.handleAddItemToCart(row)}
                  className="form-control pointer"
                  type="text"
                  placeholder={languageLable(
                    selectedLanguageData,
                    "Add +"
                  )}
                  readOnly
                />
              </div>
            }
          </React.Fragment>
        )}
      </figure>;
    } else {
      return <figure>
        {quantity > 0 ? (
          <React.Fragment>
            <div className="form-group--number">
              <button
                className="up"
                onClick={() => this.handleIncreaseItemQty(row,
                  itemId,
                  quantity,
                  packingSize)}
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

              <div className="form-group--number pointer">
                <input
                  onClick={() => this.handleAddItemToCart(row)}
                  className="form-control pointer"
                  type="text"
                  placeholder={languageLable(
                    selectedLanguageData,
                    "Add +"
                  )}
                  readOnly
                />
              </div>
            }
          </React.Fragment>
        )}
      </figure>;
    }
  }

  renderStockAvailable = () => {
    const { selectedLanguageData } = this.props.app;
    const { productData } = this.props;

    const canOrder =
      this.props.auth &&
        this.props.auth.userData &&
        this.props.auth.userData.can_order === "true"
        ? true
        : false;
    let stockis = this.state.availableStock;

    if (canOrder && productData.ProductListings && productData.ProductListings.length > 0) {
      if (stockis > 0) {
        return <p>{languageLable(selectedLanguageData, "Available Stock :")} {stockis}</p>
      } else {
        return <p>{languageLable(selectedLanguageData, "Available Stock :")} {"0"}</p>
      }
    } else {
      return <p>{languageLable(selectedLanguageData, "Available Stock :")} {"---"}</p>
    }
  }

  handleLoyaltyProductPoint = async () => {
    setTimeout(() => {
      let psku = localStorage.getItem('@sku');
      console.log("psku>>>>", psku)

      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch(`https://loyaltyuat.biotech.archisys.biz/api/GetLoyaltyPoint?productSku=${psku}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log("LOYALTY Product Points...:", result)
          this.setState({
            loyaltypoint: result.data.points
          })
        }
        )
        .catch(error => console.log('error', error));
    }, 1000)


  }


  render() {

    const { productData } = this.props;

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

    if (productData.ProductListings) {
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

    const currencySetting = localStorage.getItem('currency');

    if (this.state.selectedOfferPrice > 0 && this.state.customFieldDataUSDValue != "") {
      var oneUSD = parseFloat(this.state.selectedOfferPrice / this.state.customFieldDataUSDValue).toFixed(2)
    }


    return (
      <div className="ps-product__info">
        <header >
          <h1>{productData.ProductDetails[0].Name}</h1>
          <div className="ps-product__meta">
            {/* <p>Brand:<a className="ml-2 text-capitalize" href="/shop">{productData.BrandName}</a></p> */}
            {/* <div className="ps-product__rating">
              <Rating />
              <span>(278 review)</span>
            </div> */}
          </div>
          <h4 className="ps-product__price">{languageLable(selectedLanguageData, "")}{currencySetting ? currencySetting : "₹ "}{this.state.selectedOfferPrice}</h4>
        </header>

        <div className="ps-product__desc" x>
          {/* <p>Sold By : <a href="/shop"><strong>{productData.BrandName}</strong></a></p> */}
          <p
            dangerouslySetInnerHTML={{
              __html: languageLable(
                selectedLanguageData,
                productData.ProductDescription
              )
            }}
          ></p>

          <p>
            {this.renderPackingSize()}
          </p>

          {/* {this.renderStockAvailable()} */}

          {(this.state.customFieldDataUSDValue != "") && (oneUSD != "") && (this.state.customFieldDataUSD != "") ?
            <>
              <p>
                1 {this.state.customFieldDataUSD} : {currencySetting} {oneUSD}
              </p>
              <p>
                Price in {this.state.customFieldDataUSD} : $ {parseFloat(this.state.customFieldDataUSDValue).toFixed(2)}
              </p>
            </> : <></>
          }

          {/* {this.state.customFieldData.length > 0 ? (
            <p>
              Conversion Rate :

              {JSON.parse(this.state.customFieldData).map((item, index) => {
                return (
                  <span> {item.Value}</span>
                )
              })}
            </p>
          ) : (<></>)} */}

          <div className="mb-20">
            <KycStrip />
            {this.state.loyaltypoint > 0 ? (
              <button style={{ background: "#2C5662", color: "#fff", padding: "5px 10px 5px", border: "0px", borderRadius: 8 }}>
                {languageLable(selectedLanguageData, this.state.loyaltypoint)} {languageLable(selectedLanguageData, "Loyalty Points")}
              </button>
            ) : (
              <></>
            )}
          </div>
          {canOrder && (
            <div className="mb-20">{this.getCartButton(canOrder, row)}</div>
          )}
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
              this.renderAddButton(row)
            )}

          </div>
        </React.Fragment>
      );
    } else {
      return "---";
    }
  };

  addProductEnquiry = (row) => {
    const { selectedLanguageData } = this.props.app;

    api
      .get(`AddProductEnquiry?ListingId=${row.ProductListingId}`)
      .then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          notification.success({
            message: "Success",
            description: languageLable(
              selectedLanguageData,
              "We will notify you once product is available."
            ),
          });
        }
      });
  };
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(InformationDefault);
