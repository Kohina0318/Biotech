import React from "react";
import { connect } from "react-redux";
import {
  KYC_STATUS,
  KYC_STATUS_MESSAGE,
  APP_SETTINGS,
} from "utilities/constants";
import { Link } from "react-router-dom";
import { languageLable } from "utilities/helpers";

class KycStrip extends React.Component {
  render() {
    const kycStatus =
      this.props.auth &&
      this.props.auth.kycRequestData &&
      this.props.auth.kycRequestData.Status;

    const canOrder =
      this.props.auth &&
      this.props.auth.userData &&
      this.props.auth.userData.can_order === "true"
        ? true
        : false;

    const { selectedLanguageData } = this.props.app;

    // APP SETTING - CHECK KYC IS ALLOW OR NOT
    const isKyc = APP_SETTINGS.isKyc;
    return (
      <React.Fragment>
        {isKyc &&
          !canOrder &&
          (KYC_STATUS.Draft === kycStatus ||
            KYC_STATUS.Pending === kycStatus ||
            KYC_STATUS.Rejected === kycStatus ||
            KYC_STATUS.Invalidated === kycStatus) && (
            <Link to="/account/kyc">
              <div className="kyc-verification-strip">
                <div>
                  {languageLable(
                    selectedLanguageData,
                    KYC_STATUS_MESSAGE[kycStatus]
                  )}
                </div>
              </div>
            </Link>
          )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(KycStrip);
