import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Form, notification, Select } from "antd";
import { connect } from "react-redux";
import API from "../../../api/api";
import { languageLable } from "utilities/helpers";

var api;
const { Option } = Select;
class AddAddress extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      selectedCountryData: null,
    };
  }

  setSelectedCoutry = (countryName) => {
    if (this.props.auth && this.props.auth.countries) {
      this.props.auth.countries.map((country) => {
        if (country.name === countryName) {
          this.setState({
            selectedCountryData: country,
          });
        }
        return null;
      });
    }
  };

  handleSubmit = (values) => {
    const { selectedLanguageData } = this.props.app;

    let payload = {
      NamePrefix: "Hospital",
      Name: values.name,
      AddressLine1: values.addressLine1,
      AddressLine2: values.addressLine2,
      City: values.city,
      Country: this.state.selectedCountryData.name,
      State: values.state,
      Pin: values.pin,
      Title: values.name,
      Latitude: values.latitude,
      Longitude: values.longitude,
      IsDefault: true,
      isActive: true,
      isFromCustomer: true,
      BusinessId: this.state.selectedCountryData.BusinessId,
      LocationId: this.state.selectedCountryData.LocationId,
    };

    api
      .post("AddAddress", {
        data: payload,
      })
      .then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          notification.success({
            message: "Success",
            description: languageLable(
              selectedLanguageData,
              "Address has been added successfully."
            ),
          });
          this.props.history.push("/");
        } else {
          notification.info({
            message: "info",
            description: languageLable(
              selectedLanguageData,
              response.StatusMessage
            ),
          });
        }
      });
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const { selectedLanguageData } = this.props.app;

    return (
      <div className="ps-my-account">
        <div className="container">
          <Form
            className="ps-form--account"
            onFinish={(values) => this.handleSubmit(values)}
            onFinishFailed={() => this.onFinishFailed()}
            initialValues={{
              isdCode: "+91",
            }}
          >
            <ul className="ps-tab-list">
              <li className="active">
                <Link to="/account/register">
                  {languageLable(selectedLanguageData, "Add Address")}
                </Link>
              </li>
            </ul>
            <div className="ps-tab active" id="register">
              <div className="ps-form__content">
                <h5>
                  {languageLable(selectedLanguageData, "Enter address details")}
                </h5>
                <div className="form-group">
                  <Form.Item
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: languageLable(
                          selectedLanguageData,
                          "Please enter hospital name."
                        ),
                      },
                    ]}
                  >
                    <input
                      id="name"
                      className="form-control"
                      name="name"
                      type="text"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Address Title*"
                      )}
                    ></input>
                  </Form.Item>
                </div>
                <div className="form-group form-forgot">
                  <Form.Item
                    name="addressLine1"
                    rules={[
                      {
                        required: true,
                        message: languageLable(
                          selectedLanguageData,
                          "Please enter address line 1"
                        ),
                      },
                    ]}
                  >
                    <input
                      id="addressLine1"
                      className="form-control"
                      name="addressLine1"
                      type="text"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Address Line 1*"
                      )}
                    ></input>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    name="addressLine2"
                    rules={[
                      {
                        required: true,
                        message: languageLable(
                          selectedLanguageData,
                          "Please enter address line 2"
                        ),
                      },
                    ]}
                  >
                    <input
                      id="addressLine2"
                      className="form-control"
                      name="addressLine2"
                      type="text"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Address Line 2*"
                      )}
                    ></input>
                  </Form.Item>
                </div>

                <div className="form-group">
                  <Form.Item
                    name="country"
                    rules={[
                      {
                        required: true,
                        message: languageLable(
                          selectedLanguageData,
                          "Please select country."
                        ),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Select a country*"
                      )}
                      optionFilterProp="children"
                      onChange={(e) => this.setSelectedCoutry(e)}
                    >
                      {this.props &&
                        this.props.auth &&
                        this.props.auth.countries.map((item) => (
                          <Option key={item.name} value={item.name}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    name="state"
                    rules={[
                      {
                        required: true,
                        message: languageLable(
                          selectedLanguageData,
                          "Please select state."
                        ),
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Select a state*"
                      )}
                      optionFilterProp="children"
                    >
                      {this.state.selectedCountryData &&
                        this.state.selectedCountryData.states.map((state) => (
                          <Option key={state.name} value={state.name}>
                            {state.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    name="city"
                    rules={[
                      {
                        required: true,
                        message: languageLable(
                          selectedLanguageData,
                          "Please enter city."
                        ),
                      },
                    ]}
                  >
                    <input
                      id="city"
                      className="form-control"
                      name="addressLine1"
                      type="text"
                      placeholder={languageLable(selectedLanguageData, "City*")}
                    ></input>
                  </Form.Item>
                </div>
                <div className="form-group">
                  <Form.Item
                    name="pin"
                    rules={[
                      {
                        required: true,
                        message: languageLable(
                          selectedLanguageData,
                          "Please enter pin."
                        ),
                      },
                    ]}
                  >
                    <input
                      id="pin"
                      className="form-control"
                      name="pin"
                      type="text"
                      placeholder={languageLable(
                        selectedLanguageData,
                        "Pincode*"
                      )}
                    ></input>
                  </Form.Item>
                </div>
                <div className="form-group submit">
                  <button type="submit" className="ps-btn ps-btn--fullwidth">
                    {languageLable(selectedLanguageData, "Save")}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(AddAddress));
