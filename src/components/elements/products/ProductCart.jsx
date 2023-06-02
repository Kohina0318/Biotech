import React from "react";
import LazyLoad from "react-lazyload";
import { IMAGE_BASE_URL, NoImg } from "utilities/constants";

const ProductCart = ({ product, mediaBaseURL }) => {
  return (
    <div className="ps-product--cart">
      <div className="ps-product__thumbnail">
        <LazyLoad>
          {product.PrimaryMediaId ? (
            <img
              src={`${IMAGE_BASE_URL}${mediaBaseURL}${product.PrimaryMediaId}`}
              alt={product.ProductName}
            />
          ) : (
            <img src={NoImg} alt={product.ProductName} />
          )}
        </LazyLoad>
      </div>
      <div className="ps-product__content">
        <a href="#!" className="ps-product__title">
          {product.title}
        </a>
      </div>
    </div>
  );
};

export default ProductCart;
