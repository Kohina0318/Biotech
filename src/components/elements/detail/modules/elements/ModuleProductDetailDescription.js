import React from "react";
import KycStrip from "components/partials/account/KycStrip";
import { languageLable } from "utilities/helpers";

const ModuleProductDetailDescription = ({ product, selectedLanguageData }) => (
  //<div className="ps-product__desc">
  <div >
  <p style={{color:"#000"}} dangerouslySetInnerHTML={{__html: languageLable(selectedLanguageData, product.ProductDescription) }}></p>
    {/*<ul className="ps-list--dot">
      <li>{product.ProductSummary}</li>
    </ul>*/}
    <div className="mb-20">
      <KycStrip />
    </div>
  </div>
);

export default ModuleProductDetailDescription;
