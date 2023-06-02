import React, { Component } from "react";
import { connect } from "react-redux";
import { Steps, Popconfirm } from "antd";
import { Link, withRouter } from "react-router-dom";
import API from "api/api";
import { IMAGE_BASE_URL, NoImg } from "utilities/constants";
import { languageLable } from "utilities/helpers";
import { Modal, Button } from 'react-bootstrap';
import * as moment from 'moment';

const { Step } = Steps;
var api;
class OrderTracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaBaseURL: null,
      orderData: null,
        orderHistory: null,
        shippingTracking: null,
        modal: false,
        shippingModel: false
    };
    api = new API();
  }

  componentDidMount = () => {
    const url = this.props.location.pathname.split("/");
    this.getOrderList(url[3]);
      this.getOrderHistory(url[3]);
      this.getShippingTracking(url[3]);
  };

  getOrderList = (id) => {
    api.get(`GetOrderById?transactionId=${id}`).then((response) => {
      if (response.StatusCode === 200 && response.Result) { 
        console.log("GetOrderById", response.Result)
        this.setState({
          orderData: response.Result,
        });
      }
    });
  };


  getOrderHistory = (id) => {
    api.get(`GetOrderHistory?orderId=${id}`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.setState({
          orderHistory: response.Result,
        });
      }
    });
    };

    getShippingTracking = (id) => {
        api.get(`GetShippingTracking?transactionId=${id}`).then((response) => {
            if (response.StatusCode === 200 && response.Result) {
                this.setState({
                    shippingTracking: response.Result,
                });
            }
        });
    };

  componentDidUpdate = (props) => {
    if (
      props.auth &&
      props.auth.appDefaultSetting &&
      props.auth.appDefaultSetting.ImageUrl &&
      !this.state.mediaBaseURL
    ) {
      this.setState({
        mediaBaseURL: this.props.auth.appDefaultSetting.ImageUrl,
      });
    }
  };

  handleCancleOrder = () => {
    api
      .put(
        `OrderCancellationRequestById?transactionId=${this.state.orderData.Id}`
      )
      .then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          return window.location.reload(false);;
        }
      });
  };

    renderStatus = () => {
        const br = `\n`;
    const { orderData } = this.state;
    const { orderHistory } = this.state;
    const { shippingTracking } = this.state;
      const { selectedLanguageData } = this.props.app;
    let currentStep = 1;
    const OrderStatus = {
      Draft: 'Draft',
      Failed: 'Failed',
      Ordered: 'Ordered',
      Confirmed: 'Confirmed',
      Executed: 'Executed',
      Rejected: 'Rejected',
      CancellationRequested: 'CancellationRequested',
      Cancelled: 'Cancelled',
      Completed: 'Completed',
      ReturnRequested: 'ReturnRequested',
      PartialReturned: 'PartialReturned',
      FullReturned: 'FullReturned',
      Returned: 'Returned',
      Delivered: 'Delivered',
      Pending: 'Pending',
      ReadyForDelivery: 'ReadyForDelivery',
      InTransit: 'InTransit',
      Assigned: 'Assigned',
      Accepted: 'Accepted',
      Rejected: 'Rejected',
      OutForDelivery: 'OutForDelivery',
      DeliveryAttemptFailed: 'DeliveryAttemptFailed',
      Delayed: 'Delayed'
    }

    let statuss = [OrderStatus.Ordered];
    if (orderData && orderData.ShippingOrder) {
      switch (orderData.Status) {
        case OrderStatus.Ordered:
        case OrderStatus.Confirmed:
        case OrderStatus.Completed:
          if (orderData.Status === OrderStatus.Confirmed) currentStep = 2;
          if (orderData.ShippingOrder.ShippingStatus && orderData.ShippingOrder.ShippingStatus === OrderStatus.InTransit) currentStep = 3;
          if (orderData.ShippingOrder.ShippingStatus && orderData.ShippingOrder.ShippingStatus === OrderStatus.OutForDelivery) currentStep = 4;
          if (orderData.ShippingOrder.ShippingStatus && orderData.ShippingOrder.ShippingStatus === OrderStatus.Delivered) currentStep = 5;
          statuss = [...statuss, OrderStatus.Confirmed, OrderStatus.InTransit, OrderStatus.OutForDelivery, OrderStatus.Delivered];
          break;
        case OrderStatus.Executed:
          if (orderData.Status === OrderStatus.Executed) currentStep = 3;
          if (orderData.ShippingOrder.ShippingStatus && orderData.ShippingOrder.ShippingStatus === OrderStatus.InTransit) currentStep = 4;
          if (orderData.ShippingOrder.ShippingStatus && orderData.ShippingOrder.ShippingStatus === OrderStatus.OutForDelivery) currentStep = 5;
          if (orderData.ShippingOrder.ShippingStatus && orderData.ShippingOrder.ShippingStatus === OrderStatus.Delivered) currentStep = 6;
          statuss = [...statuss, OrderStatus.Confirmed, OrderStatus.Executed, OrderStatus.InTransit, OrderStatus.OutForDelivery, OrderStatus.Delivered];
          break;
        case OrderStatus.Rejected:
          currentStep = 3;
          statuss = [...statuss, OrderStatus.Confirmed, OrderStatus.Rejected];
          break;
        case OrderStatus.CancellationRequested:
        case OrderStatus.Cancelled:
          if (orderData.Status === OrderStatus.CancellationRequested) currentStep = 3;
          if (orderData.Status === OrderStatus.Cancelled) currentStep = 4;
          statuss = [...statuss, OrderStatus.Confirmed, OrderStatus.CancellationRequested, OrderStatus.Cancelled];
          break;
        case OrderStatus.ReturnRequested:
        case OrderStatus.Returned:
          if (orderData.ShippingOrder.ShippingStatus && orderData.ShippingOrder.ShippingStatus === OrderStatus.Delivered) currentStep = 2;
          if (orderData.Status === OrderStatus.ReturnRequested) currentStep = 3;
          if (orderData.Status === OrderStatus.Returned) currentStep = 4;
          statuss = [...statuss, OrderStatus.Delivered, OrderStatus.ReturnRequested, OrderStatus.Returned];
          break;
        case OrderStatus.Failed:
          currentStep = 2;
          statuss = [...statuss, OrderStatus.Failed];
          break;
        default:
          statuss = [...statuss];
          break;
      }
    } else {
      switch (orderData.Status) {
        case OrderStatus.Ordered:
        case OrderStatus.Confirmed:
        case OrderStatus.Completed:
        case OrderStatus.Executed:
          if (orderData.Status === OrderStatus.Confirmed) currentStep = 2;
          if (orderData.Status === OrderStatus.Executed) currentStep = 3;
          if (orderData.Status === OrderStatus.Completed) currentStep = 4;
          statuss = [...statuss, OrderStatus.Confirmed, OrderStatus.Executed, OrderStatus.Completed];
          break;
        case OrderStatus.Rejected:
          currentStep = 3;
          statuss = [...statuss, OrderStatus.Confirmed, OrderStatus.Rejected];
          break;
        case OrderStatus.CancellationRequested:
        case OrderStatus.Cancelled:
          if (orderData.Status === OrderStatus.CancellationRequested) currentStep = 3;
          if (orderData.Status === OrderStatus.Cancelled) currentStep = 4;
          statuss = [...statuss, OrderStatus.Confirmed, OrderStatus.CancellationRequested, OrderStatus.Cancelled];
          break;
        case OrderStatus.ReturnRequested:
        case OrderStatus.Returned:
          if (orderData.Status === OrderStatus.ReturnRequested) currentStep = 3;
          if (orderData.Status === OrderStatus.Returned) currentStep = 4;
          statuss = [...statuss, OrderStatus.Completed, OrderStatus.ReturnRequested, OrderStatus.Returned];
          break;
        case OrderStatus.Failed:
          currentStep = 2;
          statuss = [...statuss, OrderStatus.Failed];
          break;
        default:
          statuss = [...statuss];
          break;
      }
    }   

    let steps = <Step
        title={languageLable(selectedLanguageData, "No Shipping Tracking found!")}
    />;

    if (shippingTracking) {
        console.log(shippingTracking["Histories"]);
        steps = shippingTracking["Histories"].map(status => (
            <Step
                title={languageLable(selectedLanguageData, status["Staus"])}
                subTitle={moment(status["CreatedAt"]).format('DD-MM-YYYY h:mm A')}
                description={languageLable(selectedLanguageData, "Location: ") + languageLable(selectedLanguageData, status["Location"]) + ',\n' + languageLable(selectedLanguageData, "Message: ") + languageLable(selectedLanguageData, status["Message"])}
            />
        ));
    }

    return <div className="col-lg-12 col-12">
      <div className="steps-container">
        <Steps current={currentStep}>
          {statuss.map(status => (
            <Step
              title={languageLable(selectedLanguageData, status)}
            />
          ))}
        </Steps>
        </div>
        <div className = "col-md-12 right mb-5">  
      <a href="javascript:;" className="ps-btn mr-2" onClick={e => this.modalOpen(e)}>
            {languageLable(selectedLanguageData, "Status Summary") }  
      </a>
            <a href="javascript:;" className="ps-btn" onClick={e => this.modalShippingOpen(e)}>
                {languageLable(selectedLanguageData, "Shipping Tracking")}
            </a>
    </div>
        <Modal show={this.state.modal} handleClose={e => this.modalClose(e)}>
      <div className="ps-section--shopping ps-shopping-cart ps-order-details">
        <div className="ps-container">
        <div className="steps-container">
        <Steps direction="vertical" current={50}>
          {orderHistory.map(status => (
              <Step 
                title={languageLable(selectedLanguageData, status["TransactionStatus"])}
                description={moment(status["CreatedOn"]).format('DD-MM-YYYY h:mm A')}
             />
          ))}
        </Steps>
        </div>
        <div className="form-group" style={{ display:"flex",justifyContent:"right",}}>
            <button className="ps-btn" onClick={e => this.modalClose(e)} type="button" >
             {languageLable(selectedLanguageData, "CLOSE")}
          </button>
        </div>
        </div>
        
        </div>
        </Modal>

        <Modal show={this.state.shippingModel} handleClose={e => this.modalShippingClose(e)}>
            <div className="ps-section--shopping ps-shopping-cart ps-order-details">
                <div className="ps-container">
                    <div className="steps-container">
                        <Steps direction="vertical" current={50}>
                            {steps}
                        </Steps>
                    </div>
                    <div className="form-group" style={{ display:"flex",justifyContent:"right",}}>
                        <button className="ps-btn" onClick={e => this.modalShippingClose(e)} type="button">
                         {languageLable(selectedLanguageData, "CLOSE")}
                        </button>
                    </div>
                </div>

            </div>
        </Modal>
    </div>;
  };

    modalOpen() {
    this.setState({ modal: true });
    }

    modalClose() {
        this.setState({ modal: false });
    }

    modalShippingOpen() {
        this.setState({ shippingModel: true });
    }

    modalShippingClose() {
        this.setState({ shippingModel: false });
    }
 

  render() {
    const { orderData } = this.state;

    const { mediaBaseURL } = this.state;
    const { selectedLanguageData } = this.props.app;
    const currencySetting = localStorage.getItem('currency');

    let totalQty = 0;
    if (orderData && orderData.OrderItemsViewModel) {
      orderData.OrderItemsViewModel.map((item) => {
        totalQty += item.Quantity
      });
    }

     
    return (
      <div className="ps-section--shopping ps-shopping-cart ps-order-details">
        <div className="ps-container">
          {orderData && (
            <div className="ps-section__content">
              <div className="table-responsive">
                <div className="row">
                  {this.renderStatus()}
                  <div className="col-sm-12 col-lg-4 col-4 ">
                    <div className="payment-details">
                      <div className="item">
                        <h4>
                          {languageLable(
                            selectedLanguageData,
                            "Payment Details"
                          )}
                        </h4>
                      </div>
                      
                    <div className="item-container">
                        <div className="name">
                            {languageLable(selectedLanguageData, "Order Date")}
                        </div>
                        <div className="value">
                            {" "}
                            <strong>{moment(orderData.TransactionDate).format('DD-MM-YYYY h:mm A')}</strong>
                        </div>
                    </div>
                    <div className="item-container">
                        <div className="name">
                            {languageLable(selectedLanguageData, "Order No")}
                        </div>
                        <div className="value">
                            {" "}
                            <strong>{orderData.OrderRefNumber}</strong>
                        </div>
                    </div>
                      <div className="item-container">
                        <div className="name">
                          {languageLable(selectedLanguageData, "Payment Type")}
                        </div>
                        <div className="value">
                          <strong>
                            {languageLable(
                              selectedLanguageData,
                              orderData.PaymentMode === "COD"
                                ? "Pay Later"
                                : orderData.PaymentMode
                            )}
                          </strong>
                        </div>
                      </div>
                      <div className="item-container">
                        <div className="name">
                          {languageLable(selectedLanguageData, "Status")}
                        </div>
                        <div className="value">
                          <strong>{languageLable(selectedLanguageData, orderData.Status)}</strong>
                        </div>
                      </div>
                      <div className="item-container">
                        <div className="name">
                          {languageLable(
                            selectedLanguageData,
                            "Payment Status"
                          )}
                        </div>
                        <div className="value">
                          <strong>
                            {languageLable(
                              selectedLanguageData,
                              orderData.PaymentStatus
                            )}
                          </strong>
                        </div>
                      </div>
                      <div className="item-container">
                        <div className="name">
                          {languageLable(selectedLanguageData, "Total Items")}
                        </div>
                        <div className="value">
                          <strong>{orderData.ItemCount}</strong>
                        </div>
                      </div>
                      <div className="item-container">
                        <div className="name">
                          {languageLable(selectedLanguageData, "Total Quantity")}
                        </div>
                        <div className="value">
                          <strong>{totalQty}</strong>
                        </div>
                      </div>
                      <div className="item-container">
                        <div className="name">
                          {languageLable(selectedLanguageData, "Total")}
                        </div>
                        <div className="value">
                          <strong>{currencySetting ? currencySetting : "₹"} {orderData.SubTotal}</strong>
                        </div>
                      </div>

                      <div className="item-container">
                        <div className="name">
                          {languageLable(selectedLanguageData, "Wallet Amount")}
                        </div>
                        <div className="value">
                          <strong>{currencySetting ? currencySetting : "₹"} {orderData.WalletAmount}</strong>
                        </div>
                      </div>

                      <div className="item-container">
                        <div className="name">
                          {languageLable(
                            selectedLanguageData,
                            "Delivery Charges"
                          )}
                        </div>
                        <div className="value">
                          <strong>{currencySetting ? currencySetting : "₹"} {" "}
                            {orderData && orderData.ShippingCharges
                              ? orderData.ShippingCharges
                              : 0}</strong>
                        </div>
                      </div>
                      <div className="item-container">
                        <div className="name">
                          {languageLable(
                            selectedLanguageData,
                            "Discount / Promo"
                          )}
                        </div>
                        <div className="value">
                          <strong>({currencySetting ? currencySetting : "₹"} {" "}
                            {orderData && orderData.OfferDiscount
                              ? orderData.OfferDiscount
                              : 0}{" "}
                            )</strong>
                        </div>
                      </div>
                      <hr />
                      <div className="item-container">
                        <div className="name">
                          {languageLable(selectedLanguageData, "Total")}
                        </div>
                        <div className="value">
                          <strong>{currencySetting ? currencySetting : "₹"} {orderData.TotalAmount}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-lg-8 col-8 ">
                    <table className="table ps-table--shopping-cart">
                      <thead>
                        <tr>
                          <th>
                            {languageLable(selectedLanguageData, "Product")}
                          </th>
                          <th>{languageLable(selectedLanguageData, " ")}</th>
                          <th>
                            {languageLable(selectedLanguageData, "Packing Size")}
                          </th>
                          <th>
                            {languageLable(selectedLanguageData, "Quantity")}
                          </th>
                          <th>
                            {languageLable(selectedLanguageData, "Price")}
                          </th>
                          <th>
                            {languageLable(selectedLanguageData, "Total")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderData &&
                          orderData.OrderItemsViewModel &&
                          orderData.OrderItemsViewModel.map((item, index) => (
                            <tr key={index}>
                              <td style={{ height: "100px", width: "100px", textAlign: "center" }}>
                                {item.ProductMediaId ? (
                                  <img
                                    src={`${IMAGE_BASE_URL}${mediaBaseURL}${item.ProductMediaId}`}
                                    alt={
                                      item.ProductDetails[0] &&
                                      item.ProductDetails[0].Name
                                    }
                                  />
                                ) : (
                                  <img
                                    src={NoImg}
                                    alt={
                                      item.ProductDetails[0] &&
                                      item.ProductDetails[0].Name
                                    }
                                  />
                                )}
                              </td>
                              <td>
                                {item.ProductDetails[0] &&
                                  item.ProductDetails[0].Name}

                                {item.Attributes &&
                                  item.Attributes.length > 0 &&
                                  item.Attributes.map((i) => (
                                    <div className="attribute">
                                      {i.attributeName}
                                    </div>
                                  ))}
                              </td>
                              <td style={{ textAlign: "center" }}>{item.PackingSize}{" "}{item.Unit}</td>
                              <td style={{ textAlign: "center" }}>{item.Quantity}</td>
                              <td style={{ textAlign: "center" }}>{currencySetting ? currencySetting : "₹"} {item.Price}</td>
                              <td style={{ textAlign: "center" }}>{currencySetting ? currencySetting : "₹"} {parseFloat(item.Quantity * item.Price).toFixed(2)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="ps-section__cart-actions">
                <div className="float-left">
                  <Link to="/account/orders">
                    <i className="icon-arrow-left mr-2"></i>
                    {languageLable(selectedLanguageData, "Back to Orders")}
                  </Link>
                </div>
                {(orderData.Status === "Ordered" ||
                  orderData.Status === "Confirmed") && (
                    <div className="float-right pointer">
                      <Popconfirm
                        placement="top"
                        title={languageLable(
                          selectedLanguageData,
                          "Are you sure?"
                        )}
                        onConfirm={() => this.handleCancleOrder()}
                        okText={languageLable(selectedLanguageData, "Yes")}
                        cancelText={languageLable(selectedLanguageData, "No")}
                      >
                        <i className="icon-cross mr-2"></i>
                        {languageLable(selectedLanguageData, "Cancel Orders")}
                        {/* <img
                                  src={DeleteIcon}
                                  alt={languageLable(
                                    selectedLanguageData,
                                    "Cancel Orders"
                                  )}
                                  className="pointer"
                                /> */}
                      </Popconfirm>
                      {/* <Link to="#" onClick={() => this.handleCancleOrder()}>
                      <i className="icon-cross mr-2"></i>
                      {languageLable(selectedLanguageData, "Cancel Orders")}
                    </Link> */}
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(OrderTracking));
