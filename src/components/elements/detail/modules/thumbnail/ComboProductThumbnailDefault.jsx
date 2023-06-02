import React, { Component } from "react";
import Slider from "react-slick";
import NextArrow from "../../../carousel/NextArrow";
import PrevArrow from "../../../carousel/PrevArrow";
import ThumbnailImage from "../elements/ThumbnailImage";
import { IMAGE_BASE_URL } from "utilities/constants";

class ComboProductThumbnailDefault extends Component {
  constructor(props) {
    super(props);
    this.state = {
      galleryCarousel: null,
      variantCarousel: null,
      photoIndex: 0,
      isOpen: false,
    };
  }

  handleOpenLightbox = (e, imageIndex) => {
    e.preventDefault();
    this.setState({ photoIndex: imageIndex, isOpen: true });
  };

  componentDidMount() {
    this.setState({
      galleryCarousel: this.slider1,
      variantCarousel: this.slider2,
    });
  }

  render() {
    const gallerySetting = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
    };

    const productImage = [];
    if(this.props.comboProduct && this.props.comboProduct.MediaId) {
      productImage.push(
        `${IMAGE_BASE_URL}${this.props.mediaBaseURL}${this.props.comboProduct.MediaId}`
      );
    } else {
      productImage.push(
        `${IMAGE_BASE_URL}${this.props.mediaBaseURL}${this.props.comboProduct.PrimaryMediaId}`
      );
    }

    return (
      <div className="ps-product__thumbnail" data-vertical="true">
        <figure>
          <div className="ps-wrapper">
            <Slider
              {...gallerySetting}
              ref={(slider) => (this.slider1 = slider)}
              asNavFor={this.state.variantCarousel}
              className="ps-product__gallery ps-carousel inside"
            >
              <div className="item">
                <ThumbnailImage url={productImage} />
              </div>
            </Slider>
          </div>
        </figure>
      </div>
    );
  }
}

export default ComboProductThumbnailDefault;
