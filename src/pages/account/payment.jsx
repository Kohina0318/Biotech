import React from "react";
import FooterDefault from "../../components/shared/footers/FooterDefault";
import HeaderDefault from "../../components/shared/headers/HeaderDefault";
import BreadCrumb from "../../components/elements/BreadCrumb";
import Payment from "../../components/partials/account/Payment";
import HeaderMobile from "../../components/shared/headers/HeaderMobile";
import NavigationList from "../../components/shared/navigation/NavigationList";

const PaymentPage = () => {
  const breadCrumb = [
    {
      text: "Home",
      url: "/",
    },
    {
      text: "Cart",
      url: "/account/cart",
    },
    {
      text: "Payment",
    },
  ];
  return (
    <div className="site-content">
      <HeaderDefault />
      <HeaderMobile />
      <NavigationList />
      <div className="ps-page--simple">
        <BreadCrumb breacrumb={breadCrumb} />
        <Payment />
      </div>
      <FooterDefault />
    </div>
  );
};

export default PaymentPage;
