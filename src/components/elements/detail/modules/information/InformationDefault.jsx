
import React, { Component } from "react";
import { Table, notification, Select } from "antd";
import { connect } from "react-redux";
import ModuleProductDetailDescription from "components/elements/detail/modules/elements/ModuleProductDetailDescription";
import { languageLable } from "utilities/helpers";
import API from "api/api";
import LoadingOverlay from 'react-loading-overlay';

const { Option } = Select;
var api;
class InformationDefault extends Component {

  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      quantity: 0,
      selectedVariant: null,
      price: null,
      productAttributeValue: null, // SET THE PRODUCT DATA INTO STATE FOR MANAGING THE ATTRIBUTE
      loyaltypoint: 0,
    };
  }

  componentDidMount = () => {
    this.setState({
      productAttributeValue: this.props.productData,
    });
    this.handleLoyaltyProductPoint();
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
      productId: row.ProductId,
      businessId: businessId,
      businessLocationId: locationId,
      listingId: row.ProductListingId,
      quantity: row.PackingSize,
      amount: row.Price,
      offerAmount: row.Price,
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

  handleIncreaseItemQty = (row, itemId, quantity, packingSize) => {
    if (row && itemId) {
      if (quantity > 0) {
        // Update
        api
          .post(
            `QuantityUpdate?itemId=${itemId}&quantity=${1
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

  handleDecreaseItemQty = (row, itemId, quantity, packingSize) => {
    if (row && itemId) {
      if (quantity > packingSize) {
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

  onAttributeSelectionChange = (id, name) => {
    this.props.onAttributeSelectionChange(id, name);
  };

  prepareAttributeOption = () => {
    const productAttributeValue = this.props.allProductData;
    console.log(this.props.allProductData);
    return (
      <div className="attribute-container">
        {productAttributeValue.Attributes &&
          productAttributeValue.Attributes.map((item, index) => {
            const options =
              productAttributeValue.AttributeValues &&
              productAttributeValue.AttributeValues.filter(
                (value) => value.attributeid === item.Id
              );
            console.log(options);
            return (
              <div className="attribute">
                <div className="title-container">
                  <strong>{item.Name}</strong>
                </div>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder={`Select ${item.Name}`}
                  optionFilterProp="children"
                  onChange={(id) =>
                    this.onAttributeSelectionChange(id, item.Name)
                  }
                >
                  <Option value={null}>{`Please select`}</Option>
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

  handleLoyaltyProductPoint = async () => {

    setTimeout(() => {
      //let gsku = JSON.parse(localStorage.getItem('@skugroup'));
      let gsku = localStorage.getItem('@skugroup');
      console.log("gsku>>>>", gsku)

      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      //gsku.map(item =>{
      fetch(`https://loyaltyuat.biotech.archisys.biz/api/GetLoyaltyPoint?productSku=${gsku}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          //console.log("LOYALTY Product Points...:", result)
          this.setState({
            loyaltypoint: result.data.points
          })
        }
        )
        .catch(error => console.log('error', error));
      //}) 
    }, 1000)
  }


  render() {
    const { productData } = this.props;
    const { selectedLanguageData } = this.props.app;
    const currencySetting = localStorage.getItem('currency');
    console.log("currencySetting: ", currencySetting);
    const canOrder =
      this.props.auth &&
        this.props.auth.userData &&
        this.props.auth.userData.can_order === "true"
        ? true
        : false;

    const columns = [];
    if (productData && productData.Attributes) {
      productData.Attributes.forEach((item) => {
        columns.push({
          title: item.Name,
          dataIndex: item.Name,
          key: item.Id,
        });
      });
    }

    if (canOrder) {
      // Stock
      // columns.push({
      //   title: languageLable(selectedLanguageData, "Available Stock"),
      //   dataIndex: "Availability",
      //   key: "Available Stock",
      // });

      // Price
      columns.push({
        title: languageLable(selectedLanguageData, "Price"),
        dataIndex: "",
        key: "Price",
        render: (row) => {
          return (
            <div className="price">
              {languageLable(selectedLanguageData, "")}{currencySetting ? currencySetting : "₹ "}{row.Price}
              {row.DiscountPercent > 0 && <s>{row.MaxRetailPrice}</s>}
            </div>
          );
        },
      });

      // Action
      columns.push({
        title: languageLable(selectedLanguageData, "Action"),
        dataIndex: "",
        key: "Cart",
        render: (row) => this.getCartButton(canOrder, row),
      });

    }

    const attributeData = [];
    if (productData.Attributes && productData.ProductDetailViews) {

      productData.ProductDetailViews.forEach((detailsAttribute) => {

        // if ProductListing is available than show the record
        if (detailsAttribute.ProductListings.length > 0) {
          let attributes = {};
          detailsAttribute.Attributes.forEach((item) => {
            attributes[item.attribute] = item.text;
          });

          detailsAttribute.ProductListings.forEach((ProductListing) => {
            attributes["PackingSize"] =
              ProductListing &&
              ProductListing.PackingSize;
            if (ProductListing && canOrder) {
              attributes["ProductId"] = ProductListing.ProductId;
              attributes["key"] = ProductListing.ProductId;
              if (this.props.auth && this.props.auth.isLoggedIn) {
                // Product Not availble set notify button
                if (ProductListing.Availability !== "Enquiry") {
                  attributes["Availability"] =
                    ProductListing.Availability === "Unlimited"
                      ? ProductListing.Availability
                      : ProductListing.Quantity > 0
                        ? ProductListing.Quantity
                        : 0;

                  attributes["Price"] =
                    ProductListing.OfferPrice &&
                    ProductListing.OfferPrice.toFixed(2);

                  attributes["MaxRetailPrice"] =
                    ProductListing.MaxRetailPrice &&
                    ProductListing.MaxRetailPrice.toFixed(2);

                  attributes["DiscountPercent"] =
                    ProductListing.DiscountPercent &&
                    ProductListing.DiscountPercent.toFixed(2);
                  attributes["ProductListingId"] = ProductListing.Id;
                } else {
                  attributes["Availability"] = "Enquiry";
                  attributes["Price"] = "---";
                  attributes["ProductListingId"] = ProductListing.Id;
                }
              }
            } else {
              attributes["ProductId"] = "---";
              attributes["key"] = Math.random();
              attributes["Availability"] = "---";
              attributes["Price"] = "---";
            }
          });



          attributeData.push(attributes);
        }
      });
    }

    const productAttributeValue = this.props.productData;

    const ProductDetailViews = productData.ProductDetailViews
    console.log("ProductDetailViews.....>>>", ProductDetailViews)

    var ProductDetailViewsFilterData = []
    var CustomFieldData = []
    var customFieldDataUSD = ''
    var customFieldDataUSDValue = ''
    var oneUSD = ''

    if (ProductDetailViews != undefined) {
      ProductDetailViewsFilterData = ProductDetailViews.filter((i) => {
        return i.ProductListings.length > 0
      })
      console.log("ProductDetailViewsFilterData....>>>", ProductDetailViewsFilterData)

      if (ProductDetailViewsFilterData.length > 0) {
        if (ProductDetailViewsFilterData[0].ProductListings[0].CustomFieldData != undefined) {
          CustomFieldData = ProductDetailViewsFilterData[0].ProductListings[0].CustomFieldData
          console.log("CustomFieldData.....", CustomFieldData)
          var datacustom = JSON.parse(CustomFieldData)

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

          customFieldDataUSD = data[0].Value
          customFieldDataUSDValue = parseFloat(data1[0].Value).toFixed(2)

          if (ProductDetailViewsFilterData[0].ProductListings[0].MaxRetailPrice != undefined) {
            oneUSD = parseFloat(ProductDetailViewsFilterData[0].ProductListings[0].MaxRetailPrice / customFieldDataUSDValue).toFixed(2)
          }

        }
      }
    }

    return (
      <div className="ps-product__info" >

        {/* <div class="row" > */}
        <h1 >{productData.ProductName}</h1>
        <div className="col-lg-7">
          <ModuleProductDetailDescription product={productData} selectedLanguageData={selectedLanguageData} />
        </div>

        {(customFieldDataUSDValue != "") && (oneUSD != "") && (customFieldDataUSD != "") ?
          <>
            <div className="col-lg-7" style={{ marginTop: -15 }}>
              1 {customFieldDataUSD} : {currencySetting} {oneUSD}
            </div>

            <div className="col-lg-7" style={{marginTop:5}}>
              <span>Price in {customFieldDataUSD} : </span>
              <span>$ {customFieldDataUSDValue}</span>
            </div>
          </> : <></>
        }

        <div className="col-lg-7" >
          {this.state.loyaltypoint > 0 ? (
            <div style={{marginTop:5}}>
              <button style={{ background: "#2C5662", color: "#fff", padding: "5px 10px 5px", border: "0px", borderRadius: 8 }}>
                {languageLable(selectedLanguageData, this.state.loyaltypoint)} {languageLable(selectedLanguageData, "Loyalty Points")}
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>


        {/* </div> */}


        <div className="ps-product__desc" style={{ marginTop: 5 }} />

        <div className="ps-product-attibute">
          {productAttributeValue &&
            productAttributeValue.Attributes &&
            productAttributeValue.Attributes.length > 1 && (
              <div className="attribute-wrapper">
                {this.prepareAttributeOption()}
                <div className="search-container">
                  <button
                    className="ps-btn"
                    onClick={this.props.getSelectedAttributeList}
                  >
                    {languageLable(selectedLanguageData, "Search")}
                  </button>

                </div>
              </div>
            )}

          <Table
            dataSource={attributeData}
            columns={columns}
            //size="middle"
            pagination={
              attributeData && attributeData.length > 10 ? true : false
            }
          />
        </div>
      </div>
    )
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
                      /*row.Availability !== "Unlimited" &&
                    Number(row.Availability) === 0 ? (
                      <div className="form-group--number pointer">
                        ---
                      </div>
                    ) : ( */
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

