import React from "react";
import { Link } from "react-router-dom";
const Links = {
  consumerElectric: [
    {
      text: "Pharmacy Medicines",
      url: "/",
    },
  ],
};

const FooterLinks = () => (
  <div className="ps-footer__links">
    <p>
      <strong>Medicine:</strong>
      {Links.consumerElectric.map((item) => (
        <Link to={item.url} key={item.text}>
          {item.text}
        </Link>
      ))}
    </p>
  </div>
);

export default FooterLinks;
