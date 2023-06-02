import React, { useState } from "react";
import { Modal, Button } from "antd";

const OrderRating = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <React.Fragment>
      <form className="ps-form--review" action="/" method="get">
        <h4>Submit Your Review</h4>
        <p>
          Your email address will not be published. Required fields are marked
          <sup>*</sup>
        </p>
        <div className="form-group form-group__rating">
          <label>Your rating of this product</label>
          <Rate defaultValue={1} />
        </div>
        <div className="form-group">
          <textarea
            className="form-control"
            rows="6"
            placeholder="Write your review here"
          ></textarea>
        </div>
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12  ">
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                placeholder="Your Name"
              />
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12  ">
            <div className="form-group">
              <input
                className="form-control"
                type="email"
                placeholder="Your Email"
              />
            </div>
          </div>
        </div>
        <div className="form-group submit">
          <button className="ps-btn">Submit Review</button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default OrderRating;
