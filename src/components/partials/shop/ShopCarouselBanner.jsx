import React, { Component } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { carouselSingle } from "../../../utilities/carousel-helpers.js";

class ShopCarouselBanner extends Component {
  render() {
    return (
      <div className="ps-shop-banner">
        <Slider {...carouselSingle} className="ps-carousel inside">
          <div className="item">
            <Link to="/shop">
              <img src="/static/img/slider/shop-default/1.jpg" alt={process.env.REACT_APP_NAME} />
            </Link>
          </div>
          <div className="item">
            <Link to="/shop">
              <img src="/static/img/slider/shop-default/2.jpg" alt={process.env.REACT_APP_NAME} />
            </Link>
          </div>
        </Slider>
      </div>
    );
  }
}

export default ShopCarouselBanner;
