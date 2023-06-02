import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Product from "../../../components/elements/products/Product";
import { carouselStandard } from "../../../utilities/carousel-helpers";

class CategoriesBestSeller extends Component {
  render() {
    const { collections } = this.props;
    let products = [];
    if (collections.length > 0) {
      products = collections.find(
        (collection) => collection.slug === "shop-best-seller-items"
      ).products;
    }
    return (
      <div className="ps-product-list ps-product-list--2">
        <div className="ps-section__header">
          <h3>Best Seller Items</h3>
          <ul className="ps-section__links">
            <li>
              <Link to="/shop">Clothing & Apparel</Link>
            </li>
            <li>
              <Link to="/shop">Garden & Kitchen</Link>
            </li>
            <li>
              <Link to="/shop">Consumer Electrics</Link>
            </li>
          </ul>
        </div>
        <div className="ps-section__content">
          <Slider {...carouselStandard} className="ps-carousel">
            {products &&
              products.length > 0 &&
              products.map((product) => {
                return <Product product={product} key={product.id} />;
              })}
          </Slider>
        </div>
      </div>
    );
  }
}

export default connect((state) => state.collection)(CategoriesBestSeller);
