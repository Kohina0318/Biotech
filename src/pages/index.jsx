import React, { Component } from "react";
import { connect } from "react-redux";
import KycStrip from "../components/partials/account/KycStrip";
import HeaderDefault from "../components/shared/headers/HeaderDefault";
import FooterFullwidth from "../components/shared/footers/FooterFullwidth";
import HomeBanner from "../components/partials/homepage/home-default/HomeBanner";
//import SiteFeatures from "../components/partials/homepage/home-default/SiteFeatures";
//import HomeAdsColumns from "../components/partials/homepage/home-default/HomeAdsColumns";
//import ConumerElectronics from "../components/partials/homepage/home-default/ConumerElectronics";
//import Clothings from "../components/partials/homepage/home-default/Clothings";
//import GardenAndKitchen from "../components/partials/homepage/home-default/GardenAndKitchen";
//import HomeAds from "../components/partials/homepage/home-default/HomeAds";
//import DownLoadApp from "../components/partials/commons/DownLoadApp";
//import NewArrivals from "../components/partials/homepage/home-default/NewArrivals";
//import Newletters from "../components/partials/commons/Newletters";
import HeaderMobile from "../components/shared/headers/HeaderMobile";
//import NavigationList from "../components/shared/navigation/NavigationList";
//import HomeDefaultDealOfDay from "../components/partials/homepage/home-default/HomeDefaultDealOfDay";
import HomeDefaultTopCategories from "../components/partials/homepage/home-default/HomeDefaultTopCategories";
import SubscribePopup from "../components/shared/SubscribePopup";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribe: false,
    };
  }
  render() {
    const { subscribe } = this.state;

    return (
      <div className="site-content">
        <HeaderDefault />
        <HeaderMobile />
        <SubscribePopup active={subscribe} />
        <main id="homepage-1">
          <HomeBanner />
          <div className="ps-container">
            <KycStrip />
          </div>
          <HomeDefaultTopCategories />
          {/*<SiteFeatures />
          <HomeDefaultDealOfDay collectionSlug="deal-of-the-day" />
          <HomeAdsColumns />
          <ConumerElectronics collectionSlug="consumer-electronics" />
          <Clothings collectionSlug="clothings" />
          <GardenAndKitchen collectionSlug="garden-and-kitchen" />
          <HomeAds />
          <NewArrivals collectionSlug="new-arrivals-products" />
          <DownLoadApp />
          <Newletters />*/}
        </main>
        <FooterFullwidth />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.auth;
};

export default connect(mapStateToProps)(Index);
