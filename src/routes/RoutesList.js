import React from "react";

import UserInformation from "pages/account/user-information";
import Notifications from "pages/account/notifications";
import KYC from "pages/account/kyc-page";
import EditAddress from "pages/account/edit-address";
import Cart from "pages/account/shopping-cart";
import Payment from "pages/account/payment";
import ChnagePassword from "pages/account/change-password";
import AddAddress from "pages/account/add-address";
import OrderTraking from "pages/account/order-tracking";
import OrderDetail from "pages/account/order-detail";
import Shipping from "pages/account/shipping";
import Wallet from "pages/account/Wallet";
import OffersPage from "pages/account/offers";
import Loyalty from "pages/account/Loyalty"
import PaymentHistory from "pages/account/PaymentHistory"


export default [
  {
    path: "/account/user-information",
    exact: true,
    component: () => <UserInformation />,
  },
  {
    path: "/account/notifications",
    exact: true,
    component: () => <Notifications />,
  },
  {
    path: "/account/edit-address",
    exact: true,
    component: () => <EditAddress />,
  },
  {
    path: "/account/kyc",
    exact: true,
    component: () => <KYC />,
  },
  {
    path: "/account/cart",
    exact: true,
    component: () => <Cart />,
  },
  {
    path: "/account/payment",
    exact: true,
    component: () => <Payment />,
  },
  {
    path: "/account/change-password",
    exact: true,
    component: () => <ChnagePassword />,
  },
  {
    path: "/account/add-address",
    exact: true,
    component: () => <AddAddress />,
  },
  {
    path: "/account/orders",
    exact: true,
    component: () => <OrderTraking />,
  },
  {
    path: "/account/order-detail/:id",
    exact: true,
    component: () => <OrderDetail />,
  },
  {
    path: "/account/shipping",
    exact: true,
    component: () => <Shipping />,
  },
  {
    path: "/account/wallet",
    exact: true,
    component: () => <Wallet />,
  },
  {
    path: "/account/offers",
    exact: true,
    component: () => <OffersPage />,
  },
  {
    path: "/account/loyalty",
    exact: true,
    component: () => <Loyalty />,
  },
  {
    path: "/account/payment-history",
    exact: true,
    component: () => <PaymentHistory />,
  },

  
];
