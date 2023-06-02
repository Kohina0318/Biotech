import React, { Component } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { carouselSingle } from "../../../utilities/carousel-helpers";

class ShopSidebarBanner extends Component {
  render() {
    return (
      <div className="ps-shop-banner">
        <Slider {...carouselSingle} className="ps-carousel blur">
          <div className="item">
            <Link to="/shop">
              <img src="/static/img/slider/shop-sidebar/1.jpg" alt={process.env.REACT_APP_NAME} />
            </Link>
          </div>
          <div className="item">
            <Link to="/shop">
              <img src="/static/img/slider/shop-sidebar/2.jpg" alt={process.env.REACT_APP_NAME} />
            </Link>
          </div>
        </Slider>
      </div>
    );
  }
}

export default ShopSidebarBanner;
