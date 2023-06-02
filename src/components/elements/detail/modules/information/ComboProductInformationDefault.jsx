import React, { Component } from "react";
import { Table } from "antd";
import { connect } from "react-redux";
import { notification } from "antd";
import API from "api/api";
import { languageLable } from "utilities/helpers";
import { Style } from "@material-ui/icons";

var api;
class ComboProductInformationDefault extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      quantity: 0,
      selectedVariant: null,
      price: null,
      isValidQuantity: false,
    };
  }

  handleIncreaseItemQty = (row) => {
    let productQty = this.props.selectedQuantity[row.ProductId]
      ? this.props.selectedQuantity[row.ProductId]
      : 0;

    let data = {
      row: row,
      productQty: productQty,
      comboProductId: this.props.comboProductId,
      isFirstRation: this.props.isFirstRation,
    };

    this.props.handleIncreaseItemQty(data);

    this.handleValidSelectedQuantity();
  };

  handleDecreaseItemQty = (row) => {
    let productQty = this.props.selectedQuantity[row.ProductId]
      ? this.props.selectedQuantity[row.ProductId]
      : 0;

    let data = {
      row: row,
      productQty: productQty,
      comboProductId: this.props.comboProductId,
      isFirstRation: this.props.isFirstRation,
    };

    this.props.handleDecreseItemQty(data);

    this.handleValidSelectedQuantity();
  };

  handleValidSelectedQuantity = () => {
    let requiredQuantity = 0;
    if (this.props.isFirstRation) {
      requiredQuantity = parseFloat(this.props.selectedProductRation);
    } else {
      requiredQuantity =
        parseFloat(this.props.firstProductRation) *
        parseFloat(this.props.selectedProductRation);
    }

    let selectedQuantity = 0;
    Object.keys(this.props.selectedQuantity).forEach((item) => {
      // REMOVE THE PRODUCT_ID_ROW DATA FORM LIST
      if (Number(this.props.selectedQuantity[item]) > 0) {
        selectedQuantity += Number(this.props.selectedQuantity[item]);
        if (
          selectedQuantity === requiredQuantity &&
          this.props.selectedQuantity[item] === selectedQuantity
        ) {
          this.setState({
            isValidQuantity: true,
          });
        } else {
          this.setState({
            isValidQuantity: false,
          });
        }
      }
    });
  };

  render() {
    const { productData } = this.props;
    const { selectedLanguageData } = this.props.app;
    const currencySetting = (localStorage.getItem('fetchcurrency'));
    
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
      columns.push({
        title: languageLable(selectedLanguageData,"Available Stock"),
        dataIndex: "Availability",
        key: "Available Stock",
      });

      // Price
      columns.push({
        title: languageLable(selectedLanguageData,"Price"),
        dataIndex: "",
        key: "Price",
        render: (row) => {
          return (
            <div className="price">
              {currencySetting && currencySetting.Currency} {row.Price}{" "}
              {row.DiscountPercent > 0 && <s>{row.MaxRetailPrice}</s>}
            </div>
          );
        },
      });

      // Action
      columns.push({
        title: languageLable(selectedLanguageData,"Action"),
        dataIndex: "",
        key: "Cart",
        render: (row) => this.getCartButton(canOrder, row),
      });
    }

    const attributeData = [];
    if (productData.Attributes && productData.ProductDetailViews) {
      productData.ProductDetailViews.forEach((detailsAttribute) => {
        // if ProductListing is available than show the record
        if (detailsAttribute.ProductListing) {
          let attributes = {};
          detailsAttribute.Attributes.forEach((item) => {
            attributes[item.attribute] = item.text;
          });

          attributes["PackingSize"] =
            detailsAttribute.ProductListing &&
            detailsAttribute.ProductListing.PackingSize;
          if (detailsAttribute.ProductListing && canOrder) {
            attributes["ProductId"] = detailsAttribute.ProductListing.ProductId;
            attributes["key"] = detailsAttribute.ProductListing.ProductId;
            if (this.props.auth && this.props.auth.isLoggedIn) {
              // Product Not availble set notify button
              if (detailsAttribute.ProductListing.Availability !== "Enquiry") {
                attributes["Availability"] =
                  detailsAttribute.ProductListing.Availability === "Unlimited"
                    ? detailsAttribute.ProductListing.Availability
                    : detailsAttribute.ProductListing.Quantity;

                attributes["Price"] =
                  detailsAttribute.ProductListing.OfferPrice &&
                  detailsAttribute.ProductListing.OfferPrice.toFixed(2);

                attributes["MaxRetailPrice"] =
                  detailsAttribute.ProductListing.MaxRetailPrice &&
                  detailsAttribute.ProductListing.MaxRetailPrice.toFixed(2);

                attributes["DiscountPercent"] =
                  detailsAttribute.ProductListing.DiscountPercent &&
                  detailsAttribute.ProductListing.DiscountPercent.toFixed(2);
              } else {
                attributes["Availability"] = "Enquiry";
                attributes["Price"] = "---";
                attributes["ProductListingId"] =
                  detailsAttribute.ProductListing.Id;
              }
            }
          } else {
            attributes["ProductId"] = null;
            attributes["key"] = Math.random();
            attributes["Availability"] = "---";
            attributes["Price"] = "---";
          }
          attributeData.push(attributes);
        }
      });
    }

    return (
      <div className="ps-product__info">
        
        <h1>{productData.ProductName}</h1>
        <div className="ps-product__desc">
          <p
            dangerouslySetInnerHTML={{ __html:  languageLable(
              selectedLanguageData, productData.ProductDescription) }}
          ></p>
          
          {/*<ul className="ps-list--dot">
            <li>{productData.ProductSummary}</li>
          </ul>*/}
          {!this.state.isValidQuantity && (
            <p className="text-danger">
              {!this.props.isFirstRation ? (
                <React.Fragment>
                  You have to select&nbsp;
                  {parseFloat(this.props.firstProductRation) *
                    parseFloat(this.props.selectedProductRation)}{" "}
                  quantity.
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {/*You have to select {this.props.selectedProductRation}{" "}
                  quantity.*/}
                </React.Fragment>
              )}
            </p>
          )}
        </div>
        <div className="ps-product-attibute">
          <Table
            dataSource={attributeData}
            columns={columns}
            pagination={
              attributeData && attributeData.length > 10 ? true : false
            }
          />
        </div>
      </div>
    );
  }

  getCartButton = (canOrder, row) => {
    if (
      this.props.auth &&
      this.props.auth.isLoggedIn &&
      canOrder &&
      row.ProductId
    ) {
      let quantity = this.props.selectedQuantity[row.ProductId]
        ? this.props.selectedQuantity[row.ProductId]
        : 0;

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
                    placeholder={"Notify Me"}
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
                        onClick={() => this.handleDecreaseItemQty(row)}
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
              selectedLanguageData,"We will notify you once product is available."),
          });
        }
      });
  };
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(ComboProductInformationDefault);
