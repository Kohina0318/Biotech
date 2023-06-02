import React, { Component } from "react";
import Slider from "react-slick";
import Lightbox from "react-image-lightbox";
import NextArrow from "../../../carousel/NextArrow";
import PrevArrow from "../../../carousel/PrevArrow";
import ThumbnailImage from "../elements/ThumbnailImage";
import { IMAGE_BASE_URL } from "utilities/constants";

class ThumbnailDefault extends Component {
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

  renderDiscount = (props) => {
    if (this.props.product.ProductListings) {
      if (this.props.product.ProductListings[0]) {
        if (this.props.product.ProductListings[0].DiscountPercent > 0) {
          return <div className="ps-product__badge">
            <span>{Math.round(this.props.product.ProductListings[0].DiscountPercent)}</span>
            {"%"}
          </div>
        }
      }
    }
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
    const { photoIndex, isOpen } = this.state;

    const mediaIds =
      this.props.product.ProductDetailViews &&
      this.props.product.ProductDetailViews[0] &&
      this.props.product.ProductDetailViews[0].ProductMediaIds;

    if(this.props.product.ProductListings){
      if(this.props.product.ProductListings[0]){
        <div className="ps-product__badge">
          <span>{Math.round(this.props.product.ProductListings[0].DiscountPercent)}</span>
          {"%"}
        </div>
      }
    }
    

    const productImages = [];
    if (mediaIds && mediaIds.length > 0) {
      mediaIds.forEach((item) => {
        productImages.push(
          `${IMAGE_BASE_URL}${this.props.mediaBaseURL}${item}`
        );
      });
    } else if (this.props.product.MediaId) {
      productImages.push(
        `${IMAGE_BASE_URL}${this.props.mediaBaseURL}${this.props.product.MediaId}`
      );
    } else {
      productImages.push(
        `${IMAGE_BASE_URL}${this.props.mediaBaseURL}${this.props.product.PrimaryMediaId}`
      );
    }

    return (
      <div className="ps-product__thumbnail" data-vertical="true">

        <figure>
          <div className="ps-wrapper">
            {this.renderDiscount()}
            <Slider
              {...gallerySetting}
              ref={(slider) => (this.slider1 = slider)}
              asNavFor={this.state.variantCarousel}
              className="ps-product__gallery ps-carousel inside"
            >
              {productImages.map((item, index) => (
                <div className="item" key={index}>
                  <a
                    href="#!"
                    onClick={(e) => this.handleOpenLightbox(e, index)}
                  >
                    <ThumbnailImage url={item} />
                  </a>
                </div>
              ))}
            </Slider>
            {isOpen && (
              <Lightbox
                mainSrc={productImages[photoIndex]}
                nextSrc={productImages[(photoIndex + 1) % productImages.length]}
                prevSrc={
                  productImages[
                  (photoIndex + productImages.length - 1) %
                  productImages.length
                  ]
                }
                onCloseRequest={() => this.setState({ isOpen: false })}
                onMovePrevRequest={() =>
                  this.setState({
                    photoIndex:
                      (photoIndex + productImages.length - 1) %
                      productImages.length,
                  })
                }
                onMoveNextRequest={() =>
                  this.setState({
                    photoIndex: (photoIndex + 1) % productImages.length,
                  })
                }
              />
            )}
          </div>
        </figure>
      </div>
    );
  }
}

export default ThumbnailDefault;
