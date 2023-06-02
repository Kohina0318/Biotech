import React from "react";
import { connect } from "react-redux";
import FooterDefault from "components/shared/footers/FooterDefault";
import ProductDetailFullwidth from "components/elements/detail/ProductDetailFullwidth";
import NavigationList from "components/shared/navigation/NavigationList";
import BreadCrumb from "components/elements/BreadCrumb";
import HeaderDefault from "components/shared/headers/HeaderDefault";
import HeaderMobile from "components/shared/headers/HeaderMobile";
import { Tabs, Spin, notification } from "antd";
import Api from "api/api";
import ComboProductThumbnailDefault from "components/elements/detail/modules/thumbnail/ComboProductThumbnailDefault";
import ComboProductData from "components/elements/detail/modules/information/ComboProductData";
import { languageLable } from "utilities/helpers";
import { APP_SETTINGS } from "utilities/constants";

const { TabPane } = Tabs;
var tempArr = []

var api;
class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    api = new Api();
    this.state = {
      productData: null,
      allProductData: null,
      mediaBaseURL: null,
      comboProduct: {
        comboData: {},
        comboProductData: {
          ProductGroupId_1: null,
          ProductGroupId_2: null,
        },
        ProductGroupId_1_Quantity: {},
        ProductGroupId_2_Quantity: {},
      },
      isComboProduct: false, // Default
      loading: true,
      productType: null,
      selectedAttribute: {},
    };
  }

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.auth &&
      prevProps.auth.appDefaultSetting &&
      prevProps.auth.appDefaultSetting.ImageUrl &&
      this.state.mediaBaseURL === null
    ) {
      this.setState({
        mediaBaseURL: this.props.auth.appDefaultSetting.ImageUrl,
      });
    }

    // Once the get the data using ip and check with login condition
    if (prevProps.auth && prevProps.auth.ipData !== this.props.auth.ipData) {
      this.getProductDetails();
    }
  };

  getProductDetails = () => {
    const url = window.location.pathname.split("/");
    const productId = url[2];
    const productType = url[3];

    // SET PRODUCT TYPE
    this.setState({
      productType: productType,
    });

    let locationId;
    if (this.props.auth.isLoggedIn) {
      locationId =
        this.props.auth.defaultAddress &&
        this.props.auth.defaultAddress.BusinessCustomerAddressMapping
          .LocationId;
    } else {
      locationId = this.props.auth.ipData && this.props.auth.ipData.LocationId;
    }

    if (productType !== "combo") {
      // alert(productId)
      // alert(locationId)

      // Grouped and Single product
      let apiUrl;
      if (productType === "Grouped") {
        apiUrl = `GetProductGroupByIdNew?id=${productId}&locationId=${locationId}`;
      } else {
        apiUrl = `GetProductById?id=${productId}&locationId=${locationId}`;
      }

      if (productId && locationId) {
        api.get(apiUrl).then((response) => {
          if (response.StatusCode === 200 && response.Result) {
            this.setState({
              productData: response.Result,
              allProductData: response.Result,
              isComboProduct: false,
              loading: false,
            });

            // console.log("Group Product",response.Result.ProductDetailViews)
            //alert(JSON.stringify(response.sku))
            // let sku = JSON.stringify(response.result.sku)

            if (productType != "Grouped") {
              localStorage.setItem('@sku', response.Result.Sku)
            }
            else {
              if (response.Result.ProductDetailViews != undefined) {
                localStorage.setItem('@skugroup', response.Result.ProductDetailViews[0].Sku)
              }
              //   response.Result.ProductDetailViews.map(item=>{
              //    tempArr.push(item.Sku)
              //   })
              //  localStorage.setItem('@skugroup',JSON.stringify(tempArr))
            }
          }
        });
      }
    } else {
      // Combo product
      api.get(`GetComboProductById?id=${productId}`).then((res) => {
        if (res.StatusCode === 200 && res.Result) {
          let comboProduct = {};
          comboProduct.comboData = res.Result;

          let locationId;
          if (this.props.auth.isLoggedIn) {
            locationId =
              this.props.auth.defaultAddress &&
              this.props.auth.defaultAddress.BusinessCustomerAddressMapping
                .LocationId;
          } else {
            locationId =
              this.props.auth.ipData && this.props.auth.ipData.LocationId;
          }

          comboProduct.comboProductData = {};
          if (
            comboProduct.comboData &&
            comboProduct.comboData.ProductGroupId_1
          ) {
            api
              .get(
                `GetProductGroupByIdNew?id=${comboProduct.comboData.ProductGroupId_1}&locationId=${locationId}`
              )
              .then((res) => {
                if (res.StatusCode === 200 && res.Result) {
                  this.setState(
                    {
                      comboProduct: {
                        comboData: comboProduct.comboData,
                        comboProductData: {
                          ...this.state.comboProduct.comboProductData,
                          ProductGroupId_1: res.Result,
                        },
                      },
                      loading: false,
                      isComboProduct: true,
                      ProductGroupId_1_Quantity: {},
                    },
                    () => {
                      this.onTabChange("ProductGroupId_1");
                    }
                  );
                }
              });
          }

          if (
            comboProduct.comboData &&
            comboProduct.comboData.ProductGroupId_2
          ) {
            api
              .get(
                `GetProductGroupByIdNew?id=${comboProduct.comboData.ProductGroupId_2}&locationId=${locationId}`
              )
              .then((res) => {
                if (res.StatusCode === 200 && res.Result) {
                  this.setState({
                    comboProduct: {
                      comboData: comboProduct.comboData,
                      comboProductData: {
                        ...this.state.comboProduct.comboProductData,
                        ProductGroupId_2: res.Result,
                      },
                    },
                    loading: false,
                    ProductGroupId_2_Quantity: {},
                  });
                }
              });
          }
          if (
            comboProduct.comboData &&
            comboProduct.comboData.ProductGroupId_3
          ) {
            api
              .get(
                `GetProductGroupByIdNew?id=${comboProduct.comboData.ProductGroupId_3}&locationId=${locationId}`
              )
              .then((res) => {
                if (res.StatusCode === 200 && res.Result) {
                  this.setState({
                    comboProduct: {
                      comboData: comboProduct.comboData,
                      comboProductData: {
                        ...this.state.comboProduct.comboProductData,
                        ProductGroupId_3: res.Result,
                      },
                    },
                    loading: false,
                    ProductGroupId_3_Quantity: {},
                  });
                }
              });
          }
        }
      });
    }
  };

  onTabChange = (key) => {
    const productData = this.state.comboProduct.comboProductData[key];
    this.setState({
      productData: productData,
      allProductData: productData
    });
  };

  render() {
    const { productData, comboProduct, isComboProduct, allProductData } = this.state;
    const canOrder =
      this.props.auth &&
        this.props.auth.userData &&
        this.props.auth.userData.can_order === "true"
        ? true
        : false;

    const breadCrumb = [
      {
        text: "Home",
        url: "/",
      },
      !isComboProduct && {
        text: productData ? productData.CategoryName : "",
        url:
          productData && productData.CategoryId
            ? `/search-product/${productData.CategoryId}`
            : "/",
      },
      {
        text: isComboProduct
          ? "Combo Product"
          : productData && productData.ProductName,
      },
    ];
    const { selectedLanguageData } = this.props.app;

    return (
      <div className="layout--product">
        <HeaderDefault />
        <HeaderMobile />
        <NavigationList />
        <BreadCrumb breacrumb={breadCrumb} layout="fullwidth" />

        <div className="ps-page--product">
          <div className="ps-container">
            <Spin spinning={this.state.loading}>
              <div className="ps-page__container">
                <div className="ps-page__left">

                  {isComboProduct ? (
                    <React.Fragment>

                      <div className="combo-product-details">
                        <div className="ps-product--detail ps-product--fullwidth">
                          <div className="ps-product__header">

                            <ComboProductThumbnailDefault
                              comboProduct={comboProduct.comboData}
                              mediaBaseURL={this.state.mediaBaseURL}
                            />

                            <div className="product-combo-info">

                              <ComboProductData
                                comboProduct={comboProduct.comboData}
                              />
                              {canOrder && (
                                <>
                                  <div className="form-group">
                                    <button
                                      type="submit"
                                      className="ps-btn"
                                      onClick={() => this.addToCartCombo()}
                                    >
                                      {languageLable(
                                        selectedLanguageData,
                                        "Add to Cart"
                                      )}
                                    </button>
                                  </div>
                                </>
                              )}

                            </div>

                          </div>


                        </div>
                      </div>
                      <Tabs
                        centered
                        defaultActiveKey="ProductGroupId_1"
                        onChange={(key) => this.onTabChange(key)}
                      >
                        {Object.keys(comboProduct.comboProductData).map(
                          (item, index) => (
                            <TabPane
                              tab={
                                comboProduct.comboData &&
                                comboProduct.comboData[
                                `ProductGroupName${[index + 1]}`
                                ]
                              }
                              key={item}
                            >
                              <ProductDetailFullwidth
                                productData={productData}
                                allProductData={allProductData}
                                mediaBaseURL={this.state.mediaBaseURL}
                                isComboProduct={true}
                                selectedProductRation={
                                  comboProduct.comboData[`Ratio_${[index + 1]}`]
                                }
                                comboProductId={`ProductGroupId_${[index + 1]}`}
                                firstProductRation={
                                  comboProduct.comboData[`Ratio_1`]
                                }
                                isFirstRation={index === 0 ? true : false}
                                selectedQuantity={
                                  this.state[
                                  `ProductGroupId_${[index + 1]}_Quantity`
                                  ]
                                }
                                handleIncreaseItemQty={
                                  this.handleIncreaseItemQty
                                }
                                handleDecreseItemQty={this.handleDecreseItemQty}
                              />
                            </TabPane>
                          )
                        )}
                      </Tabs>
                    </React.Fragment>
                  ) : (<>

                    <ProductDetailFullwidth
                      productType={this.state.productType}
                      productData={productData}
                      allProductData={allProductData}
                      mediaBaseURL={this.state.mediaBaseURL}
                      onAttributeSelectionChange={
                        this.onAttributeSelectionChange
                      }
                      getSelectedAttributeList={this.getSelectedAttributeList}
                    />
                  </>
                  )}
                </div>
              </div>
            </Spin>
          </div>
        </div>

        <FooterDefault />
      </div>
    );
  }

  onAttributeSelectionChange = (attributeId, name) => {
    let selectedAttribute = { ...this.state.selectedAttribute };

    if (attributeId) {
      selectedAttribute[name] = attributeId;
    } else {
      delete selectedAttribute[name];
    }

    this.setState({
      selectedAttribute: selectedAttribute,
    });
  };

  getSelectedAttributeList = () => {
    let attributeIds = [];
    Object.keys(this.state.selectedAttribute).forEach((item) => {
      attributeIds.push(this.state.selectedAttribute[item]);
    });

    const locationId =
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping.LocationId;

    const url = window.location.href.split("/");
    const productId = url[4];

    if (attributeIds && productId && locationId) {
      const apiUrl = `GetListingByAttIds?groupId=${productId}&locationId=${locationId}`;

      // ENABLE THE LOADING
      this.setState({
        loading: true,
      });

      api
        .post(apiUrl, {
          data: attributeIds,
        })
        .then((response) => {
          if (response.StatusCode === 200 && response.Result) {
            this.setState({
              productData: response.Result,
              isComboProduct: false,
              loading: false,
            });
          }
        });
    }
  };

  addToCartCombo = () => {
    const { comboData } = this.state.comboProduct;
    const { selectedLanguageData } = this.props.app;

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

    let productOneRequiredQty = 0;
    let productTwoRequiredQty = 0;
    let productThreeRequiredQty = 0;

    let isProductOneValidSelectedQty = false;
    let isProductTwoValidSelectedQty = false;
    let isProductThreeValidSelectedQty = false;

    let selectedProductOneRow = null;
    let selectedProductTwoRow = null;
    let selectedProductThreeRow = null;

    let requiredTotalProductQuantity = 0;

    if (comboData.Ratio_1) {
      requiredTotalProductQuantity = Number(comboData.Ratio_1);
      productOneRequiredQty = Number(comboData.Ratio_1);
    }

    if (comboData.Ratio_2) {
      requiredTotalProductQuantity =
        Number(requiredTotalProductQuantity) +
        comboData.Ratio_1 * comboData.Ratio_2;
      productTwoRequiredQty = Number(comboData.Ratio_1 * comboData.Ratio_2);
    }

    if (comboData.Ratio_3) {
      requiredTotalProductQuantity =
        Number(requiredTotalProductQuantity) +
        comboData.Ratio_1 * comboData.Ratio_3;
      productThreeRequiredQty = Number(comboData.Ratio_1 * comboData.Ratio_3);
    }

    // PRODUCT ONE CALCULATION
    let productOneSelectedQuantity = 0;
    Object.keys(this.state.ProductGroupId_1_Quantity).forEach((itemKey) => {
      let itemValue = this.state.ProductGroupId_1_Quantity[itemKey];
      // REMOVE THE PRODUCT_ID_ROW DATA FORM LIST
      if (itemValue > 0) {
        productOneSelectedQuantity += Number(itemValue);
        if (
          productOneSelectedQuantity === productOneRequiredQty &&
          itemValue === productOneRequiredQty
        ) {
          isProductOneValidSelectedQty = true;
          selectedProductOneRow = this.state.ProductGroupId_1_Quantity[
            `${itemKey}_row`
          ];
        } else {
          isProductOneValidSelectedQty = false;
        }
      }
    });

    // PRODUCT TWO CALCULATION
    let productTwoSelectedQuantity = 0;
    Object.keys(this.state.ProductGroupId_2_Quantity).forEach((itemKey) => {
      let itemValue = this.state.ProductGroupId_2_Quantity[itemKey];
      // REMOVE THE PRODUCT_ID_ROW DATA FORM LIST
      if (itemValue > 0) {
        productTwoSelectedQuantity += Number(itemValue);
        if (
          productTwoSelectedQuantity === productTwoRequiredQty &&
          itemValue === productTwoRequiredQty
        ) {
          isProductTwoValidSelectedQty = true;
          selectedProductTwoRow = this.state.ProductGroupId_2_Quantity[
            `${itemKey}_row`
          ];
        } else {
          isProductTwoValidSelectedQty = false;
        }
      }
    });

    // PRODUCT THREE CALCULATION
    let productThreeSelectedQuantity = 0;
    if (this.state.ProductGroupId_3_Quantity) {
      Object.keys(this.state.ProductGroupId_3_Quantity).forEach((itemKey) => {
        let itemValue = this.state.ProductGroupId_3_Quantity[itemKey];
        // REMOVE THE PRODUCT_ID_ROW DATA FORM LIST
        if (itemValue > 0) {
          productThreeSelectedQuantity += Number(itemValue);
          if (
            productThreeSelectedQuantity === productThreeRequiredQty &&
            itemValue === productThreeRequiredQty
          ) {
            isProductThreeValidSelectedQty = true;
            selectedProductThreeRow = this.state.ProductGroupId_3_Quantity[
              `${itemKey}_row`
            ];
          } else {
            isProductThreeValidSelectedQty = false;
          }
        }
      });
    }

    // COMBO OF THREE PRODUCT
    if (this.state.ProductGroupId_3_Quantity) {
      if (
        isProductOneValidSelectedQty &&
        isProductTwoValidSelectedQty &&
        isProductThreeValidSelectedQty
      ) {
        let addToCart = [];
        if (selectedProductOneRow) {
          addToCart.push({
            productId: selectedProductOneRow.ProductId,
            businessId: businessId,
            businessLocationId: locationId,
            quantity: productOneRequiredQty,
            amount: selectedProductOneRow.Price,
            offerAmount: selectedProductOneRow.Price,
            offerId: "",
            comboId: comboData.Id,
          });
        }

        if (selectedProductTwoRow) {
          addToCart.push({
            productId: selectedProductTwoRow.ProductId,
            businessId: businessId,
            businessLocationId: locationId,
            quantity: productOneRequiredQty,
            amount: selectedProductTwoRow.Price,
            offerAmount: selectedProductTwoRow.Price,
            offerId: "",
            comboId: comboData.Id,
          });
        }

        if (selectedProductThreeRow) {
          addToCart.push({
            productId: selectedProductThreeRow.ProductId,
            businessId: businessId,
            businessLocationId: locationId,
            quantity: productOneRequiredQty,
            amount: selectedProductThreeRow.Price,
            offerAmount: selectedProductThreeRow.Price,
            offerId: "",
            comboId: comboData.Id,
          });
        }

        api
          .post(`AddItems`, {
            data: addToCart,
          })
          .then((res) => {
            if (res.StatusCode === 200 && res.Result) {
              notification.success({
                message: languageLable(
                  selectedLanguageData,
                  "Combo has been successfully added into cart."
                ),
              });
              this.props.dispatch({
                type: "FETCH_CART_DATA",
                cartData: res.Result,
              });
            }
          });
      } else {
        notification.info({
          message: languageLable(
            selectedLanguageData,
            "Please select necessary quantity of combo."
          ),
        });
      }
    } else {
      // COMBO OF TWO PRODUCT
      if (isProductOneValidSelectedQty && isProductTwoValidSelectedQty) {
        let addToCart = [];
        if (selectedProductOneRow) {
          addToCart.push({
            productId: selectedProductOneRow.ProductId,
            businessId: businessId,
            businessLocationId: locationId,
            quantity: productOneRequiredQty,
            amount: selectedProductOneRow.Price,
            offerAmount: selectedProductOneRow.Price,
            offerId: "",
            comboId: comboData.Id,
          });
        }

        if (selectedProductTwoRow) {
          addToCart.push({
            productId: selectedProductTwoRow.ProductId,
            businessId: businessId,
            businessLocationId: locationId,
            quantity: productOneRequiredQty,
            amount: selectedProductTwoRow.Price,
            offerAmount: selectedProductTwoRow.Price,
            offerId: "",
            comboId: comboData.Id,
          });
        }

        api
          .post(`AddItems`, {
            data: addToCart,
          })
          .then((res) => {
            if (res.StatusCode === 200 && res.Result) {
              notification.success({
                message: languageLable(
                  selectedLanguageData,
                  "Combo has been successfully added into cart."
                ),
              });
              this.props.dispatch({
                type: "FETCH_CART_DATA",
                cartData: res.Result,
              });
            }
          });
      } else {
        notification.info({
          message: languageLable(
            selectedLanguageData,
            "Please select necessary quantity of combo."
          ),
        });
      }
    }
  };

  handleIncreaseItemQty = (data) => {
    const { row, productQty, comboProductId, isFirstRation } = data;
    const comboProductQuantity = this.state[`${comboProductId}_Quantity`];
    const qty = parseInt(productQty) + parseInt(row.PackingSize);
    comboProductQuantity[row.ProductId] = qty;
    comboProductQuantity[`${row.ProductId}_row`] = row;

    this.setState(
      {
        [`${comboProductId}_Quantity`]: { ...comboProductQuantity },
      },
      () => {
        if (isFirstRation) this.handleFirstProductRatio(qty);
      }
    );
  };

  handleFirstProductRatio = (qty) => {
    this.setState({
      comboProduct: {
        ...this.state.comboProduct,
        comboData: {
          ...this.state.comboProduct.comboData,
          Ratio_1: qty,
        },
      },
    });
  };

  handleDecreseItemQty = (data) => {
    const { row, productQty, comboProductId, isFirstRation } = data;
    const comboProductQuantity = this.state[`${comboProductId}_Quantity`];
    const qty = parseInt(productQty) - parseInt(row.PackingSize);
    comboProductQuantity[row.ProductId] = qty;

    this.setState(
      {
        [`${comboProductId}_Quantity`]: { ...comboProductQuantity },
      },
      () => {
        if (isFirstRation && qty > 0) this.handleFirstProductRatio(qty);
      }
    );
  };
}

export default connect((state) => state)(ProductDetails);
