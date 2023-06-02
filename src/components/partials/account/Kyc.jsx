import React, { Component } from "react";
import AccountLinks from "./AccountLinks";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { Form, notification, Switch, DatePicker, Input, Card } from "antd";
import { connect } from "react-redux";
import API from "../../../api/api";
import { Tabs } from "antd";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  KYC_STATUS,
  KYC_FIELD_TYPE,
  IMAGE_BASE_URL,
  KYC_UPLOAD_DOC_TYPE,
  KYC_STATUS_MESSAGE,
} from "utilities/constants";
import PDFThubnailImg from "public/static/img/pdf.png";
import { languageLable } from "utilities/helpers";

const { TabPane } = Tabs;
var api;
class KYCAddress extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      kycRuleData: null,
      selectedKycData: null,
      fileRuleUpload: null,
      mediaBaseURL: null,
      pdfThumbnail: {},
      saveButtonClicked: false,
    };
  }

  componentDidMount = () => {
    this.getKycGroupByBusinessId();
  };

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

  getKycGroupByBusinessId = () => {
    const businessId =
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping.BusinessId;
      
    api
      .get(`GetKycGroupByBusinessId?businessId=${businessId}`)
      .then((response) => {
        if (response && response.StatusCode === 200 && response.Result) {
          this.setState({
            kycRuleData: response.Result,
            selectedKycData: response.Result[0],
          });
        }
      });
  };

  handleSubmit = (values) => {
    const { selectedKycData } = this.state;
    const { selectedLanguageData } = this.props.app;

    const businessId =
      this.props.auth &&
      this.props.auth.defaultAddress &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping &&
      this.props.auth.defaultAddress.BusinessCustomerAddressMapping.BusinessId;

    const kycRequestId =
      this.props.auth &&
      this.props.auth.kycRequestData &&
      this.props.auth.kycRequestData.Id;

    const kycRequestArrayData = [];
    if (kycRequestId && selectedKycData) {
      Object.keys(values).forEach((kycRuleId) => {
        // Get the doc type
        let docType = "";

        // Set initial doc value
        let docValue = values[kycRuleId];

        // Get the docId from the kycStatus => KycRequestDocs
        let docId = undefined;
        this.props.auth.kycRequestData &&
          this.props.auth.kycRequestData.KycRequestDocs.forEach((doc) => {
            if (kycRuleId === doc.KycRuleId) {
              docId = doc.Id;
            }
          });

        selectedKycData.MandatoryKycRules.forEach((item) => {
          if (item.Id === kycRuleId) {
            docType = item.Type;
            if (item.Type === KYC_FIELD_TYPE.DateTime) {
              docValue = moment(values[kycRuleId]).format("YYYY-MM-DD");
            }

            if (item.Type === KYC_FIELD_TYPE.IFormFile) {
              // Get the value from the state combination of selected data and rule
              if (this.state[`${this.state.selectedKycData.Id}_${kycRuleId}`]) {
                values[kycRuleId] = this.state[
                  `${this.state.selectedKycData.Id}_${kycRuleId}`
                ];

                docValue = this.state[
                  `${this.state.selectedKycData.Id}_${kycRuleId}`
                ];
              }
            }
          }
        });

        selectedKycData.OptionalKycRules &&
          selectedKycData.OptionalKycRules.forEach((item) => {
            if (item.Id === kycRuleId) {
              docType = item.Type;
              if (item.Type === KYC_FIELD_TYPE.DateTime) {
                docValue = moment(values[kycRuleId]).format("YYYY-MM-DD");
              }

              if (item.Type === KYC_FIELD_TYPE.IFormFile) {
                // Get the value from the state combination of selected data and rule
                if (
                  this.state[`${this.state.selectedKycData.Id}_${kycRuleId}`]
                ) {
                  docValue = this.state[
                    `${this.state.selectedKycData.Id}_${kycRuleId}`
                  ];

                  values[kycRuleId] = this.state[
                    `${this.state.selectedKycData.Id}_${kycRuleId}`
                  ];
                }
              }
            }
          });
        if (values[kycRuleId]) {
          kycRequestArrayData.push({
            Id: docId,
            kycRequestId: kycRequestId,
            kycRuleId: kycRuleId,
            groupId: selectedKycData.Id,
            isNewDoc: true,
            docType: docType,
            docValue: docValue,
          });
        }
      });

      let checkMandatoryCondition = 0;
      if (
        kycRequestArrayData &&
        kycRequestArrayData.length > 0 &&
        selectedKycData.MandatoryIds &&
        selectedKycData.MandatoryIds.length > 0
      ) {
        selectedKycData.MandatoryIds.forEach((item) => {
          kycRequestArrayData.forEach((kycValue) => {
            if (kycValue.kycRuleId === item) {
              checkMandatoryCondition = checkMandatoryCondition + 1;
            }
          });
        });
      }

      let isMandatoryFullFill = true;
      if (
        selectedKycData.MandatoryIds &&
        selectedKycData.MandatoryIds.length > 0
      ) {
        if (checkMandatoryCondition !== selectedKycData.MandatoryIds.length) {
          isMandatoryFullFill = false;
        }
      }

      if (
        kycRequestArrayData &&
        kycRequestArrayData.length &&
        isMandatoryFullFill
      ) {
        const apiRequestData = {
          id: kycRequestId,
          businessId: businessId,
          kycRequestDocs: kycRequestArrayData,
        };

        api
          .post("UpdateKycRequest", {
            data: apiRequestData,
          })
          .then((response) => {
            if (response && response.StatusCode === 200 && response.Result) {
              notification.success({
                message: languageLable(
                  selectedLanguageData,
                  "Kyc details has been saved successfully"
                ),
              });

              // UPDATE DATA TO STORE
              this.props.dispatch({
                type: "KYC_REQUEST",
                kycRequestData: response.Result,
              });

              // CHECK THE CURRENT FORM INDEX
              let currentFromIndex = this.state.kycRuleData.findIndex(
                (item) => item.Id === selectedKycData.Id
              );

              if (currentFromIndex !== -1) {
                // GOTO THE NEXT FORM
                if (
                  this.state.kycRuleData[currentFromIndex + 1] &&
                  this.state.kycRuleData[currentFromIndex + 1].Id
                ) {
                  this.handleKYCTabChange(
                    this.state.kycRuleData[currentFromIndex + 1].Id
                  );
                }
              }
            }
          });
      } else {
        notification.info({
          message: languageLable(
            selectedLanguageData,
            "Please add respective details into mandatory kyc field section."
          ),
        });
      }
    }
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  handleKYCTabChange = (key) => {
    
    const selectedKycData =
      this.state.kycRuleData &&
      this.state.kycRuleData.filter((item) => item.Id === key);

    this.setState({
      selectedKycData: selectedKycData && selectedKycData[0],
    });
  };

  beforeUpload = (file, size, allowType, ruleId) => {
    const isValidType = KYC_UPLOAD_DOC_TYPE[file.type] ? true : false;
    if (!isValidType) {
      message.error(`You can only upload ${allowType.join()} file!`);
    }
    const isValidSize = file.size / 1024 / 1024 < size;
    if (!isValidSize) {
      message.error(`Image must smaller than ${size}MB!`);
    }

    if (isValidType && isValidSize) {
      let formData = new FormData();
      formData.append("formFile", file);

      let pdfThumbnail = this.state.pdfThumbnail;
      // IsPDF than set pdf thubnail image
      if (KYC_UPLOAD_DOC_TYPE[file.type] === "pdf") {
        pdfThumbnail[
          `${this.state.selectedKycData.Id}_${ruleId}`
        ] = PDFThubnailImg;
      } else {
        // Remove pdf thumbnail if file.type is different
        delete pdfThumbnail[`${this.state.selectedKycData.Id}_${ruleId}`];
      }

      api
        .post(`UploadKYCDoc`, {
          data: formData,
          isMultipart: true,
        })
        .then((response) => {
          if (response && response.StatusCode === 200 && response.Result) {
            this.setState({
              [`${this.state.selectedKycData.Id}_${ruleId}`]: response.Result,
              pdfThumbnail: pdfThumbnail,
            });
          }
        });
    }

    return isValidType && isValidSize;
  };

  render() {
    const { selectedLanguageData } = this.props.app;

    const kycStatus =
      this.props.auth &&
      this.props.auth.kycRequestData &&
      this.props.auth.kycRequestData.Status;

    const isSaveButton =
      this.props.auth.kycRequestData &&
      (this.props.auth.kycRequestData.Status === KYC_STATUS.Draft ||
        this.props.auth.kycRequestData.Status === KYC_STATUS.Rejected) &&
      !this.state.saveButtonClicked;

    const { selectedKycData } = this.state;
    const initialValues = {};
    let selectedKycRequestDocs = [];
    if (
      this.props &&
      this.props.auth &&
      this.props.auth.kycRequestData &&
      this.props.auth.kycRequestData.KycRequestDocs &&
      this.props.auth.kycRequestData.KycRequestDocs.length &&
      selectedKycData
    ) {
      selectedKycRequestDocs = this.props.auth.kycRequestData.KycRequestDocs.filter(
        (item) => item.GroupId === selectedKycData.Id
      );

      for (let i = 0; i < selectedKycRequestDocs.length; i++) {
        let kycDoc = selectedKycRequestDocs[i];
        let docValue = kycDoc.DocValue;

        selectedKycData.MandatoryKycRules.forEach((item) => {
          if (item.Id === kycDoc.KycRuleId) {
            // Condition for moment object
            if (item.Type === KYC_FIELD_TYPE.DateTime) {
              docValue = moment(kycDoc.DocValue);
            }

            // Condition for set boolean value
            if (item.Type === KYC_FIELD_TYPE.Boolean) {
              docValue = kycDoc.DocValue === "true";
            }
          }
        });

        selectedKycData.OptionalKycRules &&
          selectedKycData.OptionalKycRules.forEach((item) => {
            if (item.Id === kycDoc.KycRuleId) {
              // Condition for moment object
              if (item.Type === KYC_FIELD_TYPE.DateTime) {
                docValue = moment(kycDoc.DocValue);
              }

              // SET the boolean value
              if (item.Type === KYC_FIELD_TYPE.Boolean) {
                docValue = kycDoc.DocValue === "true";
              }
            }
          });
        initialValues[kycDoc.KycRuleId] = docValue;
      }
    }

    return (
      <section className="ps-my-account ps-page--account ps-form--account-setting">
        <div className="ps-container">
          <div className="row">
            <AccountLinks page="kyc" />
            <div className="col-lg-8">
              <div className="ps-page__content ps-form-kyc-account">
                <div className="ps-form__header">
                  <h3>{languageLable(selectedLanguageData, "KYC")}</h3>
                </div>
                <div className="ps-form__content">
                  {isSaveButton ? (
                    <Tabs
                      defaultActiveKey={`${
                        this.state.kycRuleData &&
                        this.state.kycRuleData[0] &&
                        this.state.kycRuleData[0].Id
                      }`}
                      onChange={(e) => this.handleKYCTabChange(e)}
                      activeKey={selectedKycData && selectedKycData.Id}
                    >
                      {this.state.kycRuleData &&
                        this.state.kycRuleData.map((item, index) => (
                          <TabPane tab={item.GroupName} key={item.Id}>
                            <Form
                              onFinish={(values) => this.handleSubmit(values)}
                              onFinishFailed={() => this.onFinishFailed()}
                              initialValues={{ ...initialValues }}
                            >
                              {item.MandatoryKycRules &&
                                item.MandatoryKycRules.length > 0 &&
                                item.MandatoryKycRules.map(
                                  (mandatoryRuleItem) => {
                                    return (
                                      <Card
                                        size="small"
                                        title="Mandatory Rule*"
                                        className="mandatory-kyc-container"
                                        key={mandatoryRuleItem.Id}
                                      >
                                        <React.Fragment
                                          key={mandatoryRuleItem.Id}
                                        >
                                          {this.getInputField(
                                            mandatoryRuleItem,
                                            true,
                                            "MandatoryKycRules",
                                            selectedKycRequestDocs
                                          )}
                                        </React.Fragment>
                                      </Card>
                                    );
                                  }
                                )}
                              {item.OptionalKycRules &&
                                item.OptionalKycRules.length > 0 &&
                                item.OptionalKycRules.map(
                                  (optionalRuleItem) => {
                                    return (
                                      <Card
                                        size="small"
                                        title="Optional Rule*"
                                        className="optional-kyc-container"
                                        key={optionalRuleItem.Id}
                                      >
                                        <React.Fragment
                                          key={optionalRuleItem.Id}
                                        >
                                          {this.getInputField(
                                            optionalRuleItem,
                                            false,
                                            "OptionalKycRules",
                                            selectedKycRequestDocs
                                          )}
                                        </React.Fragment>
                                      </Card>
                                    );
                                  }
                                )}

                              <div className="form-group submit">
                                {isSaveButton && (
                                  <button type="submit" className="ps-btn">
                                    Save
                                  </button>
                                )}
                                {this.state.kycRuleData.length - 1 > index && (
                                  <button
                                    type="button"
                                    className="ps-btn m-l-10"
                                    onClick={() =>
                                      this.handleKYCTabChange(
                                        this.state.kycRuleData[index + 1].Id
                                      )
                                    }
                                  >
                                    Next
                                  </button>
                                )}
                              </div>
                            </Form>
                          </TabPane>
                        ))}
                    </Tabs>
                  ) : (
                    <React.Fragment>
                      <div className="kyc-message-container">
                        <strong>
                          {languageLable(
                            selectedLanguageData,
                            KYC_STATUS_MESSAGE[kycStatus]
                          )}
                        </strong>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  //kycGroup => Mandatory or Optional
  getInputField = (field, isRequired, kycGroup, selectedKycRequestDocs) => {
    const { mediaBaseURL, selectedKycData } = this.state;
    const { selectedLanguageData } = this.props.app;

    let imageUrl = null;
    for (let i = 0; i < selectedKycRequestDocs.length; i++) {
      let kycDoc = selectedKycRequestDocs[i];
      // GET data form uploaded list
      if (kycDoc.KycRuleId === field.Id) {
        selectedKycData[kycGroup].forEach((item) => {
          if (item.Type === KYC_FIELD_TYPE.IFormFile && item.Id === field.Id) {
            imageUrl = `${IMAGE_BASE_URL}${mediaBaseURL}${kycDoc.DocValue}`;
          }
        });
      }
    }

    if (this.state[`${this.state.selectedKycData.Id}_${field.Id}`]) {
      imageUrl = `${IMAGE_BASE_URL}${mediaBaseURL}${
        this.state[`${this.state.selectedKycData.Id}_${field.Id}`]
      }`;

      // Check wather it's pdf or not
      if (
        this.state.pdfThumbnail[`${this.state.selectedKycData.Id}_${field.Id}`]
      ) {
        imageUrl = PDFThubnailImg;
      }
    }

    switch (field.Type) {
      case KYC_FIELD_TYPE.Boolean:
        return (
          <div className="form-group">
            <div className="control-label">
              {field.Name}
              {isRequired && <span className="field-required">*</span>}
            </div>
            <Form.Item
              valuePropName="checked"
              rules={[
                {
                  required: isRequired,
                  message: languageLable(
                    selectedLanguageData,
                    "Please fill the necessary details."
                  ),
                },
              ]}
              name={field.Id}
            >
              <Switch />
            </Form.Item>
          </div>
        );
      case KYC_FIELD_TYPE.Int16:
        return (
          <div className="form-group">
            <div className="control-label">
              {field.Name}
              {isRequired && <span className="field-required">*</span>}
            </div>
            <Form.Item
              rules={[
                {
                  required: isRequired,
                  message: languageLable(
                    selectedLanguageData,
                    "Please fill the necessary details."
                  ),
                },
              ]}
              name={field.Id}
            >
              <Input className="form-control" />
            </Form.Item>
          </div>
        );
      case KYC_FIELD_TYPE.String:
        return (
          <div className="form-group">
            <div className="control-label">
              {field.Name}
              {isRequired && <span className="field-required">*</span>}
            </div>
            <Form.Item
              rules={[
                {
                  required: isRequired,
                  message: languageLable(
                    selectedLanguageData,
                    "Please fill the necessary details."
                  ),
                },
              ]}
              name={field.Id}
            >
              <Input className="form-control" />
            </Form.Item>
          </div>
        );
      case KYC_FIELD_TYPE.IFormFile:
        return (
          <div className="form-group">
            <div className="control-label">{field.Name}</div>
            <Form.Item name={field.Id}>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action={null}
                fileList={[]}
                beforeUpload={(file) =>
                  this.beforeUpload(
                    file,
                    field.MaxSize,
                    field.AllowedMedia,
                    field.Id
                  )
                }
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  <React.Fragment>
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </React.Fragment>
                )}
              </Upload>
              <div className="info">
                <div>
                  {languageLable(selectedLanguageData, "Allowed Document Type")}
                  : <strong>{field.AllowedMedia.join()}</strong>
                </div>
                <div>
                  {languageLable(selectedLanguageData, "Allowed Document Size")}
                  : <strong>{field.MaxSize}M </strong>
                </div>
              </div>
            </Form.Item>
          </div>
        );
      case KYC_FIELD_TYPE.DateTime:
        return (
          <div className="form-group">
            <div className="control-label">
              {field.Name}
              {isRequired && <span className="field-required">*</span>}
            </div>
            <Form.Item
              rules={[
                {
                  required: isRequired,
                  message: languageLable(
                    selectedLanguageData,
                    "Please fill the necessary details."
                  ),
                },
              ]}
              name={field.Id}
            >
              <DatePicker className="form-control" />
            </Form.Item>
          </div>
        );
      default:
        break;
    }
  };
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(withRouter(KYCAddress));
