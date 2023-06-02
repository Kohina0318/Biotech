import React from "react";
import FooterDefault from "../../components/shared/footers/FooterDefault";
import HeaderDefault from "../../components/shared/headers/HeaderDefault";
import OrderDetail from "../../components/partials/account/OrderDetail";
import BreadCrumb from "../../components/elements/BreadCrumb";
import HeaderMobile from "../../components/shared/headers/HeaderMobile";
import NavigationList from "../../components/shared/navigation/NavigationList";

const OrderDetailPage = () => {
  const breadCrumb = [
    {
      text: "Home",
      url: "/",
    },
    {
      text: "Order Detail",
    },
  ];
  return (
    <div className="site-content">
      <HeaderDefault />
      <HeaderMobile />
      <NavigationList />
      <div className="ps-page--simple">
        <BreadCrumb breacrumb={breadCrumb} />
        <OrderDetail />
      </div>
      <FooterDefault />
    </div>
  );
};

export default OrderDetailPage;
