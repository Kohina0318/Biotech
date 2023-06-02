import React from "react";
import { Switch, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoutesList from "./RoutesList";
// B2B
import LoginWithEmail from "pages/account/login";
import RegisterWithEmail from "pages/account/register";
import VerifyOtp from "pages/account/verify-otp";

// B2C
import LoginWithPhone from "pages/account/login-phone";
import RegisterWithPhone from "pages/account/register-phone";
import VerifyOtpWithPhone from "pages/account/verify-otp-phone";

import ForgotPassword from "pages/account/forgot-password";
import VerifyForgotPasswordOtp from "pages/account/verify-forgot-password-otp";
import ResetPassword from "pages/account/reset-password";
import Dashboard from "pages";
import Shop from "pages/shop";
import ProductDetails from "pages/product/productDetails";
import StoreList from "pages/vendor/store-list";
import { APP_SETTINGS } from "utilities/constants";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        {APP_SETTINGS.isB2B ? (
          <Route path={"/account/login"} component={() => <LoginWithEmail />} />
        ) : (
          <Route path={"/account/login"} component={() => <LoginWithPhone />} />
        )}

        {APP_SETTINGS.isB2B ? (
          <Route
            path={"/account/register"}
            component={() => <RegisterWithEmail />}
          />
        ) : (
          <Route
            path={"/account/register"}
            component={() => <RegisterWithPhone />}
          />
        )}

        {APP_SETTINGS.isB2B ? (
          <Route path={"/account/verify-otp"} component={() => <VerifyOtp />} />
        ) : (
          <Route
            path={"/account/verify-otp"}
            component={() => <VerifyOtpWithPhone />}
          />
        )}

        <Route path={"/store-list"} component={() => <StoreList />} />
        <Route path={"/search-product/:id"} component={() => <Shop />} />
        <Route
          path={"/product-details/:id/:type"}
          component={() => <ProductDetails />}
        />
        <Route
          path={"/account/forgot-password"}
          component={() => <ForgotPassword />}
        />
        <Route
          path={"/account/verify-forgot-password-otp"}
          component={VerifyForgotPasswordOtp}
        />
        <Route
          path={"/account/reset-password"}
          component={() => <ResetPassword />}
        />
        <Route path={"/search"} component={() => <Shop />} />
        <Route path={"/"} exact={true} component={() => <Dashboard />} />
        <ProtectedRoute>
          {RoutesList.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
        </ProtectedRoute>
      </Switch>
    );
  }
}

export default Routes;
