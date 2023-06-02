import React, { Component } from 'react';
import TableNotifications from './modules/TableNotifications';
import AccountLinks from './AccountLinks';
import { languageLable } from "utilities/helpers";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        
    const { selectedLanguageData } = this.props.app;

        return (
            <section className="ps-my-account ps-page--account">
                <div className="ps-container">
                    <div className="row">
                        <AccountLinks page="notifications" />
                        <div className="col-lg-8">
                            <div className="ps-page__content">
                                <div className="ps-section--account-setting">
                                    <div className="ps-section__header">
                                        <h3>{languageLable(selectedLanguageData, "Notifications")} </h3>
                                    </div>
                                    <div className="ps-section__content">
                                        <TableNotifications />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
  };
  
export default connect(mapStateToProps)(withRouter(Notifications));
