import React from "react";

import { BackTop } from "antd";

const DefaultLayout = ({ children }) => (
  <div className="layout--default">
    {children}
    <div id="loader-wrapper">
      <div className="loader-section section-left"></div>
      <div className="loader-section section-right"></div>
    </div>
    <BackTop>
      <button className="ps-btn--backtop">
        <i className="icon-arrow-up"></i>
      </button>
    </BackTop>
  </div>
);

export default DefaultLayout;
