import React from "react";
import { Link } from "react-router-dom";

const BannerItem = (source) => {
  if (source) {
    return (
      <Link to="/">
        <img src={source.source} alt={process.env.REACT_APP_NAME} />
      </Link>
    );
  } else {
    return (
      <Link to="/shop" className="ps-collection">
        <img src="/static/img/not-found.jpg" alt={process.env.REACT_APP_NAME} />
      </Link>
    );
  }
};

export default BannerItem;
