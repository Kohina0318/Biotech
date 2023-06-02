import React, { Component } from "react";
import { Tabs } from "antd";
import PartialDescription from "./PartialDescription";
import PartialSpecification from "./PartialSpecification";
import PartialVendor from "./PartialVendor";
import PartialReview from "./PartialReview";
import PartialOffer from "./PartialOffer";

const { TabPane } = Tabs;

class DefaultDescription extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="ps-product__content ps-tab-root">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Description" key="1">
              <div className="ps-document">
                  <p>{this.props.product.ProductSummary}</p>
              </div>
            </TabPane>
            {/* <TabPane tab="Specification" key="2">
              <PartialSpecification breacrumb={this.props.product} />
            </TabPane> */}
            {/* <TabPane tab="Vendor" key="3">
              <PartialVendor />
            </TabPane>
            <TabPane tab="Reviews (1)" key="4">
              <PartialReview />
            </TabPane>
            <TabPane tab="Questions and Answers" key="5">
              Content of Tab Pane 3
            </TabPane>
            <TabPane tab="More Offers" key="6">
              <PartialOffer />
            </TabPane> */}
          </Tabs>
        </div>
      </div>
    );
  }
}

export default DefaultDescription;
