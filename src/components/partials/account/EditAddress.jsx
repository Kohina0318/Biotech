import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AccountLinks from "./AccountLinks";
import { Form, notification, Select } from "antd";
import API from "../../../api/api";
import { languageLable } from "utilities/helpers";
import { FaCheckCircle } from 'react-icons/fa';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import swal from "sweetalert"

import { makeStyles } from '@material-ui/core/styles';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file


var api;
const { Option } = Select;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'contents',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(49),
      height: "auto",
    },
    // margin: 5
  },
}))
class EditAddress extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      selectedCountryData: null,
      addresses: [],
      refresh: false,
      BusinessId: "",
      DefaultAddressId: "",
    };
  }

  setSelectedCoutry = (countryName) => {
    this.props.auth.countries.map((country) => {
      if (country.name === countryName) {
        this.setState({
          selectedCountryData: country,
        });
      }
      return null;
    });
  };

  componentDidUpdate = (props) => {
    if (
      props &&
      props.auth &&
      props.auth.defaultAddress &&
      !this.state.selectedCountryData
    ) {
      this.setSelectedCoutry(props.auth.defaultAddress.Country);
    }
  };

  handleSubmit = (values) => {
    const { selectedLanguageData } = this.props.app;

    if (
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.Id
    ) {
      let payload = {
        NamePrefix: "Hospital",
        Name: values.name,
        AddressLine1: values.addressLine1,
        AddressLine2: values.addressLine2,
        City: values.city,
        Country: this.state.selectedCountryData.name,
        State: values.state,
        Pin: values.pin,
        Title: "Hospital Address",
        Latitude: values.latitude,
        Longitude: values.longitude,
        IsDefault: true,
        BusinessId: this.state.selectedCountryData.BusinessId,
        LocationId: this.state.selectedCountryData.LocationId,
        Id: this.props.auth.defaultAddress.Id,
      };

      api
        .put("UpdateAddress", {
          data: payload,
        })
        .then((response) => {
          if (response.StatusCode === 200 && response.Result) {
            notification.success({
              message: "Success",
              description: languageLable(
                selectedLanguageData,
                "Address has been successfully updated."
              ),
            });
            this.props.history.push("/");
          } else {
            notification.info({
              message: "info",
              description: languageLable(
                selectedLanguageData,
                response.StatusMessage
              ),
            });
          }
        });
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  handleClearCart = () => {
    api.delete(`ClearCart`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        // this.props.history.push("/");
      }
    });
  };

  getBusinessSettings = async (businessId) => {
    if (businessId) {
      api
        .get(`GetBusinessSettings?businessId=${businessId}`)
        .then(async (response) => {
          console.log("Response Line 111", response)
          if (response.StatusCode === 200 && response.Result) {
            const currencySetting = localStorage.getItem('currency');
            console.log("CurrencySetting======>", currencySetting);
            console.log("response.Result.Currency======>", response.Result.Currency);
            if (currencySetting != response.Result.Currency) {

              this.props.dispatch({
                type: "FETCH_CART_DATA",
                cartData: null,
              });
              this.handleClearCart();
              this.props.history.push("/");
            }

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

  GetMyDefaultAddress = () => {
    api.get("GetMyDefaultAddress").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        // this.setState({
        //   myDefaultAddress: response.Result,
        //   myDefaultAddressId: response.Result.Id,
        // });

        console.log('GetMyDefaultAddress.......api data:Edit Address', response.Result)
      }
    });
  };

  getMyAddresses = () => {
    api.get("GetMyAddresses").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.setState({
          addresses: response.Result,
        });
        console.log('Get My Address.......api data:', response.Result)
      }
    });
  };

  handleGetMyDefaultAddress = () => {
    api.get("GetMyDefaultAddress").then((response1) => {
      if (response1.StatusCode === 200 && response1.Result) {
        console.log("handleGetMyDefaultAddress==>", response1.Result.BusinessCustomerAddressMapping.BusinessId)
        // console.log("handleGetMyDefaultAddress....data==>", response1.Result.Id)
        this.setState({
          BusinessId: response1.Result.BusinessCustomerAddressMapping.BusinessId,
          DefaultAddressId: response1.Result.Id,
        });

      }
    });
  };


  componentDidMount = () => {
    this.getMyAddresses();
    this.handleGetMyDefaultAddress();
  };


  handleSetDefaultAddress = (Id) => {

    try {
      api.get(`SetDefaultAddress?addressId=${Id}`).then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          console.log("SetDefaultAddress....api", response.Result)
          // this.getMyAddresses()

          console.log("BusssinedId uppr Bali==>", response.Result.BusinessCustomerAddressMapping.BusinessId)
          console.log("BusssinedId Niche Bali==>", this.state.BusinessId)

          if (this.state.BusinessId != response.Result.BusinessCustomerAddressMapping.BusinessId) {
            swal({
              title: "Are you sure?",
              text: "Changing Address will clear the Cart, Please confirm!",
              icon: "warning",
              dangerMode: true,
              showCancelButton: true,
              closeOnConfirm: true,
              showLoaderOnConfirm: true,
              buttons: {
                cancel: "No",
                catch: {
                  text: "Yes",
                },
              }
            }).then((value) => {
              switch (value) {
                case "catch":
                  swal("Success,", "Your Address has been changed.", "success");
                  this.getMyAddresses()
                  this.props.dispatch({
                    type: "FETCH_CART_DATA",
                    cartData: null,
                  });
                  this.handleClearCart();
                  this.handleGetMyDefaultAddress();
                  window.location.reload();
                  if (this.props.location.state.comeIn === 'ComeInCartPage') {
                    this.props.history.push("/")
                  }
                  break;

                default:
                  api.get(`SetDefaultAddress?addressId=${this.state.DefaultAddressId}`).then((response1) => {
                    if (response1.StatusCode === 200 && response1.Result) {
                      console.log("SetDefaultAddress....api", response1.Result)
                      this.getMyAddresses()
                      this.handleGetMyDefaultAddress();
                    }
                  })
                  break;

              }
            });
          } else {
            if (this.props.location.state.comeIn === 'ComeInCartPage') {
              this.getMyAddresses()
              this.handleGetMyDefaultAddress();
              this.props.history.push("/account/cart")
            } else {
              this.getMyAddresses()
              this.handleGetMyDefaultAddress();
            }
          }

        }
      })

    } catch (e) {
      alert("Error...." + e)
    }
  };


  render() {

    const initialValues = {};
    if (this.props && this.props.auth && this.props.auth.defaultAddress) {
      initialValues.name = this.props.auth.defaultAddress.Name;
      initialValues.addressLine1 = this.props.auth.defaultAddress.AddressLine1;
      initialValues.addressLine2 = this.props.auth.defaultAddress.AddressLine2;
      initialValues.country = this.props.auth.defaultAddress.Country;
      initialValues.state = this.props.auth.defaultAddress.State;
      initialValues.city = this.props.auth.defaultAddress.City;
      initialValues.pin = this.props.auth.defaultAddress.Pin;
    }
    const { selectedLanguageData } = this.props.app;
    const { addresses } = this.state;


    return (
      <section className="ps-my-account ps-page--account">
        <div className="ps-container">
          <div className="row">
            <AccountLinks page="edit-address" />
            <div className="col-lg-8">
              <div className="ps-form--account-setting ps-form--address-info" >

                <div className="ps-form__header">
                  <h3>
                    {languageLable(selectedLanguageData, "My Addresses")}
                  </h3>
                </div>

                <div className={useStyles.root}>
                  <div class="scrollerAddress" style={{ padding: 2, }}>
                    {addresses && addresses.map((item) => (
                      <Paper elevation={2} style={{ marginTop: 8 }}  >
                        <div className="ps-form__content"
                          style={{ padding: 30, }}>
                          <div style={{ display: 'flex', flexDirection: 'row', maxwidth: "100%", }}>

                            <div className="field-value" style={{ fontSize: 20, display: 'flex', flexDirection: 'row', width:"50%" }}>
                              {item.Name}
                            </div>

                            <div class="col" style={{ display: 'flex', justifyContent: 'end', padding: 0, width:"50%" }}>
                              {item.IsDefault == true ? (
                                <div style={{ display: "flex", alignSelf: 'center', alignContent: 'center' }}>
                                  <FaCheckCircle style={{ margin: 3, height: 28, width: 28, color: "green" }} />
                                </div>
                              ) : (
                                <button onClick={() => this.handleSetDefaultAddress(item.Id)}
                                  style={{ borderRadius: 3, textAlign: 'center', background: '#396470', color: '#FFF', padding: "6px 8px", fontSize: 13, border: 0 , position: "absolute"}}
                                >
                                  {languageLable(selectedLanguageData, "Select Shipping Address")}
                                </button>
                              )}
                            </div>
                          </div>

                          <div style={{ marginTop: 10 }} />
                          <figcaption >
                            <div className="field-title">
                              {item.AddressLine1}, {item.AddressLine2}, {item.City}, {item.State}, {item.Country}, {item.Pin}.
                            </div>
                          </figcaption>

                          <div style={{ marginTop: 10, }} />
                        </div>
                      </Paper>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div >
      </section >
    );
  }

  editAddressForm = (initialValues) => {
    return (
      <Form
        className="ps-form--account-setting"
        onFinish={(values) => this.handleSubmit(values)}
        onFinishFailed={() => this.onFinishFailed()}
        initialValues={{ ...initialValues }}
      >
        <div className="ps-form__header">
          <h3>Address</h3>
        </div>
        <div className="ps-form__content">
          <div className="form-group">
            <div className="control-label">Hospital Name</div>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter hospital name.",
                },
              ]}
            >
              <input
                className="form-control"
                name="name"
                type="text"
                placeholder="Hospital name"
              ></input>
            </Form.Item>
          </div>
          <div className="form-group form-forgot">
            <div className="control-label">Address Line 1</div>
            <Form.Item
              name="addressLine1"
              rules={[
                {
                  required: true,
                  message: "Please enter address line 1",
                },
              ]}
            >
              <input
                className="form-control"
                name="addressLine1"
                type="text"
                placeholder="Address Line 1"
              ></input>
            </Form.Item>
          </div>
          <div className="form-group">
            <div className="control-label">Address Line 2</div>
            <Form.Item
              name="addressLine2"
              rules={[
                {
                  message: "Please enter address line 2",
                },
              ]}
            >
              <input
                className="form-control"
                name="addressLine2"
                type="text"
                placeholder="Address Line 2"
              ></input>
            </Form.Item>
          </div>
          <div className="form-group">
            <div className="control-label">Country</div>
            <Form.Item
              name="country"
              rules={[
                {
                  message: "Please select country.",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select a country"
                optionFilterProp="children"
                onChange={(e) => this.setSelectedCoutry(e)}
              >
                {this.props.auth &&
                  this.props.auth.countries.map((item) => (
                    <Option key={item.name} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </div>
          <div className="form-group">
            <div className="control-label">State</div>
            <Form.Item
              name="state"
              rules={[
                {
                  message: "Please select state.",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select a state"
                optionFilterProp="children"
              >
                {this.state.selectedCountryData &&
                  this.state.selectedCountryData.states.map((state) => (
                    <Option key={state.name} value={state.name}>
                      {state.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <div className="form-group">
              <div className="control-label">City</div>
              <Form.Item
                name="city"
                rules={[
                  {
                    message: "Please enter city.",
                  },
                ]}
              >
                <input
                  className="form-control"
                  name="addressLine1"
                  type="text"
                  placeholder="City"
                ></input>
              </Form.Item>
            </div>
            <div className="form-group">
              <div className="control-label">Pincode</div>
              <Form.Item
                name="pin"
                rules={[
                  {
                    message: "Please enter pin.",
                  },
                ]}
              >
                <input
                  className="form-control"
                  name="pin"
                  type="text"
                  placeholder="Pincode"
                ></input>
              </Form.Item>
            </div>
          </div>
          <div className="form-group submit">
            <button className="ps-btn">Update</button>
          </div>
        </div>
      </Form>
    );
  };
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(EditAddress));
