import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import DeleteIcon from "public/static/img/delete.png";
import { Popconfirm } from "antd";
import { languageLable } from "utilities/helpers";

const BreadCrumb = ({
  breacrumb,
  layout,
  isShoppingCart,
  handleClearCart,
  app,
}) => {
  const { selectedLanguageData } = app;
  return (
    <div className="ps-breadcrumb">
      <div className={layout === "fullwidth" ? "ps-container" : "ps-container"}>
        <ul className="breadcrumb">
          {breacrumb.map((item) => {
            if (item) {
              if (!item.url) {
                return (
                  <li key={item.text}>
                    {languageLable(selectedLanguageData, item.text)}
                  </li>
                );
              } else {
                return (
                  <li key={item.text}>
                    <Link to={item.url}>
                      {languageLable(selectedLanguageData, item.text)}
                    </Link>
                  </li>
                );
              }
            } else {
              return null;
            }
          })}
        </ul>
        {isShoppingCart && (
          <div className="float-right">
            <Popconfirm
              placement="top"
              title={languageLable(selectedLanguageData, "Are you sure?")}
              onConfirm={handleClearCart}
              okText={languageLable(selectedLanguageData, "Yes")}
              cancelText={languageLable(selectedLanguageData, "No")}
            >
              <img
                src={DeleteIcon}
                alt={languageLable(selectedLanguageData, "delete")}
                className="pointer"
              />
            </Popconfirm>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(BreadCrumb);
