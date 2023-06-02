import React, { Component } from "react";
import { notification, Tabs } from "antd";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import API from "api/api";
import moment from "moment";
import { languageLable } from "utilities/helpers";
import { Radio } from "antd";

var api;
const { TabPane } = Tabs;

class Shipping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shippingSlots: [],
      addresses: [],
      value: 1,
    };
    api = new API();
  }

  componentDidMount = () => {
    this.getSchedulesWithModes();
    this.getMyAddresses();
  };

  getMyAddresses = () => {
    api.get("GetMyAddresses").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.setState({
          addresses: response.Result,
        });
      }
    });
  };

  getSchedulesWithModes = () => {
    const locationId =
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping.LocationId;

    if (locationId) {
      api
        .get(`GetSchedulesWithModes?locationId=${locationId}`)
        .then((response) => {
            if (response.StatusCode === 200 && response.Result ) {
              this.setState({
                  shippingSlots: response.Result,
              });
            }
        });
    }
  };

  handleCheckOut = (addressId) => {
    api
      .post("CheckOut", {
        data: {
          shippingScheduleId: "",
          addressId: addressId,
          orderNote: this.state.orderNote,
        },
      })
      .then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          this.props.history.push("/account/payment");
        }
      });
  };

  handleCoupanCode = () => {
    notification.info({
      message: "Sorry, no available coupan yet.",
    });
  };

  handleOrderNoteChange = (e) => {
    this.setState({
      orderNote: e.target.value,
    });
  };

  onDefaultAddressChange = (item) => {
    api.get(`SetDefaultAddress?addressId=${item.Id}`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.getMyAddresses();
        this.handleCheckOut(item.Id);
      }
    });
  };

  getSlotsbyData = (key) => {
    
  };

  render() {
    const { cartData } = this.props.app;
    const { addresses, shippingSlots } = this.state;
    const { selectedLanguageData } = this.props.app;
    return (
      <div className="ps-checkout ps-section--shopping" >
        <div className="ps-container">
        <div className="ps-block--shipping">
          <h4>
            {languageLable(selectedLanguageData, "Set Delivery Details")}
          </h4>
          </div>
          <div className="ps-section__content">
            <div className="row">
              <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                <div className="ps-block--shipping">
                  <div className="ps-block__panel">
                    {addresses &&
                      addresses.map((item) => (
                        <div
                          className={`addresses-container ${
                            item.IsDefault && "active"
                          }`}
                          onClick={() => this.onDefaultAddressChange(item)}
                        >
                          <div className="title">
                            <h5>{item.Name.toUpperCase()}</h5>
                          </div>
                          <div className="description-container">
                            <div className="description">
                              {item.AddressLine1}, {item.AddressLine2}
                            </div>
                            <div className="description">
                              {item.City}, {item.State} 
                            </div>
                            <div className="description">
                              {item.Country} - {item.Pin}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div>
                    <Tabs
                      defaultActiveKey="1"
                      onChange={(e) => this.getSlotsbyData(e)}
                    >
                      {shippingSlots &&
                        shippingSlots.map((slotData) => {
                          return (
                            slotData.Items &&
                            slotData.Items.slice(0, 11).map((item) => (
                              <TabPane
                                tab={
                                  <div className="slot-date-container">
                                    <div className="text">
                                      {moment(item.Date).format("ddd")}
                                    </div>
                                    <div className="text">
                                      {moment(item.Date).format("D")}
                                    </div>
                                  </div>
                                }
                                key={item.Date}
                              >
                                {item.Items &&
                                  item.Items.map((slot) => (
                                      <Radio value={slot.TimeFrom + slot.TimeTo}>
                                          {slot.TimeFrom}{" - "}{slot.TimeTo}
                                      </Radio>
                                  ))}
                              </TabPane>
                            ))
                          );
                        })}
                    </Tabs>
                  </div>
                  {/* <div className="ps-block__footer">
                    <Link to="/account/cart">
                      <i className="icon-arrow-left mr-2"></i>
                      Return to cart
                    </Link>
                  </div> */}
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 ">
                <div className="ps-block--shipping payment-conformation">
                  <div className="ps-block--payment-method">
                    <div className="ps-block__header">
                      <input
                        id="suggestion"
                        value={this.state.orderNote}
                        className="form-control"
                        name="suggestion"
                        type="text"
                        placeholder="Write your comment/suggestions"
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
                <div className="ps-form__orders">
                  <div className="ps-block--checkout-order">
                    <div className="ps-block__content">
                      <figure>
                        <figcaption>
                          <strong>Bill Details</strong>
                        </figcaption>
                      </figure>
                      <figure>
                        <figcaption>
                          <strong>Item Total</strong>
                          <strong>
                              {" "}
                              {cartData && cartData.ItemTotal
                                ? cartData.ItemTotal
                                : 0}
                            </strong>
                        </figcaption>
                      </figure>
                      <figure>
                        <figcaption>
                          <strong>Discount</strong>
                          <strong>
                            - {" "}
                            {cartData && cartData.Discount
                              ? cartData.Discount
                              : 0}
                          </strong>
                        </figcaption>
                      </figure>
                      <figure>
                        <figcaption>
                          <strong>Delivery Charges</strong>
                          <strong>{" "} 
                            {cartData && cartData.ShippingCharge
                                ? cartData.ShippingCharge
                                : 0}</strong>
                        </figcaption>
                      </figure>
                      <figure className="ps-block__total">
                        <h3>
                          To Pay
                          <strong>
                            {" "}
                            {cartData && cartData.TotalAmount
                              ? cartData.TotalAmount
                              : 0}
                          </strong>
                        </h3>
                      </figure>
                    </div>
                  </div>
                </div>

                {/* {cartData &&
                  cartData.TotalAmount &&
                  parseInt(cartData.TotalAmount) > 0 && (
                    <button
                      onClick={() => this.handleCheckOut()}
                      className="ps-btn ps-btn--fullwidth"
                    >
                      Continue
                    </button>
                  )} */}
              </div>
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
export default connect(mapStateToProps)(withRouter(Shipping));

// Testing Response as API is not working
const Result = [
  {
    Mode: "HomeDelivery",
    Items: [
      {
        Date: "2020-12-09T00:00:00",
        Items: [
          {
            Id: "c4aff090-f192-42f9-9101-510703b458a3",
            Date: "2020-12-09T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
      {
        Date: "2020-12-10T00:00:00",
        Items: [
          {
            Id: "0fa89c3b-457d-494a-9a0a-72c86682d87f",
            Date: "2020-12-10T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
      {
        Date: "2020-12-11T00:00:00",
        Items: [
          {
            Id: "61360c61-b192-48f3-bbfd-f6e9d8207fbe",
            Date: "2020-12-11T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
      {
        Date: "2020-12-12T00:00:00",
        Items: [
          {
            Id: "d2cac748-b23e-49fd-b340-ff7a77e34343",
            Date: "2020-12-12T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
      {
        Date: "2020-12-13T00:00:00",
        Items: [
          {
            Id: "d133cf3c-0c37-4294-a791-bf41c11fe0fe",
            Date: "2020-12-13T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
      {
        Date: "2020-12-14T00:00:00",
        Items: [
          {
            Id: "d7de2336-05d2-4d5f-9690-7bc5ffe7e516",
            Date: "2020-12-14T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
      {
        Date: "2020-12-15T00:00:00",
        Items: [
          {
            Id: "cd086633-9c56-4513-b738-712ae13b43f5",
            Date: "2020-12-15T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
      {
        Date: "2020-12-16T00:00:00",
        Items: [
          {
            Id: "67e583c4-edf8-49dd-bcdd-d12e62a63654",
            Date: "2020-12-16T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
      {
        Date: "2020-12-17T00:00:00",
        Items: [
          {
            Id: "2832c521-378b-4d80-9ea4-25843307f836",
            Date: "2020-12-17T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
      {
        Date: "2020-12-18T00:00:00",
        Items: [
          {
            Id: "53ef535d-2830-41e1-8665-e1dcb1487b5b",
            Date: "2020-12-18T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
      {
        Date: "2020-12-19T00:00:00",
        Items: [
          {
            Id: "d4e124f7-16a8-4fbb-8f11-403889cdbe79",
            Date: "2020-12-19T00:00:00",
            TimeFrom: "11:00:00",
            TimeTo: "18:00:00",
            IsHoliday: false,
            ShippingMode: "HomeDelivery",
            BusinessLocationId: "03e7a18d-9b84-43f3-9219-087f3603df22",
          },
        ],
      },
    ],
  },
];
