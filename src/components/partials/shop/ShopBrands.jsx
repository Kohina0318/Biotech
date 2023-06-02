import React from "react";
import { Link } from "react-router-dom";

const ShopBrands = () => (
  <div className="ps-shop-brand">
    <Link to="/shop">
      <img src="/static/img/brand/1.jpg" alt={process.env.REACT_APP_NAME} />
    </Link>
    <Link to="/shop">
      <img src="/static/img/brand/2.jpg" alt={process.env.REACT_APP_NAME} />
    </Link>
    <Link to="/shop">
      <img src="/static/img/brand/3.jpg" alt={process.env.REACT_APP_NAME} />
    </Link>
    <Link to="/shop">
      <img src="/static/img/brand/4.jpg" alt={process.env.REACT_APP_NAME} />
    </Link>
    <Link to="/shop">
      <img src="/static/img/brand/5.jpg" alt={process.env.REACT_APP_NAME} />
    </Link>
    <Link to="/shop">
      <img src="/static/img/brand/6.jpg" alt={process.env.REACT_APP_NAME} />
    </Link>
    <Link to="/shop">
      <img src="/static/img/brand/7.jpg" alt={process.env.REACT_APP_NAME} />
    </Link>
    <Link to="/shop">
      <img src="/static/img/brand/8.jpg" alt={process.env.REACT_APP_NAME} />
    </Link>
  </div>
);

export default ShopBrands;
