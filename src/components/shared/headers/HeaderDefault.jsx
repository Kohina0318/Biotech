import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import NavigationDefault from "../navigation/NavigationDefault";
import HeaderActions from "./modules/HeaderActions";
import SearchHeader from "./modules/SearchHeader";
import { stickyHeader } from "../../../utilities/common-helpers";
import API from "./../../../api/api";
import { parseJwt } from "../../../utilities/helpers";
import { SITE_URL, KYC_STATUS } from "../../../utilities/constants";
import { connect } from "react-redux";
import Menu from "components/elements/menu/Menu";
import axios from "axios";
import { APP_SETTINGS } from "utilities/constants";
import Logo from "../../../components/elements/common/Logo";
import { languageLable } from "utilities/helpers";
var api;

class HeaderDefault extends Component {
  constructor({ props }) {
    super(props);
    api = new API();
    this.state = {
      countries: [],
      defaultAddress: null,
    };
  }

  componentDidMount() {
    if (process.browser) {
      window.addEventListener("scroll", stickyHeader);
    }

    if (!localStorage.getItem("authToken")) {
      this.getAppFirstStart();
    } else {
      this.getAppDefault();
    }

    if (this.props.auth && this.props.auth.isLoggedIn) {
      this.getKycStatus();
    }

    //if (this.props.auth && this.props.auth.isLoggedIn) {
    this.fetchDefaultAddress();
    //} else {
    this.getCountries();
    //}
    this.getBusinessSettings();
    //this.getWebAppConfiguration();
  }

