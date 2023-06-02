import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
class ProductWidgets extends Component {
  render() {
    return (
      <section>
        <aside className="widget widget_product widget_features">
          <p>
            <i className="icon-network"></i> Shipping worldwide
          </p>
          <p>
            <i className="icon-3d-rotate"></i> Free 7-day return if eligible, so
            easy
          </p>
          <p>
            <i className="icon-receipt"></i> Supplier give bills for this
            product.
          </p>
          <p>
            <i className="icon-credit-card"></i> Pay online or when receiving
            goods
          </p>
        </aside>
        {this.props.auth && !this.props.auth.isLoggedIn && (
          <aside className="widget widget_sell-on-site">
            <p>
              <i className="icon-store"></i>Haven't registered yet?
              <Link to="/account/register">Register Now !</Link>
            </p>
          </aside>
        )}
      </section>
    );
  }
}

export default connect((state) => state)(ProductWidgets);
