import React, { Component } from "react";
import { connect } from "react-redux";
import KycStrip from "components/partials/account/KycStrip";
import { languageLable } from "utilities/helpers";

class ComboProductData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 0,
      selectedVariant: null,
      price: null,
      productQuntity: {},
    };
  }

  render() {
    const { comboProduct } = this.props;
    let comboDescription = comboProduct.ComboDescription.split("+");
    const { selectedLanguageData } = this.props.app;

    return (
      <>
     
      <div className="ps-product__info">
        <h1>{comboProduct.ComboName}</h1>
        
        <div className="ps-product__desc ps-product__desc-combo">
          <p>
            {languageLable(selectedLanguageData, "Combo Price")}{" "}
            {comboProduct.ComboPrice}
          </p>
    
          {comboDescription &&
            comboDescription.map((item, index) => (
              <p key={index} dangerouslySetInnerHTML={{ __html: item }}></p>
            ))}
          <KycStrip />
        </div>
       
      </div>

      </>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(ComboProductData);
