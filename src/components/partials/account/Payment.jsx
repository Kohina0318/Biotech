
import React, { Component, useState } from "react";
import { Form, Input, Select, notification, Checkbox } from "antd";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { Radio } from "antd";
import API from "api/api";
import { RAZORPAY_CREDENTIALS, RAZORPAY_ENV } from "utilities/constants";
import { languageLable } from "utilities/helpers";
import Shipping from "../account/Shipping";
import axios from "axios";
import { SettingOutlined } from '@ant-design/icons';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@material-ui/core/IconButton';
import { EditOutlined } from "@material-ui/icons";
import { Grid } from "@material-ui/core";
import SweetAlert from 'react-bootstrap-sweetalert'
import swal from "sweetalert"
import { Alert } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const { Option } = Select;



function onChange(value) {
  console.log(`selected ${value}`);
}

function onSearch(val) {
  console.log('search:', val);
}

var api;

class Payment extends Component {
  constructor(props) {
    super(props);
    console.log("this.props<><><><", this.props)

    api = new API();
    this.state = {
      method: 0,
      paymentModes: [],
      checkoutData: null,
      shippingMode: null,
      coupandiscount: null,
      coupandiscountTotal: 0,
      value: 0,
      walletamount: 0,
      walletbalance: 0,
      walletvalue: "",
      coupancode: null,
      name: '',
      offerList: [],
      isCouponVisible: false,
      couponCodeTemp: '',
      couponTitleTemp: '',
      offerpaymentModes: [],
      open: false,
      temp: '',
      open1: false,
      open2: false,
      isError: '',
      documentVal: '',
      urlLink: '',
      loading: false,
      method2: 0,
      loyaltypoints: 0,
      redeempoints: 0,
      refresh: false,
      // paymentProvider: ''
    };
  }

