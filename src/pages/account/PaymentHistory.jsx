import React from "react";
import FooterDefault from "../../components/shared/footers/FooterDefault";
import HeaderDefault from "../../components/shared/headers/HeaderDefault";
import BreadCrumb from "../../components/elements/BreadCrumb";
import HeaderMobile from "../../components/shared/headers/HeaderMobile";
import NavigationList from "../../components/shared/navigation/NavigationList";
import PaymentHistory from "components/partials/account/PaymentHistory";

const MyAccountPage = () => {
  const breadCrumb = [
    {
        text: "Home",
        url: "/",
      },
      {
        text: "PaymentHistory",
      },
  ];
  return (
    <div className="site-content">
      <HeaderDefault />
      <HeaderMobile />
      <NavigationList />
      <div className="ps-page--my-account">
        <BreadCrumb breacrumb={breadCrumb} />
        <PaymentHistory />
        </div>
      <FooterDefault />
    </div>
  );
};

export default MyAccountPage;


