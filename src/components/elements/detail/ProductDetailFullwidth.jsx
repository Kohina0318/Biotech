import React, { Component } from "react";
import { connect } from "react-redux";
import ThumbnailDefault from "./modules/thumbnail/ThumbnailDefault";
import InformationDefault from "./modules/information/InformationDefault";
import ComboProductInformationDefault from "./modules/information/ComboProductInformationDefault";
import SingleProductInformationDefault from "./modules/information/SingleProductInformationDefault";
import { PRODUCT_TYPE } from "./../../../utilities/constants";
import DefaultDescription from "../detail/modules/description/DefaultDescription";
import TopHeader from "../../../components/elements/detail/modules/information/ModuleDetailTopInformation";

class ProductDetailFullwidth extends Component {
  render() {
      const { productData, isComboProduct, productType, allProductData } = this.props;

    if (productData !== null) {
      return (
        
        <div className="ps-product--detail ps-product--fullwidth">
          {/* <TopHeader 
            product={productData}
          /> */}
          <div className="ps-product__header">
            {isComboProduct ? (
              <React.Fragment>
                <ThumbnailDefault
                  product={productData}
                  mediaBaseURL={this.props.mediaBaseURL}
                />
                <ComboProductInformationDefault
                  productData={productData}
                  comboProductId={this.props.comboProductId}
                  mediaBaseURL={this.props.mediaBaseURL}
                  selectedProductRation={this.props.selectedProductRation}
                  firstProductRation={this.props.firstProductRation}
                  isFirstRation={this.props.isFirstRation}
                  selectedQuantity={this.props.selectedQuantity}
                  handleIncreaseItemQty={this.handleIncreaseItemQty}
                  handleDecreseItemQty={this.handleDecreseItemQty}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <ThumbnailDefault
                  product={productData}
                  mediaBaseURL={this.props.mediaBaseURL}
                />
                {productType === PRODUCT_TYPE.SINGEL ? (
                  <SingleProductInformationDefault
                    productData={productData}
                    mediaBaseURL={this.props.mediaBaseURL}
                  />
                ) : (
                  <InformationDefault
                    productData={productData}
                    allProductData={allProductData}
                    mediaBaseURL={this.props.mediaBaseURL}
                    onAttributeSelectionChange={this.props.onAttributeSelectionChange}
                    getSelectedAttributeList={this.props.getSelectedAttributeList}
                  />
                )}
                
              </React.Fragment>
            )}
          </div>
          
          <DefaultDescription product={productData}/>
        </div>
      );
    } else {
      return <p>No Data</p>;
    }
  }

  handleIncreaseItemQty = (row, productQty, comboProductId) => {
    this.props.handleIncreaseItemQty(
      row,
      productQty,
      this.props.comboProductId
    );
  };

  handleDecreseItemQty = (row, productQty, comboProductId) => {
    this.props.handleDecreseItemQty(row, productQty, this.props.comboProductId);
  };
}

const mapStateToProps = (state) => {
  return state.product;
};

export default connect(mapStateToProps)(ProductDetailFullwidth);

