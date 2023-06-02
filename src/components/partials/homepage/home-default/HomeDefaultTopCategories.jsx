import React from "react";
import { Spin } from "antd";
import { Link, withRouter } from "react-router-dom";
import { IMAGE_BASE_URL, NoImg } from "utilities/constants";
import { languageLable } from "utilities/helpers";
import { connect } from "react-redux";

class HomeDefaultTopCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      mediaBaseURL: null,
      loading: false,
    };
  }

  componentDidUpdate = (props) => {
    if (
      props.auth &&
      props.auth.appDefaultSetting &&
      props.auth.appDefaultSetting.ImageUrl &&
      !this.state.mediaBaseURL
    ) {
      this.setState({
        mediaBaseURL: this.props.auth.appDefaultSetting.ImageUrl,
      });
    }
  };
  render() {
    const { categories } = this.props.app;
    const { selectedLanguageData } = this.props.app;

    return (
      <div className="ps-top-categories">
            <div className="ps-container">
                <h3>{languageLable(selectedLanguageData, "Top Categories")}</h3>
                <Spin spinning={this.state.loading}>
                  <div className="row">
                    {categories && categories.map((item) => (
                      <div className="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 " key={item.Id}>
                        <Link to={`/search-product/${item.Id}`}>
                          <div className="ps-block--category">
                            {item.MediaId && this.state.mediaBaseURL ? (
                              <img
                                src={`${IMAGE_BASE_URL}${this.state.mediaBaseURL}${item.MediaId}`}
                                alt={item.Name}
                              />
                            ) : (
                              <img src={NoImg} alt={item.Name} />
                            )}
                            <p>{languageLable(selectedLanguageData, item.Name)}</p>
                            
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </Spin>
            </div>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(HomeDefaultTopCategories));
