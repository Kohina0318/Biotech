import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import API from "api/api";
import { languageLable } from "utilities/helpers";

var api;
class OrderTracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaBaseURL: null,
      orderList: [],
    };
    api = new API();
  }

  componentDidMount = () => {
    this.getOrderList();
  };

  getOrderList = () => {
    api.get(`GetOrders`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.setState({
          orderList: response.Result,
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

  render() {
    const { orderList } = this.state;
    const { selectedLanguageData } = this.props.app;
    const  currencySetting  = localStorage.getItem('currency');

    return (
      <div className="ps-section--shopping ps-shopping-cart">
        <div className="ps-container">
          <div className="ps-section__content">
            <div className="table-responsive">
              <div className="row">
                <div className="col-lg-12 col-12 ">
                  <table className="table ps-table--shopping-cart">
                    <thead>
                      <tr width="100%" >
                        <th className="text-center" width="20%">{languageLable(selectedLanguageData, "Order No")}</th>
                        <th className="text-center" width="25%">{languageLable(selectedLanguageData, "Total")}</th>
                        <th className="text-center" width="25%">{languageLable(selectedLanguageData, "Status")}</th>
                        <th className="text-center" width="30%">{languageLable(selectedLanguageData, "Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList &&
                        orderList.map((order, index) => (
                          <tr key={index} width="100%">
                            <td className="text-center" width="20%">{order.OrderRefNumber}</td>
                            <td className="text-center" width="25%">{currencySetting}{" "}{order.TotalAmount}</td>
                            <td className="text-center" width="25%">{languageLable(selectedLanguageData, order.Status)}</td>
                            <td className="text-center" width="30%">
                              <Link
                                to={`/account/order-detail/${order.Id}`}
                                className="ps-btn"
                              >
                                {languageLable(
                                  selectedLanguageData,
                                  "View Details"
                                )}
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="ps-section__cart-actions">
              <Link to="/">
                <i className="icon-arrow-left mr-2"></i>
                {languageLable(selectedLanguageData, "Back to Categories")}
              </Link>
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
export default connect(mapStateToProps)(OrderTracking);
