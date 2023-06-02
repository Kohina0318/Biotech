import React from "react";
import { Link } from "react-router-dom";

const ModuleProductDetailSpecification = () => (
  <div className="ps-product__specification">
    <Link to="/page/blank" className="report">
      Report Abuse
    </Link>
    <p>
      <strong>SKU:</strong> SF1133569600-1
    </p>
    <p className="categories">
      <strong> Categories:</strong>
      <Link to="/shop">Consumer Electronics</Link>
      <Link to="/shop">Refrigerator</Link>
      <Link to="/shop">Babies & Moms</Link>
    </p>
    <p className="tags">
      <strong> Tags</strong>
      <Link to="/shop">sofa</Link>
      <Link to="/shop">technologies</Link>
      <Link to="/shop">wireless</Link>
    </p>
  </div>
);

export default ModuleProductDetailSpecification;
