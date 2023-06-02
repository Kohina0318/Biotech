import React, { Component } from "react";
import { Table } from "antd";
import TableWallet from "./modules/TableWallet";
import AccountLinks from "./AccountLinks";
import { FaFilter } from 'react-icons/fa';
import { AiOutlineFilter } from 'react-icons/ai';
import { Link } from "react-router-dom";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Moment from 'react-moment';
import { makeStyles } from '@material-ui/core/styles';
import API from "./../../../api/api";
import { withStyles } from "@material-ui/core/styles";
import { languageLable } from "utilities/helpers";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// import 'moment-timezone';

var api;

class Wallet extends Component {

  constructor({ props }) {

    super(props);
    api = new API();
    this.state = {
      walletData: [],
      anchorE1: null,
      isOpen: false,
      refresh: false,
      filterState: "Filter",
    };
  }

  // componentWillMount = () => {
  //   this.getMyWallet();
  // };

  componentDidMount = () => {
    this.getMyWallet1();
    this.getMyWallet();
  };

  getMyWallet1 = () => {
    api.get("GetMyWallet").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        console.log("walletData  xyzzzzzzzzzzzzz", response.Result);
        // this.setState({
        //   walletData: response.Result,
        // });
      }
    });
  };

  getMyWallet = () => {
    api.get("GetMyWallet").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        console.log("walletData result in table wallet page<<<<<", response.Result);
        response.Result.WalletHistories.map((item, index) => {

          const displayDate = (date) => {
            let d = new Date(date);
            let dd = d.getDate();

            let newdd = dd
            let mm = d.getMonth() + 1;
            var yyyy = d.getFullYear();
            if (newdd < 10) {
              newdd = '0' + newdd;
            }
            if (mm < 10) {
              mm = '0' + mm;
            }
            let cd = newdd + "-" + mm + "-" + yyyy;
            return cd;
          };

          const displayTime = (time) => {
            console.log(time);
            let tm = new Date(time);
            // let tm = time;

            // console.log("timeeee", tm);

            var h = tm.getHours();
            if (h < 10) {
              h = `0${h}`
            }
            var m = tm.getMinutes();
            if (m < 10) {
              m = `0${m}`
            }
            var t = h > 12 ? h - 12 + ":" + m + " PM" : h + ":" + m + " AM";
            return t;
          };
          item['tempDate'] = item.CreatedOn;
          let updatedDate = displayDate(item.CreatedOn)
          let updatedTime = displayTime(item.CreatedOn)
          console.log(`aaya re>>>${updatedDate} ${updatedTime}`)
          item.CreatedOn = `${updatedDate} ${updatedTime}`;

        })

        console.log("Update", response.Result.WalletHistories)


        this.setState({
          walletData: response.Result,
        });
      }
    });
  };

  handleClick = (event) => {
    // alert("Open")
    this.setState({ anchorEl: event.currentTarget, isOpen: true });

  };

  handleClose = () => {
    this.setState({ anchorEl: null, isOpen: false });
  };

  filter = (value) => {
    console.log("Inside FIlter>>>>", value)

    if (value == 0) {
      this.setState({ filterState: 'This Month' });
    }
    else if (value == 1) {
      this.setState({ filterState: 'Last 3 Months' });
    }
    else if (value == 2) {
      this.setState({ filterState: 'Last Year' })
    }

    const getStartEndDate = (val, month, year) => {
      var startDate = '';
      var endDate = '';

      if (val == 0) {
        if (month == '01') {
          startDate = `01-${month}-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '02') {
          let t = '';
          let k = parseInt(year);
          if (k % 4 === 0) {
            t = '28'
          }
          else {
            t = '29'
          }
          startDate = `01-${month}-${year}`
          endDate = `${t}-${month}-${year}`
        }
        else if (month == '03') {
          startDate = `01-${month}-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '04') {
          startDate = `01-${month}-${year}`
          endDate = `30-${month}-${year}`
        }
        else if (month == '05') {
          startDate = `01-${month}-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '06') {
          startDate = `01-${month}-${year}`
          endDate = `30-${month}-${year}`
        }
        else if (month == '07') {
          startDate = `01-${month}-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '08') {
          startDate = `01-${month}-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '09') {
          startDate = `01-${month}-${year}`
          endDate = `30-${month}-${year}`
        }
        else if (month == '10') {
          startDate = `01-${month}-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '11') {
          startDate = `01-${month}-${year}`
          endDate = `30-${month}-${year}`
        }
        else if (month == '12') {
          startDate = `01-${month}-${year}`
          endDate = `31-${month}-${year}`
        }
        return `${startDate}/${endDate}`
      }

      // For Last Three Months

      else if (val == 1) {
        if (month == '01') {
          startDate = `01-11-${parseInt(year) - 1}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '02') {
          let t = '';
          let k = parseInt(year);
          if (k % 4 === 0) {
            t = '28'
          }
          else {
            t = '29'
          }
          startDate = `01-12-${parseInt(year) - 1}`
          endDate = `${t}-${month}-${year}`
        }
        else if (month == '03') {
          startDate = `01-01-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '04') {
          startDate = `01-02-${year}`
          endDate = `30-${month}-${year}`
        }
        else if (month == '05') {
          startDate = `01-03-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '06') {
          startDate = `01-04-${year}`
          endDate = `30-${month}-${year}`
        }
        else if (month == '07') {
          startDate = `01-05-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '08') {
          startDate = `01-06-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '09') {
          startDate = `01-07-${year}`
          endDate = `30-${month}-${year}`
        }
        else if (month == '10') {
          startDate = `01-08-${year}`
          endDate = `31-${month}-${year}`
        }
        else if (month == '11') {
          startDate = `01-09-${year}`
          endDate = `30-${month}-${year}`
        }
        else if (month == '12') {
          startDate = `01-10-${year}`
          endDate = `31-${month}-${year}`
        }
        return `${startDate}/${endDate}`

      }

      //End OF Last THreee  Month
    }


    if (value == 0) {
      let date = new Date();
      let mm = date.getMonth() + 1;
      let yy = date.getFullYear();

      if (mm < 10) {
        mm = '0' + mm;
      }

      let response = getStartEndDate(value, mm, yy);
      let startDate = response.split('/')[0]
      let endDate = response.split('/')[1]

      api.get(`GetMyWallet?startDate=${startDate}&endDate=${endDate}`).then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          console.log("After Click Filter 301", response.Result);
          response.Result.WalletHistories.map((item, index) => {
            const displayDate = (date) => {
              let d = new Date(date);
              let dd = d.getDate();
              let newdd = dd
              let mm = d.getMonth() + 1;
              var yyyy = d.getFullYear();
              if (newdd < 10) {
                newdd = '0' + newdd;
              }
              if (mm < 10) {
                mm = '0' + mm;
              }
              let cd = newdd + "-" + mm + "-" + yyyy;
              return cd;
            };
            const displayTime = (time) => {
              console.log(time);
              let tm = new Date(time);
              // let tm = time;
              // console.log("timeeee", tm);
              var h = tm.getHours();
              if (h < 10) {
                h = `0${h}`
              }
              var m = tm.getMinutes();
              if (m < 10) {
                m = `0${m}`
              }
              var t = h > 12 ? h - 12 + ":" + m + " PM" : h + ":" + m + " AM";
              return t;
            };

            item['tempDate'] = item.CreatedOn;
            let updatedDate = displayDate(item.CreatedOn)
            let updatedTime = displayTime(item.CreatedOn)
            console.log(`aaya re>>>${updatedDate} ${updatedTime}`)
            item.CreatedOn = `${updatedDate} ${updatedTime}`;

          })

          console.log("Update", response.Result.WalletHistories)
          this.setState({
            walletData: response.Result,
          });
        }
      });
    }

    else if (value == 1) {
      let date = new Date();
      let mm = date.getMonth() + 1;
      let yy = date.getFullYear();

      if (mm < 10) {
        mm = '0' + mm;
      }

      let response = getStartEndDate(value, mm, yy);
      let startDate = response.split('/')[0]
      let endDate = response.split('/')[1]

      api.get(`GetMyWallet?startDate=${startDate}&endDate=${endDate}`).then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          console.log("After Click Filter Last 3 Months 420>>", response.Result);
          response.Result.WalletHistories.map((item, index) => {
            const displayDate = (date) => {
              let d = new Date(date);
              let dd = d.getDate();
              let newdd = dd
              let mm = d.getMonth() + 1;
              var yyyy = d.getFullYear();
              if (newdd < 10) {
                newdd = '0' + newdd;
              }
              if (mm < 10) {
                mm = '0' + mm;
              }
              let cd = newdd + "-" + mm + "-" + yyyy;
              return cd;
            };
            const displayTime = (time) => {
              console.log(time);
              let tm = new Date(time);
              // let tm = time;
              // console.log("timeeee", tm);
              var h = tm.getHours();
              if (h < 10) {
                h = `0${h}`
              }
              var m = tm.getMinutes();
              if (m < 10) {
                m = `0${m}`
              }
              var t = h > 12 ? h - 12 + ":" + m + " PM" : h + ":" + m + " AM";
              return t;
            };

            item['tempDate'] = item.CreatedOn;
            let updatedDate = displayDate(item.CreatedOn)
            let updatedTime = displayTime(item.CreatedOn)
            console.log(`aaya re>>>${updatedDate} ${updatedTime}`)
            item.CreatedOn = `${updatedDate} ${updatedTime}`;

          })


          console.log("Update", response.Result.WalletHistories)
          this.setState({
            walletData: response.Result,
          });
        }
      });
    }

    //For Last 1 Year
    else {
      let date = new Date();
      let mm = date.getMonth() + 1;
      let yy = date.getFullYear();

      if (mm < 10) {
        mm = '0' + mm;
      }

      // let response = getStartEndDate(value, mm, yy);
      let startDate = `01-01-${yy}`
      let endDate = `31-12-${yy}`;
      api.get(`GetMyWallet?startDate=${startDate}&endDate=${endDate}`).then((response) => {
        if (response.StatusCode === 200 && response.Result) {
          console.log("After Click Filter Last 1 Year 484>>", response.Result);
          response.Result.WalletHistories.map((item, index) => {
            const displayDate = (date) => {
              let d = new Date(date);
              let dd = d.getDate();
              let newdd = dd
              let mm = d.getMonth() + 1;
              var yyyy = d.getFullYear();
              if (newdd < 10) {
                newdd = '0' + newdd;
              }
              if (mm < 10) {
                mm = '0' + mm;
              }
              let cd = newdd + "-" + mm + "-" + yyyy;
              return cd;
            };
            const displayTime = (time) => {
              console.log(time);
              let tm = new Date(time);
              // let tm = time;
              // console.log("timeeee", tm);
              var h = tm.getHours();
              if (h < 10) {
                h = `0${h}`
              }
              var m = tm.getMinutes();
              if (m < 10) {
                m = `0${m}`
              }
              var t = h > 12 ? h - 12 + ":" + m + " PM" : h + ":" + m + " AM";
              return t;
            };

            item['tempDate'] = item.CreatedOn;
            let updatedDate = displayDate(item.CreatedOn)
            let updatedTime = displayTime(item.CreatedOn)
            console.log(`aaya re>>>${updatedDate} ${updatedTime}`)
            item.CreatedOn = `${updatedDate} ${updatedTime}`;

          })

          console.log("Update", response.Result.WalletHistories)
          this.setState({
            walletData: response.Result,
          });
        }
      });

    }
    this.handleClose();
  };

  render() {
    console.log("state outside>>>", this.state.walletData)
    const { walletData } = this.state;

    const tableColumn = [

      {
        title: "Date",
        rowKey: "date",
        dataIndex: "CreatedOn",
        key: "date",
        //width: "120px",
      },
      {
        title: "Credit/Debit",
        dataIndex: "CrDr",
        rowKey: "CrDr",
        key: "CrDr",
      },
      {
        title: "Title",
        dataIndex: "HistoryType",
        rowKey: "title",
        key: "title",
      },
      {
        title: "Amount",
        rowKey: "amount",
        dataIndex: "Amount",
        key: "amount",

      },
      {
        title: "Remarks",
        key: "remarks",
        dataIndex: "Remarks",
        rowKey: "remarks",
        //width: "150px",
      },
    ];


    const { selectedLanguageData } = this.props.app;
    const currencySetting = localStorage.getItem('currency');
    //console.log("state>>>>", this.state)

    return (

      <section className="ps-my-account ps-page--account">
        <div className="ps-container">

          <div className="row">
            <AccountLinks page="Wallet" />
            <div className="col-lg-8">
              <div className="ps-page__content">
                <div className="ps-section--account-setting">

                  <div class="container-fluid ">
                    <div class="row">
                      <div class="col">
                        <h3>
                          <img src="/static/img/icons/wallet.png" style={{ height: 16, width: 17 }} />
                          {languageLable(selectedLanguageData, "Wallet")}
                        </h3>
                        <h5>{languageLable(selectedLanguageData, "Total Available Balance")}: {currencySetting ? currencySetting : "₹"}  {walletData && walletData.Balance}</h5></div>
                      <div class="col" style={{ justifyContent: 'end', display: 'flex', }}>
                        <ul style={{ position: 'absolute', }}>
                          <li style={{ width: 160, padding: 10 }} >
                            <a style={{ borderRadius: 12, textAlign: 'center', background: '#396470', color: '#FFF', padding: "8px 10px" }}>
                              <img src="/static/img/icons/filter.png" style={{ margin: 3, height: 17, width: 15, }} />  {this.state.filterState} </a>
                            <p />
                            <ul class="dropdown" style={{ borderRadius: 12, overflow: 'auto', textAlign: 'end', background: '#396470', width: 120, padding: 13, fontSize: 12, paddingRight: 10, }}>

                              <li ><a onClick={(e) => this.filter(0)}>This Month</a></li>
                              <li><a onClick={(e) => this.filter(1)}>Last 3 Months</a></li>
                              <li><a onClick={(e) => this.filter(2)}>Last Year</a></li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="ps-section__header">
                  </div>

                  <div className="ps-section__content">
                    <Table
                      columns={tableColumn}
                      dataSource={walletData && walletData.WalletHistories}
                      size="Small"
                      scroll={{ x: 'calc(400px + 50%)', y: 260 }}
                      rowKey={(record) => record.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(withRouter(Wallet));