  getGeoInfo = () => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        if (response.data) {
          // Check with the country JSON if country name falls than update the same else default
          this.state.countries &&
            this.state.countries.map((country) => {
                if (country.name === response.data.country_name) {
                response.data.BusinessId = country.BusinessId
                  ? country.BusinessId
                    : "90fda418-1d43-4e9c-bafd-b9981cd33457";
                response.data.LocationId = country.LocationId
                  ? country.LocationId
                        : "6ee491c9-d539-4c7e-bc49-63c841b0354f";
              }
              return null;
            });

          this.props.dispatch({
            type: "FETCH_IP_DATA",
            ipData: response.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidUpdate = (preProps, preState) => {
    if (
      this.props.auth &&
      this.props.auth.isLoggedIn &&
      !this.props.auth.defaultAddress &&
      !this.props.auth.userData.anonymous &&
      !this.state.defaultAddress
    ) {
      this.getDefaultAddress();
    }

    if (
      this.props.auth &&
      this.props.auth.kycRequestData &&
      !this.props.auth.kycRequestData.Id &&
      this.state.defaultAddress
    ) {
      this.startMyKyc();
    }
  };

  getDefaultAddress = () => {
    const url = this.props.location.pathname.split("/");
    if (url[2] && url[2] !== "add-address") {
      api.get("GetMyDefaultAddress").then((response) => {
        if (!response || !response.Result) {
          if (APP_SETTINGS.isB2B) {
            this.props.history.push("/account/add-address");
          }
        } else {
          localStorage.setItem(
            "defaultAddress",
            JSON.stringify(response.Result)
          );
          this.props.dispatch({
            type: "DEFAULT_ADDRESS",
            defaultAddress: response.Result,
          });
          this.setState({
            defaultAddress: response.Result,
          });
        }
      });
    }
  };

  getCountries = () => {
    fetch(`${SITE_URL}json/countries_b.json`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState(
          {
            countries: json,
          },
          () => {
            // Fetch details from IP
            this.getGeoInfo();
          }
        );
        // use the json
        this.props.dispatch({
          type: "GET_COUNTRIES",
          countries: json,
        });
      });
  };

  getAppFirstStart = () => {
    api.post("AppFirstStart").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        localStorage.setItem("authToken", response.Result.Token);
        const tokenData = parseJwt(response.Result.Token);
        localStorage.setItem("userData", JSON.stringify(tokenData));

        this.props.dispatch({
          type: "APP_FIRST_START",
          authToken: response.Result.Token,
          userData: tokenData,
        });

        // GET THE DEFAULT VALUE
        this.getAppDefault();
        //this.getWebAppConfiguration();
      }
    });
  };

  getAppDefault = () => {
    api.get("GetDefaults").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.props.dispatch({
          type: "APP_DEFAULT",
          appDefaultSetting: response.Result,
        });
      }
    });
  };

  getBusinessSettings = (businessId) => {
      if (businessId) {
      api
        .get(`GetBusinessSettings?businessId=${businessId}`)
          .then((response) => {
              if (response.StatusCode === 200 && response.Result) {
            localStorage.setItem("currency", response.Result.Currency);
            localStorage.setItem("paymentProvider", response.Result.PaymentProvider);
            this.props.dispatch({
              type: "FETCH_CURRENCY",
                currencySetting: response.Result,
            });
          }
        });
    }
  };
  
  // getWebAppConfiguration = () => {
  //     api.get("GetAppConfiguration?webApp=true").then((response) => {
  //         if (response.StatusCode === 200 && response.Result) {
  //             this.props.dispatch({
  //                 type: "WebAPP_CONFIGURATION",
  //                 webAppConfiguration: response.Result,
  //             });
  //         }
  //     });
  // };

  getKycStatus = () => {
    api.get("GetKycStatus").then((response) => {
      if (response && response.StatusCode === 200 && response.Result) {
        let kycRequestData = {
          ...response.Result.KycRequestData,
          Status: response.Result.Status,
        };

        this.props.dispatch({
          type: "KYC_REQUEST",
          kycRequestData: kycRequestData,
        });

        if (KYC_STATUS.NoSubmission === response.Result.Status) {
          // START KYC
          this.startMyKyc();
        }
      }
    });
  };

  startMyKyc = () => {
    api.get("StartMyKyc").then((response) => {
      if (response && response.StatusCode === 200 && response.Result) {
        this.props.dispatch({
          type: "KYC_REQUEST",
          kycRequestData: response.Result,
        });
      }
    });
  };

  fetchDefaultAddress = () => {
    if (this.props.auth && this.props.auth.isLoggedIn) {
        api.get("GetMyDefaultAddress").then((response) => {
        if (response.Result) {
          localStorage.setItem(
            "defaultAddress",
            JSON.stringify(response.Result)
          );
          this.props.dispatch({
            type: "DEFAULT_ADDRESS",
            defaultAddress: response.Result,
          });

          if (
            response.Result &&
            response.Result.BusinessCustomerAddressMapping &&
            response.Result.BusinessCustomerAddressMapping.BusinessId
          ) {
            this.getBusinessSettings(
              response.Result.BusinessCustomerAddressMapping.BusinessId
            );
          }

        }
      });
    }
  };

  render() {
    let categoryList = [];
    const { categories } = this.props.app;
    if (categories && categories.length > 0) {
      categories.forEach((item) => {
        categoryList.push({
          text: item.Name,
          url: `/search-product/${item.Id}`,
        });
      });
    }

    const { selectedLanguageData } = this.props.app;

    return (
      <header
        className="header header--1"
        data-sticky="true"
        id="headerSticky">
        <div className="header__top">
          <div className="ps-container">
            <div className="header__left">
            <div className="menu--product-categories">
                <div className="menu__toggle">
                  <i className="icon-menu"></i>
                  <span style={{color:"#fff"}}>{languageLable(selectedLanguageData, "Categories")}</span>
                </div>
                <div className="menu__content">
                  <Menu  data={categoryList} className="menu--dropdown" />
                </div>
              </div>
              <Link to="/" className="ps-logo">
                  <Logo />
              </Link>
              
            </div>
            {this.props.auth && this.props.auth.isLoggedIn &&  (
              <div className="header__center">
                <SearchHeader />
                </div>
            )}
            <div className="header__right">
              <HeaderActions />
            </div>
          </div>
        </div>
        <NavigationDefault />
      </header>
    );
  }
}

const mapPropsToState = (state) => {
  return state;
};

export default connect(mapPropsToState, null)(withRouter(HeaderDefault));
