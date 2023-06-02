import React from "react";
import { Link } from "react-router-dom";

const BreadCrumb = ({ breacrumb }) => {
  return (
    <div className="ps-breadcrumb 2">
      <ul className="breadcrumb">
        {breacrumb.map((item) => {
          if (!item.url) {
            return <li key={item.text}>{item.text}</li>;
          } else {
            return (
              <li key={item.text}>
                <Link to={item.url}>{item.text}</Link>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default BreadCrumb;
