import React, { Component } from "react";
import { Link } from "react-router-dom";
import AccountLinks from "./AccountLinks";

class Addresses extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <section className="ps-my-account ps-page--account">
        <div className="container">
          <div className="row">
            <AccountLinks page="address" />
            <div className="col-lg-8">
              <div className="ps-section--account-setting">
                <div className="ps-section__content">
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <figure className="ps-block--address">
                        <figcaption>Billing address</figcaption>
                        <div className="ps-block__content">
                          <p>You Have Not Set Up This Type Of Address Yet.</p>
                          <Link to="/account/edit-address">Edit</Link>
                        </div>
                      </figure>
                    </div>
                    <div className="col-md-6 col-12">
                      <figure className="ps-block--address">
                        <figcaption>Shipping address</figcaption>
                        <div className="ps-block__content">
                          <p>You Have Not Set Up This Type Of Address Yet.</p>
                          <Link to="/account/edit-address">Edit</Link>
                        </div>
                      </figure>
                    </div>
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

export default Addresses;
