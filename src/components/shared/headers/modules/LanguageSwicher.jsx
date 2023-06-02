import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { SITE_URL, LANGUAGE_BASE_URL } from "utilities/constants";
import API from "api/api";
var api;

class LanguageSwicher extends Component {
  constructor({ props }) {
    super(props);
    api = new API();
  }

  componentDidMount = () => {
    this.getLanguageList();

    if (this.props.app && this.props.app.selectedLanguage) {
      // GET DEFAULT LANGUAGE
      this.getSelectedLanguageKeyValue(this.props.app.selectedLanguage);
    }
  };

  getLanguageList = () => {
    api.get("AvailableLanguages").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        this.getLanguageLocals(response.Result);
      }
    });
  };

  // LANGUAGE LOCAL FILE
  getLanguageLocals = (languageList) => {
    fetch(`${LANGUAGE_BASE_URL}Localization.json`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json && json.Localization && json.Localization.length > 0) {
          this.props.dispatch({
            type: "FETCH_LANGUAGE_LOCAL",
            languageLocalList: json.Localization,
          });

          // CHECK IF LANGUAGE EXIST INTO LOCALS
          let filteredLanguage = [];
          languageList.forEach((item) => {
            json.Localization.forEach((j) => {
              if (j.Locale === item.LanguageId) {
                filteredLanguage.push(j);
              }
            });
          });

          this.props.dispatch({
            type: "FETCH_LANGUAGE_LIST",
            languageList: filteredLanguage,
          });
        }
      });
  };

  getSelectedLanguageKeyValue = (selectedLanguage) => {
    fetch(`${SITE_URL}${selectedLanguage.Url}`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        for (let key in json) {
          json[key.toLowerCase()] = json[key];
          delete json[key];
        }

        localStorage.setItem("selectedLanguageData", JSON.stringify(json));
        
        this.props.dispatch({
          type: "FETCH_SELECTED_LANGUAGE_DATA",
          selectedLanguageData: json,
        });
      });
  };

  handleFeatureWillUpdate(e) {
    e.preventDefault();
  }

  updateLangauge = (selectedLanguage) => {
    this.props.dispatch({
      type: "UPDATE_USER_LANGUAGE",
      selectedLanguage,
    });

    localStorage.setItem("selectedLanguage", JSON.stringify(selectedLanguage));
    // GET DEFAULT LANGUAGE
    this.getSelectedLanguageKeyValue(selectedLanguage);
  };

  render() {
    return (
      <div className="ps-dropdown language">
        <Link to="/" onClick={this.handleFeatureWillUpdate.bind(this)}>
          {this.props.app &&
            this.props.app.selectedLanguage &&
            this.props.app.selectedLanguage.Locale}
        </Link>
        <ul className="ps-dropdown-menu">
          {this.props.app &&
            this.props.app.languageLocalList &&
            this.props.app.languageLocalList.map((item) => (
              <li key={item.Locale}>
                <a href="#!" onClick={() => this.updateLangauge(item)}>
                  {item.Locale}
                </a>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}

const mapPropsToState = (state) => {
  return state;
};
export default connect(mapPropsToState, null)(LanguageSwicher);
