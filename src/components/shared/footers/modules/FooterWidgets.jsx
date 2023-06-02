import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PrivacyPolicy from "./../../../../public/pdf/Privacy Policy.pdf";
import TermsAndCondition from "./../../../../public/pdf/Terms and Conditions.pdf";
import { languageLable } from "utilities/helpers";

const redierToURL = (url) => {
  window.open(url, "_blank");
};

const FooterWidgets = (props) => {
  const { selectedLanguageData } = props.app;
  
  return (
    <div className="ps-footer__widgets">
      <aside className="widget widget_footer widget_contact-us">
        <h4 className="widget-title">
          {languageLable(selectedLanguageData, "Contact us")}
        </h4>
        <div className="widget_content">
          <p>
            Block-1, Abhishree Corporate Park, <br />
            Opp Swagat Bunglow BRTS Stop Bopal, <br />
            Ambli Road, Ahmdabad- 380 058
            <br />
            <Link to="mailto:esupport@biotechhealthcare.com">
              esupport@biotechhealthcare.com
            </Link>
          </p>
        </div>
      </aside>
      <aside className="widget widget_footer">
        <h4 className="widget-title">
          {languageLable(selectedLanguageData, "About")}
        </h4>
        <ul className="ps-list--link">
          <li
            className="quick-links"
            onClick={() =>
              redierToURL("https://www.biotechhealthcare.com/about-us/")
            }
          >
            {languageLable(selectedLanguageData, "About Us")}
          </li>
        </ul>
      </aside>
      <aside className="widget widget_footer">
        <h4 className="widget-title">
          {languageLable(selectedLanguageData, "Terms")}
        </h4>
        <ul className="ps-list--link">
          <li
            className="quick-links"
            onClick={() => redierToURL(TermsAndCondition)}
          >
            {languageLable(selectedLanguageData, "Terms & Condition")}
          </li>
        </ul>
      </aside>
      <aside className="widget widget_footer">
        <h4 className="widget-title">
          {languageLable(selectedLanguageData, "Policy")}
        </h4>
        <ul className="ps-list--link">
          <li
            className="quick-links"
            onClick={() => redierToURL(PrivacyPolicy)}
          >
            {languageLable(selectedLanguageData, "Privacy Policy")}
          </li>
        </ul>
      </aside>
    </div>
  );
};

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(FooterWidgets);
