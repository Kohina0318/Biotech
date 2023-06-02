import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Spin } from "antd";
import API from "api/api";
import moment from "moment";
import { languageLable } from "utilities/helpers";
import { withRouter } from "react-router-dom";

var api;

class TableNotifications extends Component {
  constructor(props) {
    super(props);
    api = new API();
    this.state = {
      notificationList: [],
      loading: true,
    };
  }

  componentDidMount = () => {
    this.getMyFeeds();
  };

  getMyFeeds = () => {
    const { selectedLanguageData } = this.props.app;

    api.get(`GetMyFeeds`).then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        if (response.Result) {
            response.Result.forEach((item) => {
                Object.keys(item).forEach((key) => {
                    if (item[key] && !Array.isArray(item[key])) {
                        item[key] = languageLable(selectedLanguageData, item[key]);
                    }
                });
          });
        }
        this.setState({
          notificationList: response.Result,
          loading: false,
        });
      }
    });
  };

  render() {
    const { selectedLanguageData } = this.props.app;

    const tableColumn = [
      {
        title: languageLable(selectedLanguageData, "Title"),
        dataIndex: "Title",
        key: "title",
      },
      {
        title: languageLable(selectedLanguageData, "Description"),
        dataIndex: "Content",
        key: "Content",
      },
      {
        title: languageLable(selectedLanguageData, "Created At"),
        dataIndex: "CreatedOn",
        key: "CreatedOn",
        render: (text, record) => (
            <div>{moment(record.CreatedOn).format("DD-MM-YYYY h:mm A")}</div>
        ),
      },
      /*{
        title: "Action",
        key: "action",
        width: "200px",
        render: (text, record) => <span>Mark as read</span>,
      },*/
    ];
    
    return (
      <Spin spinning={this.state.loading}>
        <Table columns={tableColumn} dataSource={this.state.notificationList} />
      </Spin>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};
export default connect(mapStateToProps)(TableNotifications);
