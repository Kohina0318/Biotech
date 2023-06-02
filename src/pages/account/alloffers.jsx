import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import API from "api/api";
import { languageLable } from "utilities/helpers";
import { Button ,notification } from "antd";
import Payment from "pages/account/payment";


var api;
class AllOffers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offerList: [],
    };
    api = new API();
  }

  componentDidMount = () => {
    this.getOffersList();
  };

  getOffersList = () => {
    const userDetails = (localStorage.getItem('defaultAddress'));
    const locationIdJsonParse = JSON.parse(userDetails);
    const locationId = locationIdJsonParse.BusinessCustomerAddressMapping.LocationId;

    api.get(`GetMyOffers?locationId=${locationId}`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
          console.log("response At Line 28",response.Result);
        this.setState({
          offerList: response.Result,
        });
      }
    });
  };


  handleCoupanCode = (values,couponcode,title) => {
    
    const { selectedLanguageData } = this.props.app;
    
    console.log("console...values",values)
    console.log("coupononcode.....",couponcode)
    const userDetails = (localStorage.getItem('defaultAddress'));
    const locationIdJsonParse = JSON.parse(userDetails);
    const locationId = locationIdJsonParse.BusinessCustomerAddressMapping.LocationId;

  api.get(`ApplyOffer?offerId=&couponCode=${couponcode}&locationId=${locationId}`).then((response) => {
    console.log(response)
    if (response.StatusCode === 200 && response.Result) {
      if (response.Result.OfferViewModel) {
        console.log(response.Result.OfferViewModel)
        console.log("Response......",response)
        this.setState({
          checkoutData: response.Result,
          walletbalance: response.Result.WalletBalance,
          walletamount: response.Result.WalletAmount,
          coupandiscount: response.Result.OfferDiscount,
          coupancode: response.Result.OfferViewModel.CoponCode,
        });
        if ( response.Result.OfferDiscount > 0) {
       this.props.history.push({pathname:"/account/payment",state:{response:response,couponcode:couponcode, offertitle:title,coupondiscount: response.Result.OfferDiscount,PaymentModes:response.Result.PaymentModes}})
        }else{
          notification.error({
            message: languageLable(
              selectedLanguageData,
              "This Coupon code is not available!"
            ),
          });
        }
        // this.renderRemoveCoupanCode();
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
  });
};




  render() {
    const { offerList } = this.state;
    const { selectedLanguageData } = this.props.app;
    

    return (
      <div className="ps-section--shopping ps-shopping-cart">
        <div className="ps-container">
          <div className="ps-section__content">
            <div className="table-responsive">
              <div className="row">
                <div className="col-lg-12 col-12 ">
                  <table className="table ps-table--shopping-cart">
                    <thead>
                      <tr width="100%">
                        <th className="text-center" width="20%">{languageLable(selectedLanguageData, " ")}</th>
                        <th className="text-center" width="20%">{languageLable(selectedLanguageData, "Offer Title")}</th>
                        <th className="text-center" width="20%">{languageLable(selectedLanguageData, "Description")}</th>
                        <th className="text-center" width="15%">{languageLable(selectedLanguageData, "Offer Code")}</th>
                        <th className="text-center" width="15%">{languageLable(selectedLanguageData, "Max Amount")}</th>
                        <th className="text-center" width="10%">{languageLable(selectedLanguageData, "Status")}</th>
                        <th className="text-center" width="10%">{languageLable(selectedLanguageData, " ")}</th>
                      </tr>
                    </thead>
                    <tbody style={{borderTop:'0px solid black'}}>
                      {offerList &&
                        offerList.map((offer, index) => (
                         
                          <tr key={index} width="100%">
                            <td  className="text-center" width="20" >
                              <img style={{width:200,height:90,borderRadius:7}} src={`https://artisuat.biotech.archisys.biz/api/media/GetMediaById?id=${offer.BannerMediaId}`}></img>
                            </td>
                            <td className="text-center"  width="20%" style={{fontWeight:"bold"}} >{languageLable(selectedLanguageData, offer.Title)}</td>
                            <td className="text-center"  width="20%" >{languageLable(selectedLanguageData, offer.Description)}</td>
                            <td className="text-center"  width="15%" ><a  style={{color:"#50CEE5",border:'2px dashed',borderRadius:8, padding:4,}}>{languageLable(selectedLanguageData, offer.CoponCode)}</a></td>
                            <td className="text-center"  width="15%" >{languageLable(selectedLanguageData, offer.MaxAmount)}</td>
                            <td className="text-center"  width="10%">{languageLable(selectedLanguageData, offer.Status)}</td>
                            <td className="text-center" width="10%">
                              <div 
                              // onClick={() => this.props.history.push({pathname:"/account/payment",state:{couponcode:offer.CoponCode, offertitle:offer.Title}})}
                               onClick={(value)=>this.handleCoupanCode(value,offer.CoponCode,offer.Title,offer.PaymentModes)}
                              >
                              <Button variant="contained" style={{background: '#396470',color:"#fff",borderRadius:5, }}>{languageLable(selectedLanguageData,"Apply")}</Button>
                              </div>
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
export default connect(mapStateToProps)(withRouter(AllOffers));
