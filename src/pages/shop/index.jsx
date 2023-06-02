import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Spin } from "antd";
import FooterDefault from "components/shared/footers/FooterDefault";
import HeaderDefault from "components/shared/headers/HeaderDefault";
import LayoutShop from "components/partials/shop/LayoutShop";
import BreadCrumb from "components/elements/BreadCrumb";
import HeaderMobile from "components/shared/headers/HeaderMobile";
import NavigationList from "components/shared/navigation/NavigationList";
import ShopWidget from "components/partials/shop/modules/ShopWidget";
import Api from "api/api";
import { COMBO_PRODUCT_CATEGORY, APP_SETTINGS} from "utilities/constants";

var api;
class ShopDefaultPage extends React.Component {
  constructor(props) {
    super(props);
    api = new Api();
    this.state = {
      productList: [],
      loading: true,
      isCombo: false,
    };
  }

  componentDidMount = () => {
    const currentUrl = this.props.location.pathname.split("/");
    this.getSearchProductGrouped(currentUrl[2]);
  };

  componentDidUpdate = (prevProps) => {
    const previousUrl = prevProps.location.pathname.split("/");
    const currentUrl = this.props.location.pathname.split("/");
    if (previousUrl[2] !== currentUrl[2]) {
      this.setState({
        loading: true,
      });
      this.getSearchProductGrouped(currentUrl[2]);
    }

    // Once the get the data using ip and check with login condition
    if (prevProps.auth && prevProps.auth.ipData !== this.props.auth.ipData) {
      this.getSearchProductGrouped(currentUrl[2]);
    }
  };

  getSearchProductGrouped = (categoryId) => {
    let locationId;
    let businessId;

    if (this.props.auth && this.props.auth.isLoggedIn) {
      locationId =
        this.props.auth.defaultAddress &&
        this.props.auth.defaultAddress.BusinessCustomerAddressMapping
          .LocationId;
      businessId =
        this.props.auth &&
        this.props.auth.defaultAddress &&
        this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
        this.props.auth.defaultAddress.BusinessCustomerAddressMapping
          .BusinessId;
    } else {
      locationId = this.props.auth.ipData && this.props.auth.ipData.LocationId;
      businessId = this.props.auth.ipData && this.props.auth.ipData.BusinessId;
    }

    if (categoryId && locationId) {
      if (categoryId === COMBO_PRODUCT_CATEGORY && businessId) {
        api
          .get(`GetComboProductByBusinessId?BusinessId=${businessId}`)
          .then((response) => {
            if (response.StatusCode === 200 && response.Result) {
              this.setState({
                productList: response.Result,
                loading: false,
                isCombo: true,
              });
            }
          });
      } else {
        api
          .get(
            `GetProductOrGroupsSearchAndFilter?categoryId=${categoryId}&locationId=${locationId}&isGrouped=${APP_SETTINGS.Grouping}`
          )
          .then((response) => {
              if (response.StatusCode === 200 && response.Result) {
              this.setState({
                productList: response.Result ? response.Result.products.Results : [],
                loading: false,
                isCombo: false,
              });
            }
          });
      }
    }
  };

  render() {
    const breadCrumb = [
      {
        text: "Home",
        url: "/",
      },
      {
        text: "Products",
      },
    ];
    return (
      <div className="site-content">
        <HeaderDefault />
        <HeaderMobile />
        <NavigationList />
        <div className="ps-page--shop">
          <BreadCrumb breacrumb={breadCrumb} layout="fullwidth" />
          <div className="ps-container">
            <div className="ps-layout--shop">
              <ShopWidget />
              <div className="ps-layout__right">
                <Spin spinning={this.state.loading}>
                  <LayoutShop
                    productList={this.state.productList}
                    isCombo={this.state.isCombo}
                  />
                </Spin>
              </div>
            </div>
          </div>
        </div>
        <FooterDefault />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(ShopDefaultPage));
