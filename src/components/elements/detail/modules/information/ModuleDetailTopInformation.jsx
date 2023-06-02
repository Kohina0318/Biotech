import Rating from "../../../../../components/elements/Rating";
import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

class SingleProductHeaderData extends Component {
    render() {
        const { product} = this.props;



        return (
            <header>
                <h1>{product.ProductName}</h1>
                <div className="ps-product__meta">
                    <p>
                        Brand:
                        <Link href="/shop">
                            <a className="ml-2 text-capitalize">{product.BrandName}</a>
                        </Link>
                    </p>
                    <div className="ps-product__rating">
                        <Rating />
                        <span>(1 review)</span>
                    </div>
                </div>
            </header>
        );
    }
}

const mapStateToProps = (state) => {
    return state.product;
  };

export default connect(mapStateToProps)(SingleProductHeaderData);

