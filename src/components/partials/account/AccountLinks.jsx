import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { KYC_STATUS, APP_SETTINGS } from "utilities/constants";
import { languageLable } from "utilities/helpers";

class AccountLinks extends Component {

  handleLogout = () => {
    this.props.dispatch({
      type: "LOGOUT_SUCCESS",
    });
    this.props.history.push("/account/login");
  };

 
  render() {
    const { selectedLanguageData } = this.props.app;
    const currencySetting = localStorage.getItem('currency');
    
    const businessId =
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping.BusinessId;

      // APP SETTING - CHECK KYC IS ALLOW OR NOT
    const { isKyc, isWallet, isLoyalty } = APP_SETTINGS;

    const accountLinks = [
      {
        text: languageLable(selectedLanguageData, "Account Information"),
        url: "/account/user-information",
        icon: "icon-user",
        page: "user-information",
      },
      {
        text: languageLable(selectedLanguageData, "My Addresses"),
        url: "/account/edit-address",
        icon: "icon-map-marker",
        page: "edit-address",
        comeinpage: "ComeInMyAddress",
      },
      currencySetting == "₹" ? {
        // businessId === "c16a2ae1-7e9e-476f-8ddd-3fd6a7e9eedf" && {
        text: languageLable(selectedLanguageData, "Payment"),
        // isRedirect: true,
        url: "/account/payment-history",
        icon: "icon-papers",
        page: "payment-history",
      } : "",
      isLoyalty && {
        text: languageLable(selectedLanguageData, "Loyalty"),
        url: "/account/loyalty",
        icon: "icon-gift",
        page: "Loyalty",
      },
      isWallet && {
        text: languageLable(selectedLanguageData, "My Wallet"),
        url: "/account/wallet",
        icon: "icon-wallet",
        page: "wallet",
      },
      {
        text: languageLable(selectedLanguageData, "Notifications"),
        url: "/account/notifications",
        icon: "icon-alarm-ringing",
        page: "notifications",
      },
      {
        text: languageLable(selectedLanguageData, "Change Password"),
        url: "/account/change-password",
        icon: "icon-lock",
        page: "change-password",
      },
      isKyc &&
      this.props.auth.kycRequestData &&
      this.props.auth.kycRequestData.Status !== KYC_STATUS.Approved && {
        text: languageLable(selectedLanguageData, "KYC"),
        url: "/account/kyc",
        icon: "icon-list",
        page: "kyc",
      },
    ];

    const redirectToPayment = () => {
      window.open(
        "https://pages.razorpay.com/pl_H93cXb3wO2cetp/view",
        "_blank"
      );
    };

    return (
      <div className="col-lg-4">
        <div className="ps-page__left">
          <aside className="ps-widget--account-dashboard">
            <div className="ps-widget__header">
              <figure>
                <figcaption>
                  {languageLable(selectedLanguageData, "Hello")},{" "}
                  {this.props.auth &&
                    this.props.auth.userData &&
                    this.props.auth.userData.name}
                </figcaption>
                <p>
                  {this.props.auth &&
                    this.props.auth.userData &&
                    this.props.auth.userData.email}
                </p>
              </figure>
            </div>
            <div className="ps-widget__content">
              <ul style={{ display: 'grid', }}>
                {accountLinks.map(
                  (link) =>
                    link && (
                      <li
                        style={{ width: 'auto', }}
                        key={link.text}
                        className={
                          this.props.page === link.page ? "active" : ""
                        }
                      >
                        {link.isRedirect ? (
                          <Link to={`#!`} onClick={() => redirectToPayment()}>
                            <i className={link.icon}></i>
                            {link.text}
                          </Link>
                        ) : (
                          <Link to={{ pathname: link.url, state: { comeIn: link.comeinpage, UserData: this.props.auth } }} >
                            <i className={link.icon}></i>
                            {link.text}
                          </Link>
                        )}
                      </li>
                    )
                )}

                <li onClick={() => this.handleLogout()}>
                  <Link to="#">
                    <i className="icon-power-switch"></i>
                    {languageLable(selectedLanguageData, "Logout")}
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(AccountLinks));
