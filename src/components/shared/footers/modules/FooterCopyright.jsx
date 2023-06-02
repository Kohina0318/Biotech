import React from "react";
import IphoneDownload from "public/static/img/app-store.png";
import AndroidDownload from "public/static/img/google-play.png";
import { connect } from "react-redux";
import { languageLable } from "utilities/helpers";

const redierToURL = (url) => {
  window.open(url, "_blank");
};

const FooterCopyright = (props) => {
  const { selectedLanguageData } = props.app;

  return (
    <div className="ps-footer__copyright">
      <div className="footer-container">
        <div>
          <p>
            {languageLable(
              selectedLanguageData,
              "© 2021 Artis. All Rights Reserved"
            )}
          </p>
        </div>
        <div
          className="image-container"
          onClick={() =>
            redierToURL(
              "https://apps.apple.com/us/app/biotech-health-care/id1222575199?mt=8%E2%80%8B"
            )
          }
        >
          <img src={IphoneDownload} alt="iphone-app" />
        </div>
        <div
          className="image-container"
          onClick={() =>
            redierToURL(
              "https://play.google.com/store/apps/details?id=com.biotech.biotechvision"
            )
          }
        >
          <img src={AndroidDownload} alt="android-app" />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(FooterCopyright);
