import React, { Component } from "react";
import Slider from "react-slick";
import NextArrow from "../../../elements/carousel/NextArrow";
import PrevArrow from "../../../elements/carousel/PrevArrow";
import { connect } from "react-redux";
import BannerItem from "../../../elements/media/BannerItem";
import sliderImg1 from "../../../../public/sliderImage/banner.jpg";
//import sliderImg2 from "../../../../public/sliderImage/slider2.jpg";
//import sliderImg3 from "../../../../public/sliderImage/slider3.jpg";

const bannerData = [
  {
    id: 1,
    image: sliderImg1,
  },
  /*{
    id: 2,
    image: sliderImg2,
  },
  {
    id: 3,
    image: sliderImg3,
  },*/
];

class HomeBanner extends Component {
  render() {
    const carouselSetting = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };

    return (
      <div className="ps-home-banner ps-home-banner--1">
        <div className="ps-section__left">
          <Slider {...carouselSetting} className="ps-carousel">
            {bannerData.map((item) => (
              <BannerItem source={item.image} key={item.id} />
            ))}
          </Slider>
        </div>
      </div>
    );
  }
}

export default connect((state) => state.media)(HomeBanner);
