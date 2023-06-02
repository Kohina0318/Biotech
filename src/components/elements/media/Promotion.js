import React from "react";
import { Link } from "react-router-dom";
import { baseUrl } from "../../../repositories/Repository";

const Promotion = ({ link, image }) => {
  if (image) {
    return (
      <Link to={link}>
        <a className="ps-collection">
          <img src={`${baseUrl}${image.url}`} alt={process.env.REACT_APP_NAME} />
        </a>
      </Link>
    );
  } else {
    return (
      <Link to={link ? link : "/shop"}>
        <a className="ps-collection">
          <img src="/static/img/not-found.jpg" alt={process.env.REACT_APP_NAME} />
        </a>
      </Link>
    );
  }
};

export default Promotion;
