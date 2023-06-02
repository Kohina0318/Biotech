import React, { Component } from "react";
import { connect } from "react-redux";
import Product from "../../elements/products/Product";
import ProductWide from "../../elements/products/ProductWide";
import { getProducts } from "redux/product/action";
import { Link } from "react-router-dom";
import { languageLable } from "utilities/helpers";
import { Pagination } from 'antd';

class LayoutShop extends Component {
  state = {
    listView: true,
    mediaBaseURL: null,
  };

  handleChangeViewMode = (event) => {
    event.preventDefault();
    this.setState({ listView: !this.state.listView });
  };

  handlePagination(page, pageSize) {
    const params = {
      _start: page === 1 ? 0 : page * pageSize,
      _limit: pageSize,
    };
    this.props.dispatch(getProducts(params));
  }

  componentDidUpdate = (props) => {
    if (
      props.auth &&
      props.auth.appDefaultSetting &&
      props.auth.appDefaultSetting.ImageUrl &&
      this.state.mediaBaseURL === null
    ) {
      this.setState({
        mediaBaseURL: this.props.auth.appDefaultSetting.ImageUrl,
      });
    }
  };

  render() {
    const products = this.props.productList;
    const total = this.props.productList && this.props.productList.length;
    const viewMode = this.state.listView;

    const { selectedLanguageData } = this.props.app;
    return (
      <div className="ps-shopping">
        <div className="ps-block--shop-features">
          <div className="ps-block__header">
            <h3>{languageLable(selectedLanguageData, "Products")}</h3>
          </div>
        </div>
        <div className="ps-shopping__header">
          <p>
            <strong className="mr-2">{total}</strong>
            {languageLable(selectedLanguageData, "Products found")}
          </p>

          <div className="ps-shopping__actions">
            {/* <select
              className="ps-select form-control"
              data-placeholder="Sort Items"
            >
              <option>Sort by latest</option>
              <option>Sort by popularity</option>
              <option>Sort by average rating</option>
              <option>Sort by price: low to high</option>
              <option>Sort by price: high to low</option>
            </select> */}
            <div className="ps-shopping__view">
              <p>{languageLable(selectedLanguageData, "View")}</p>
              <ul className="ps-tab-list">
                <li className={viewMode === true ? "active" : ""}>
                  <a href="#!" onClick={this.handleChangeViewMode}>
                    <i className="icon-grid"></i>
                  </a>
                </li>
                <li className={viewMode !== true ? "active" : ""}>
                  <a href="#!" onClick={this.handleChangeViewMode}>
                    <i className="icon-list4"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
        <div className="ps-shopping__content">
          {viewMode === true ? (
            <div className="ps-shopping-product">
              <div className="row">
                {products && products.length > 0
                  ? products.map((item) => (
                      <div
                        className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6 "
                        key={item.id}
                      >
                        <Product
                          productData={item}
                          key={item.Id}
                          mediaBaseURL={this.state.mediaBaseURL}
                          isCombo={this.props.isCombo}
                        />
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          ) : (
            <div className="ps-shopping-product">
              {products && products.length > 0
                ? products.map((item) => (
                    <ProductWide
                      productData={item}
                      key={item.Id}
                      mediaBaseURL={this.state.mediaBaseURL}
                      isCombo={this.props.isCombo}
                    />
                  ))
                : ""}
            </div>
          )}
        </div>
        
      </div>
      
    );
  }
}

export default connect((state) => state)(LayoutShop);
