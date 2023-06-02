import React from "react";
import FooterDefault from "../../components/shared/footers/FooterDefault";
import HeaderDefault from "../../components/shared/headers/HeaderDefault";
import BreadCrumb from "../../components/elements/BreadCrumb";
import Wallet from "../../components/partials/account/Wallet";
import HeaderMobile from "../../components/shared/headers/HeaderMobile";
import NavigationList from "../../components/shared/navigation/NavigationList";

const MyAccountPage = () => {
  const breadCrumb = [
    {
      text: "Home",
      url: "/",
    },
    {
      text: "Wallet",
    },
  ];
  return (
    <div className="site-content">
      <HeaderDefault />
      <HeaderMobile />
      <NavigationList />
      <div className="ps-page--my-account">
        <BreadCrumb breacrumb={breadCrumb} />
        <Wallet />
      </div>
      <FooterDefault />
    </div>
  );
};

export default MyAccountPage;
