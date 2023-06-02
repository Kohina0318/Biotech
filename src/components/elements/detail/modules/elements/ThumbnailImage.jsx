import React from "react";
import { NoImg } from "utilities/constants";

const ThumbnailImage = ({ url }) => (
  <React.Fragment>
    {!url.includes("undefined") ? (
      <img src={url} alt={process.env.REACT_APP_NAME} />
    ) : (
      <img src={NoImg} alt={process.env.REACT_APP_NAME} />
    )}
  </React.Fragment>
);

export default ThumbnailImage;
