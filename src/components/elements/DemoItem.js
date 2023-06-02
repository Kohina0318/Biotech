import React from "react";
import { Link } from "react-router-dom";

const DemoItem = ({ data }) => (
  <div className="ps-block--demo">
    <div className="ps-block__thumbnail">
      <Link to={data.link} key={data.text}>
        <img src={data.image} alt={data.text} />
      </Link>
    </div>

    <div className="ps-block__content">
      <Link to={data.link}>
        <Link className="ps-block__title" to={"/"}>
          {data.text}
        </Link>
      </Link>
    </div>
  </div>
);

export default DemoItem;
