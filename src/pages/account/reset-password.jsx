import React from "react";
import FooterDefault from "../../components/shared/footers/FooterDefault";
import HeaderDefault from "../../components/shared/headers/HeaderDefault";
import BreadCrumb from "../../components/elements/BreadCrumb";
import ResetPassword from "../../components/partials/account/ResetPassword";
import HeaderMobile from "../../components/shared/headers/HeaderMobile";
import NavigationList from "../../components/shared/navigation/NavigationList";

const ResetPasswordPage = () => {
  const breadCrumb = [
    {
      text: "Home",
      url: "/",
    },
    {
      text: "Reset Password",
    },
  ];

  return (
    <div className="site-content">
      <HeaderDefault />
      <HeaderMobile />
      <NavigationList />
      <div className="ps-page--my-account">
        <BreadCrumb breacrumb={breadCrumb} />
        <ResetPassword />
      </div>
      <FooterDefault />
    </div>
  );
};

export default ResetPasswordPage;
