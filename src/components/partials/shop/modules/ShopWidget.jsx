import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { languageLable } from "utilities/helpers";
import LazyLoad from "react-lazyload";
import { IMAGE_BASE_URL, NoImg } from "utilities/constants";

class ShopWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaBaseURL: null,
      categories: [],
    };
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
    const { categories } = this.props.app;
    const url = this.props.location.pathname.split("/");
    const { selectedLanguageData } = this.props.app;

    let mediaId = categories.PrimaryMediaId;
    if (categories.MediaId) mediaId = categories.MediaId;

    return (
      <div className="ps-layout__left">
        <aside className="widget widget_shop">
          <h4 className="widget-title">
            {languageLable(selectedLanguageData, "Categories")}
          </h4>
          {categories && categories.length > 0 ? (
            <ul className="ps-list--categories">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link to={`/search-product/${category.Id}`} className={category.Id === url[2] ? "active" : ""} >{languageLable(selectedLanguageData,category.Name)}</Link>
                  {/* <Link to="#" className={category.Id === url[2] ? "active" : ""} >{category.Name}</Link> */}
                  <ul className="ps-list--categories subCategories">
                      {category.SubCategories.map((cate) => (
                          
                          <li key={cate.Id}>
                            
                            <Link to={`/search-product/${cate.Id}`} className={cate.Id === url[2] ? "active" : ""} >
                              <LazyLoad>
                              <img
                                src={`${IMAGE_BASE_URL}${`/Media/GetMediaById?id=`}${cate.MediaId}`}
                                alt={languageLable(selectedLanguageData, cate.Name)}
                                width={50} 
                                height={50}
                              />
                              </LazyLoad>
                              {"    "}{languageLable(selectedLanguageData, cate.Name)}
                            </Link>
                          </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            languageLable(selectedLanguageData, "No Category")
          )}
        </aside>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(ShopWidget));
