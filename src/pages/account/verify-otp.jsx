import React from "react";
import FooterDefault from "../../components/shared/footers/FooterDefault";
import HeaderDefault from "../../components/shared/headers/HeaderDefault";
import BreadCrumb from "../../components/elements/BreadCrumb";
import VerifyOtp from "../../components/partials/account/VerifyOtp";
import HeaderMobile from "../../components/shared/headers/HeaderMobile";
import NavigationList from "../../components/shared/navigation/NavigationList";

const VerifyOtpPage = () => {
  const breadCrumb = [
    {
      text: "Home",
      url: "/",
    },
    {
      text: "User Verification",
    },
  ];

  return (
    <div className="site-content">
      {console.log("test")}
      <HeaderDefault />
      <HeaderMobile />
      <NavigationList />
      <div className="ps-page--my-account">
        <BreadCrumb breacrumb={breadCrumb} />
        <VerifyOtp />
      </div>
      <FooterDefault />
    </div>
  );
};

export default VerifyOtpPage;