  componentDidMount = async () => {
    try {
      if (this.props.history.location.state.couponcode != '') {
        this.setState({ couponCodeTemp: this.props.history.location.state.couponcode })
        this.setState({ couponTitleTemp: this.props.history.location.state.offertitle })
        this.setState({ offerpaymentModes: this.props.history.location.state.PaymentModes.sort() })
        this.setState({ isCouponVisible: true })
        this.setState({ method2: this.props.history.location.state.PaymentModes[0] })
      }
    }
    catch (e) {

    }
    finally {
      api.get("GetCheckout").then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          this.setState({
            checkoutData: response.Result,
            walletbalance: response.Result.WalletBalance,
            walletamount: response.Result.WalletAmount
          });
        }
      })
      this.getPaymentModes();
      this.getShippingMode();
      this.renderPlaceOrderButton();
      this.renderWalletCheckBox();
      this.handleGetLoyaltyPoints();
    }
  };


  // componentDidUpdate = async() =>{
  //   this.setState({refresh:!this.state.refresh});
  // } 

  getPaymentModes = () => {
    const locationId =
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping.LocationId;

    if (locationId) {
      api.get(`GetPaymentModes?locationId=${locationId}`).then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          let t = response.Result.sort();
          console.log("Response After Sort", t)

          this.setState({
            paymentModes: t,
            method: t[0],
            // method: response.Result[1],
          });
        }
      });
    }
  };

  getShippingMode = () => {
    const locationId =
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping.LocationId;
    if (locationId) {
      api.get(`GetShippingMode?locationId=${locationId}`).then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          this.setState({
            shippingMode: response.Result,
          });
        }
      });
    }
  };

  handleChangePaymentMethod = (e) => {
    this.setState({ method: e.target.value });
  };
  handleChangePaymentMethod1 = (e) => {
    this.setState({ method2: e.target.value });
  };

  handleClearCart = () => {
    api.delete(`ClearCart`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.props.history.push("/account/orders");
      }
    });
  };

  handleSubmitDocument = () => {
    this.setState({ loading: true })
    try {
      if (this.state.documentVal != '') {
        api.get(`ProceedTopaymentUsingGateway?document=${this.state.documentVal}`).then((response) => {
          if (response.StatusCode === 200 && response.Result) {
            this.openCheckout(response.Result);
          }
        });
      } else {
        alert("Please fill document.")
      }
    } catch (e) {
      alert(e);
    }
  }

  handleContinue = () => {
    const { selectedLanguageData } = this.props.app;
    if (this.state.method === "Online") {
      try {
        api.get(`GetBusinessSettings?businessId=${this.props.location.state.myDefaultAddressBusinessId}`).then((response) => {
          if (response.StatusCode === 200 && response.Result) {
            // alert(response.Result.PaymentProvider)
            if (response.Result.PaymentProvider == "Juno") {
              this.setState({ open1: true });
            }
            else if (response.Result.PaymentProvider == "Razorpay") {
              this.openCheckout();
            }
            else {
              try {
                api.get(`ProceedTopaymentUsingGateway?isFromWebApp=true`).then((response) => {
                  if (response.StatusCode === 200 && response.Result) {
                    this.openCheckout(response.Result);
                  }
                })
              } catch (e) {
                notification.info({
                  message: languageLable(
                    selectedLanguageData,
                    "Something went wrong! Please try again later."
                  ),
                })
                console.log("Error.....in ProceedTopaymentUsingGateway", e)
              }
            }
          }
        });
      } catch (e) {
        console.log("GetBusinessSettings....", e)
      }
    }
    else if (this.state.method2 === "Online") {
      try {
        api.get(`GetBusinessSettings?businessId=${this.props.location.state.myDefaultAddressBusinessId}`).then((response) => {
          if (response.StatusCode === 200 && response.Result) {
            alert(response.Result.PaymentProvider)
            if (response.Result.PaymentProvider == "Juno") {
              this.setState({ open1: true });
            }
            else if (response.Result.PaymentProvider == "Razorpay") {
              this.openCheckout();
            }
            else {
              try {
                api.get(`ProceedTopaymentUsingGateway?isFromWebApp=true`).then((response) => {
                  if (response.StatusCode === 200 && response.Result) {
                    this.openCheckout(response.Result);
                  }
                })
              } catch (e) {
                notification.info({
                  message: languageLable(
                    selectedLanguageData,
                    "Something went wrong! Please try again later."
                  ),
                });
                console.log("Error.....in ProceedTopaymentUsingGateway", e)
              }
            }
          }
        });
      } catch (e) {
        console.log("GetBusinessSettings....", e)
      }
    }
    else if (this.state.method === "COD") {
      api.get(`ProceedTopaymentUsingCOD`).then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          this.handleClearCart();
          notification.success({
            message: languageLable(
              selectedLanguageData,
              "Order has been placed successfully."
            ),
          });
        }
      });
    } else {
      notification.info({
        message: languageLable(
          selectedLanguageData,
          "No payment method found!. Please contact support."
        ),
      });
    }
  };

  openCheckout = (transactionData) => {
    console.log("TranscationData....198", transactionData)
    const { checkoutData } = this.state;
    const { userData } = this.props.auth;
    const { selectedLanguageData } = this.props.app;
    if (transactionData === undefined || transactionData === null || transactionData.RedirectURL === undefined || transactionData.RedirectURL === null) {
      let options = {
        key: RAZORPAY_CREDENTIALS[RAZORPAY_ENV].key,
        amount: checkoutData.TotalAmount * 100, // 2000 paise = INR 20, amount in paisa
        name: RAZORPAY_CREDENTIALS.MERCHANT_NAME,
        handler: (response) => {
          if (response.razorpay_payment_id) {
            this.razorPayConfirmPayment(
              transactionData.TransactionId,
              response.razorpay_payment_id
            );
          } else {
            notification.error({
              message: "Error",
              description: languageLable(
                selectedLanguageData,
                "Something Went wrong. Please try after sometime."
              ),
            });
          }
        },
        prefill: {
          name: userData && userData.name,
          email: userData && userData.email,
          contact: userData && userData.phonenumber,
        },
        theme: {
          color: "#2c5662",
        },
      };
      let rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // alert(transactionData.RedirectURL)
      this.handleClickOpen2()
      this.setState({ urlLink: transactionData.RedirectURL })
      // <a href="https://www.w3schools.com" target="iframe_a">W3Schools.com</a> 
      // window.open(transactionData.RedirectURL)
    }
  };

  razorPayConfirmPayment = (transactionId, razorPaymentId) => {
    const { selectedLanguageData } = this.props.app;
    api
      .get(
        `PaymentConfirm?transactionId=${transactionId}&razorPaymentId=${razorPaymentId}`
      )
      .then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          this.handleClearCart();
          notification.success({
            message: languageLable(
              selectedLanguageData,
              "Order has been placed successfully."
            ),
          });
        }
      });
  };

  handleCoupanCode = (values) => {
    const { selectedLanguageData } = this.props.app;

    const userDetails = (localStorage.getItem('defaultAddress'));
    const locationIdJsonParse = JSON.parse(userDetails);
    const locationId = locationIdJsonParse.BusinessCustomerAddressMapping.LocationId;

    api.get(`ApplyOffer?offerId=&couponCode=${this.state.couponCodeTemp}&locationId=${locationId}`).then((response) => {

      if (response.StatusCode === 200 && response.Result) {
        if (response.Result.OfferViewModel) {

          this.setState({
            checkoutData: response.Result,
            walletbalance: response.Result.WalletBalance,
            walletamount: response.Result.WalletAmount,
            coupandiscount: response.Result.OfferDiscount,
            coupancode: response.Result.OfferViewModel.CoponCode,
          });
        } else {
          notification.error({
            message: languageLable(
              selectedLanguageData,
              "This Coupon code is not available!"
            ),
          });
        }
      } else {

      }
    });
  };

  handleHtmlControlChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }


  handleSubmit = (event) => {
    const { selectedLanguageData } = this.props.app;

    console.log(this.state.name);
    const userDetails = (localStorage.getItem('defaultAddress'));
    const locationIdJsonParse = JSON.parse(userDetails);
    const locationId = locationIdJsonParse.BusinessCustomerAddressMapping.LocationId;

    event.preventDefault();
    console.log("here")
    api.get(`ApplyOffer?offerId=&couponCode=${this.state.name}&locationId=${locationId}`)
      .then(response => {
        console.log("=>", response)
        if (response.StatusCode === 200 && response.Result) {
          console.log("=>", response.Result.OfferViewModel)
          if (response.Result.OfferViewModel) {
            this.setState({
              checkoutData: response.Result,
              walletbalance: response.Result.WalletBalance,
              walletamount: response.Result.WalletAmount,
              coupandiscount: response.Result.OfferDiscount,
              coupancode: response.Result.OfferViewModel.CoponCode,
            });
          } else {
            notification.error({
              message: languageLable(
                selectedLanguageData,
                "This Coupon code is not available!"
              ),
            });
          }
        } else {
          console.log(response.Result);
        }
      }).catch(error => {
        console.log(error);
      })
  }

  handleCoupanCodeRemove = () => {
    api.get("RemoveOffer").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.setState({
          checkoutData: response.Result,
        });
      }
    })

    this.setState({ isCouponVisible: false })
  }

  renderRemoveCoupanCode = () => {

    const { offerList } = this.state;

    const userDetails = (localStorage.getItem('defaultAddress'));
    const locationIdJsonParse = JSON.parse(userDetails);
    const locationId = locationIdJsonParse.BusinessCustomerAddressMapping.LocationId;

    api.get(`GetMyOffers?locationId=${locationId}`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        console.log("response At Line 28", response.Result);
        this.setState({
          offerList: response.Result,
        });
      }
    });

  };

  renderToPayAmount = () => {
    const { checkoutData } = this.state;
    const currencySetting = localStorage.getItem('currency');
    const { selectedLanguageData } = this.props.app;

    if (this.state.coupandiscountTotal > 0) {
      return <figure className="ps-block__total">
        <h3>
          {languageLable(selectedLanguageData, "To Pay")}
          <strong>
            {currencySetting ? currencySetting : "â‚¹"}{" "}
            {checkoutData && checkoutData.OfferDiscount
              ? checkoutData.OfferDiscount.toFixed(2)
              : 0}
          </strong>
        </h3>
      </figure>;
    } else {
      return <figure className="ps-block__total">
        <h3>
          {languageLable(selectedLanguageData, "Payable Amount")}
          <strong>
            {currencySetting ? currencySetting : "â‚¹"}{" "}
            {checkoutData && checkoutData.TotalAmount
              ? checkoutData.TotalAmount.toFixed(2)
              : 0}
          </strong>
        </h3>
      </figure>;
    }
  };

  renderPlaceOrderButton = () => {
    const { checkoutData } = this.state;
    const { selectedLanguageData } = this.props.app;
    if (this.state.coupandiscountTotal > 0) {
      return <div className="button-container">
        <button
          className="ps-btn"
          onClick={() => this.handleContinue()}
        >
          {languageLable(selectedLanguageData, "Place Order")}
        </button>
      </div>;
    } else {
      if (checkoutData && checkoutData.Total > 0) {
        return <div className="button-container">
          <button
            className="ps-btn"
            onClick={() => this.handleContinue()}
          >
            {languageLable(selectedLanguageData, "Place Order")}
          </button>
        </div>;
      }
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  handleWalletAmount = (e) => {
    const { checkoutData } = this.state;
    if (e.target.checked == true) {
      e.target.id = checkoutData.Total;
    }
    api.get(`UseWalletAmount?offerId=&walletUsed=${e.target.checked}&walletAmount=${e.target.id}`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.setState({
          checkoutData: response.Result,
          walletbalance: response.Result.WalletBalance,
          walletamount: response.Result.WalletAmount,

        });
      }
    });
  };

  renderWalletCheckBox = () => {

    const { selectedLanguageData } = this.props.app;

    const { checkoutData, walletamount, walletbalance } = this.state;
    console.log("wallet balance......", walletamount, walletbalance)
    if (checkoutData) {

      if (checkoutData.WalletBalance > 0 && checkoutData.WalletAmount != 0) {
        return <Checkbox onChange={(e) => this.handleWalletAmount(e)} id={this.state.walletamount && this.state.walletamount ? this.state.walletamount : 0} defaultChecked={true} >
          {languageLable(selectedLanguageData, "Use Wallet")} ({languageLable(selectedLanguageData, "Total Balance")}: {this.state.walletbalance && this.state.walletbalance ? this.state.walletbalance : 0})
          {languageLable(selectedLanguageData, "Wallet Deduction")}: {this.state.walletamount && this.state.walletamount ? this.state.walletamount : 0}
        </Checkbox>;
      } else {
        return <Checkbox onChange={(e) => this.handleWalletAmount(e)} id={this.state.walletamount && this.state.walletamount ? this.state.walletamount : 0} >
          {languageLable(selectedLanguageData, "Use Wallet")} ({languageLable(selectedLanguageData, "Total Balance")}: {this.state.walletbalance && this.state.walletbalance ? this.state.walletbalance : 0})
          {languageLable(selectedLanguageData, "Wallet Deduction")}: {this.state.walletamount && this.state.walletamount ? this.state.walletamount : 0}
        </Checkbox>;
      }
    }
  };

  editWalletAmount = () => {
    this.handleClickOpen()
    // this.setState({walletvalue:this.state.walletbalance})
    this.setState({ walletvalue: this.state.walletbalance })
  }


  handleClickOpen = () => {
    this.setState({ open: true })
  };
  handleClickOpen1 = () => {
    this.setState({ open1: true })
  };

  handleClickOpen2 = () => {
    this.setState({ open2: true })
  };


  handleClose = () => {
    this.setState({ open: false })
  };

  handleClose1 = () => {
    this.setState({ open1: false })
  };

  handleClose2 = () => {
    this.setState({ open2: false })
    this.props.history.replace('/account/orders')
  };


  handleChangeValue = (e) => {
    this.setState({ walletvalue: e.target.value })
    this.setState({ temp: e.target.value })
  }

  handleOk = () => {
    this.handleClose();
    this.setState({ walletamount: this.state.walletvalue });
    const { checkoutData } = this.state;
    api.get(`UseWalletAmount?offerId=&walletUsed=${true}&walletAmount=${this.state.walletvalue}`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.setState({
          checkoutData: response.Result,
          walletbalance: response.Result.WalletBalance,
          walletamount: response.Result.WalletAmount,
        });
      }
    });
  }

  // handleClickRedeem=()=>{

  //   swal({
  //     title: "Redeem Your Loyalty Points",
  //     content: "input",
  //     inputPlaceholder: "Enter your loyalty points",
  //     button: {
  //       text: "Redeem",
  //       closeModal: false,
  //     }, 
  //   })
  //   .then((ok) => {
  //     if (ok) {
  //       swal("Points has been successfully redeemed to your account", {
  //         icon: "success",
  //       });
  //     } else {
  //       swal("Something went wrong!",{
  //         icon:"error"
  //       });
  //     }
  //   });
  // }



  handleGetLoyaltyPoints = async () => {

    let cid = localStorage.getItem('userData');
    let customerid = JSON.parse(cid);
    // console.log("customeriddddddd",customerid.id)

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://loyaltyuat.biotech.archisys.biz/api/CustomerStatus?customerid=${customerid.id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        //console.log("LOYALTY POINTS...:", result)
        this.setState({
          loyaltypoints: result.data.totalAvailable,
        })
      }
      )
      .catch(error => console.log('error', error));

  }


  handleLoyaltyRedeemPoints = async () => {

    const { selectedLanguageData } = this.props.app;

    let cid = localStorage.getItem('userData');
    let customerid = JSON.parse(cid);
    let auth = localStorage.getItem("authToken")
    let device = localStorage.getItem("deviceToken")

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    swal({
      title: languageLable(selectedLanguageData, "Redeem Your Loyalty Points"),
      content: "input",
      //inputPlaceholder: "Enter your loyalty points",
      button: {
        text: languageLable(selectedLanguageData, "Redeem"),
        closeModal: false,
      },
    })
      .then((ok) => {

        if (ok) {

          fetch(`https://loyaltyuat.biotech.archisys.biz/api/RedeemPoints?customerid=${customerid.id}&points=${ok}&authorizetoken=Bearer ${auth}&devicetoken=${device}&baseurl=@http://localhost:7100`, requestOptions)
            .then(response => response.json())
            .then(result => {

              // console.log("REDEEM LOYALTY POINTS...:", result)

              swal(`${result.message}`, {
                icon: "success",
              })
                .catch(error => console.log('error', error));

              window.location.reload()
            })

        }
        else {
          swal(languageLable(selectedLanguageData, "Something went wrong!"), {
            icon: "error"
          });
        }
      });
  }

  render() {
    const { checkoutData } = this.state;
    const { selectedLanguageData } = this.props.app;
    const currencySetting = localStorage.getItem('currency');

    const canPayLater =
      this.props.auth &&
        this.props.auth.userData &&
        this.props.auth.userData.can_paylater === "true"
        ? true
        : false;

    return (
      <>
        <div className="ps-checkout ps-section--shopping payment-conformation">
          <div className="ps-container">
            <div className="ps-section__content">
              <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                  <div className="ps-form__orders">
                    <div className="ps-block--checkout-order">
                      <div className="ps-block__content">
                        <figure>
                          <figcaption>
                            <strong>
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
                                "Sub Total"
                              )}
                            </strong>
                            <strong>
                              {currencySetting ? currencySetting : "â‚¹"}{" "}
                              {checkoutData && checkoutData.SubTotal
                                ? checkoutData.SubTotal.toFixed(2)
                                : 0}
                            </strong>
                          </figcaption>
                        </figure>
                        <figure>
                          <figcaption>
                            <strong>
                              {languageLable(selectedLanguageData, "Product Discount")}
                            </strong>
                            <strong>
                              ({currencySetting ? currencySetting : "â‚¹"}{" "}
                              {checkoutData && checkoutData.ProductDiscount
                                ? checkoutData.ProductDiscount
                                : 0}{" "}
                              )
                            </strong>
                          </figcaption>
                        </figure>
                        <figure>
                          <figcaption>
                            <strong>
                              {languageLable(selectedLanguageData, "Discount / Promo")}
                            </strong>
                            <strong>
                              ({currencySetting ? currencySetting : "â‚¹"}{" "}
                              {checkoutData && checkoutData.OfferDiscount
                                ? checkoutData.OfferDiscount
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
                            <strong>{currencySetting ? currencySetting : "â‚¹"}{" "}
                              {checkoutData && checkoutData.ShippingCharge
                                ? checkoutData.ShippingCharge
                                : 0}</strong>
                          </figcaption>
                        </figure>
                        <figure>
                          <figcaption>
                            <strong>
                              {languageLable(
                                selectedLanguageData,
                                "Order Total Amount"
                              )}
                            </strong>
                            <strong>{currencySetting ? currencySetting : "â‚¹"}{" "}
                              {checkoutData && checkoutData.Total
                                ? checkoutData.Total
                                : 0}</strong>
                          </figcaption>
                        </figure>
                        {this.renderToPayAmount()}
                      </div>
                    </div>
                  </div>


                  <div className="ps-block--payment-method">
                    <div className="row">
                      <div className="col-lg-12">
                        <figure>
                          <figcaption>
                            <h4><strong>{languageLable(selectedLanguageData, "Loyalty")}</strong></h4>
                          </figcaption>
                          <div className="row">
                            <div className="col-lg-8">
                              {languageLable(selectedLanguageData, "Loyalty Points")}: {this.state.loyaltypoints}
                            </div>
                            <div className="col-md-4">
                              <button className="ps-btn ps-btn--fullwidth" onClick={() => this.handleLoyaltyRedeemPoints()} style={{ background: "#2C5662" }}>
                                {languageLable(selectedLanguageData, "Redeem")}
                              </button>
                            </div>
                          </div>
                        </figure>
                      </div>
                    </div>
                  </div>

                  <div className="ps-block--payment-method">
                    <div className="row">
                      <div className="col-lg-12">

                        <figure>
                          <figcaption>
                            <h4><strong>{languageLable(selectedLanguageData, "Wallet")}</strong></h4>
                          </figcaption>
                          <div className="row">
                            <div className="col-lg-11">
                              {this.renderWalletCheckBox()}
                            </div>
                            <div className="col-lg-1">
                              <IconButton id={this.state.walletamount && this.state.walletamount ? this.state.walletamount : 0} onClick={() => this.editWalletAmount()}><img src="/static/img/icons/edit.png" /></IconButton>
                            </div>
                          </div>
                        </figure>

                      </div>
                    </div>
                  </div>

                  {/* New Portion End */}


                  {/* New Portion 1 Start */}

                  {this.state.isCouponVisible == false ? (
                    <>
                      <figure>
                        <figcaption>
                          <h4><strong>{languageLable(selectedLanguageData, "Coupon Discount")}</strong></h4>
                        </figcaption>
                        <Form
                          name="coupan-code"
                          onFinish={(values) => this.handleCoupanCode(values)}
                          onFinishFailed={() => this.onFinishFailed()}
                        >
                          <div className="row" >
                            <div className="col-md-12" >

                              <Form.Item name="coupanCode" >

                                <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }} className="form-control">

                                  <Grid xs={6}>
                                    <div style={{ width: '100%', display: "flex", justifyContent: "flex-start", color: '#396470', fontWeight: 'bold', fontSize: 17 }} >
                                      <img src="/static/img/icons/offer.png" style={{ margin: 3, height: 22, width: 26, }} />
                                      {languageLable(selectedLanguageData, "Apply Coupon Code")}
                                    </div>
                                  </Grid>
                                  <Grid xs={6}>
                                    <div onClick={() =>
                                      this.props.history.push("/account/offers")}
                                      style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                      <IconButton><ArrowForwardIosIcon fontSize="25" style={{ color: '#396470', fontWeight: 'bold', fontSize: 20 }} /></IconButton>
                                    </div>
                                  </Grid>
                                </Grid>
                              </Form.Item>
                            </div>
                          </div>
                        </Form>
                      </figure>
                    </>
                  ) : (
                    <>
                      <figure>
                        <figcaption>
                          <h4><strong>{languageLable(selectedLanguageData, "Coupon Discount Remove")}</strong></h4>
                        </figcaption>
                        <div className="row" style={{ border: "1px solid  #DDDDDD", marginLeft: 0, marginRight: 0, padding: 15 }} >
                          <div className="col-md-8" >
                            <img src="/static/img/icons/offer.png" style={{ marginRight: 6, height: 25, width: 30, }} />
                            <span style={{ color: "#50CEE5", border: '2px dashed', borderRadius: 8, padding: 4, }}>{languageLable(selectedLanguageData, this.state.couponCodeTemp)}</span>
                            <div style={{ fontWeight: "bold", color: '#396470', marginTop: 5, fontSize: 17 }}>{languageLable(selectedLanguageData, this.state.couponTitleTemp)}</div>
                            <div>{languageLable(selectedLanguageData, "Promo code applied successfully")}</div>
                            {/* <input
                    className="form-control"
                    value={"Coupan Code :" + this.state.coupancode + " Coupan Amount :" + this.state.coupandiscount}
                    disabled
                  /> */}
                          </div>
                          <div className="col-md-4">
                            <button className="ps-btn ps-btn--fullwidth" onClick={(values) => this.handleCoupanCodeRemove(values)} style={{ background: "#2C5662" }}>
                              {languageLable(selectedLanguageData, "Remove")}
                            </button>
                          </div>
                        </div>
                      </figure>

                    </>
                  )}

                  {/* New Portion 1 End */}

                  <div className="ps-block--shipping">
                    <h4>
                      {languageLable(
                        selectedLanguageData,
                        "How you want to pay?"
                      )}
                    </h4>

                    <div className="ps-block--payment-method">
                      <div className="ps-block__header">

                        {/* New Portion Start */}

                        {this.state.isCouponVisible == false ? (
                          <Radio.Group
                            onChange={(e) => this.handleChangePaymentMethod(e)}
                            value={this.state.method}
                          >
                            {canPayLater ? (
                              this.state.paymentModes &&
                              this.state.paymentModes.length > 0 &&
                              this.state.paymentModes.map((item) => {
                                console.log("item line 904>>>", item)
                                return (
                                  <Radio value={item}>
                                    {item === "COD" ? languageLable(selectedLanguageData, "Pay Later") : languageLable(selectedLanguageData, "Online")}
                                  </Radio>

                                );
                              })
                            ) : (
                              <Radio value={"Online"}>
                                {languageLable(selectedLanguageData, "Online")}
                              </Radio>
                            )}
                          </Radio.Group>
                        ) : (
                          <>
                            {
                              <Radio.Group
                                onChange={(e) => this.handleChangePaymentMethod1(e)}
                                value={this.state.method2}
                              >
                                {this.state.offerpaymentModes.map((item) => {
                                  console.log("Line 926", item)
                                  return (
                                    <Radio value={item}>
                                      {item === "COD" ? languageLable(selectedLanguageData, "Pay Later") : languageLable(selectedLanguageData, "Online")}
                                    </Radio>

                                  );
                                })
                                }
                              </Radio.Group>
                            }
                          </>

                        )
                        }

                      </div>

                      {this.renderPlaceOrderButton()}
                    </div>

                    <div className="ps-block__footer">
                      <Link to="/account/cart">
                        <i className="icon-arrow-left mr-2"></i>
                        {languageLable(selectedLanguageData, "Return to cart")}
                      </Link>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/*.......................  wallet Edit Amount................................ */}

        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" maxWidth="lg">
          <div style={{ width: 400 }}>
            <DialogTitle id="form-dialog-title" ><h3> {languageLable(selectedLanguageData, "Enter Amount")}</h3></DialogTitle>
          </div>
          <DialogContent>
            <TextField
              autoFocus
              id="standard-number"
              type="number"
              value={this.state.walletvalue}
              onChange={(e) => this.handleChangeValue(e)}
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <p />
          <DialogActions>
            <Button style={{ fontSize: 14 }} onClick={this.handleClose} color="primary">
              {languageLable(selectedLanguageData, "Cancel")}
            </Button>
            <Button variant="contained" style={{ fontSize: 14 }} onClick={() => this.handleOk()} color="primary">
              {languageLable(selectedLanguageData, "ok")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ..................................New Popup.................................... */}

        <Dialog open={this.state.open1} onClose={this.handleClose1} aria-labelledby="form-dialog-title" maxWidth="lg">
          <div style={{ width: 400 }}>
            <DialogTitle id="form-dialog-title" >
              <h3>{languageLable(selectedLanguageData, "Enter Document")}</h3>
              <p>({languageLable(selectedLanguageData, "CPF or CNPJ. Send without a dot or dash")}.)</p>
            </DialogTitle>
          </div>
          <DialogContent>
            <TextField
              autoFocus
              type="text"
              // value={this.state.walletvalue}
              // onChange={(e)=>this.handleChangeValue(e)}
              // error
              onChange={(e) => this.setState({ documentVal: e.target.value })}
              placeholder={languageLable(selectedLanguageData, "Document")}
              // helperText=``
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <p />
          <DialogActions>
            <Button style={{ fontSize: 14 }} onClick={this.handleClose1} color="primary">
              {languageLable(selectedLanguageData, "Cancel")}
            </Button>
            <Button variant="contained" style={{ fontSize: 14 }} onClick={() => this.handleSubmitDocument()} color="primary" disabled={this.state.loading}>
              {languageLable(selectedLanguageData, "Continue")}
            </Button>
          </DialogActions>
        </Dialog>


        {/*..........................Payment Dialog................................ */}

        <Dialog open={this.state.open2} onClose={this.handleClose2} aria-labelledby="form-dialog-title" maxWidth="lg">
          {/* <DialogContent > */}
          <iframe src={this.state.urlLink} style={{ border: '0px solid black', width: 1000, height: 700 }} />
          {/* </DialogContent> */}

          <DialogActions >
            <Button style={{ fontSize: 15,}} onClick={this.handleClose2} color="primary">
              {languageLable(selectedLanguageData, "Cancel")}
            </Button>
          </DialogActions>
        </Dialog>

      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(Payment));