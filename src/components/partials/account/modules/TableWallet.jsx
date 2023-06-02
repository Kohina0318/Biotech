import React, { Component } from "react";
import { Table } from "antd";
import { Link } from "react-router-dom";
import API from "./../../../../api/api";
var api;


class TableWallet extends Component {
  constructor({ props }) {
    super(props);
    api = new API();
    this.state = {
      walletData: [],
    };
  }

  componentDidMount = () => {
    this.getMyWallet();
  };

  getDate = (date)=>{
    console.log("createdOn>>>",date)
    return 'hh';
   }
  //  2021-04-16T14:21:14.995644
  getMyWallet = () => {
    api.get("GetMyWallet").then((response) => {
      if (response.StatusCode === 200 && response.Result) {
        console.log("walletData result in table wallet page",response.Result);
        response.Result.WalletHistories.map((item,index)=>{
          // console.log("map",item.CreatedOn);
          // let td = item.CreatedOn.split('-')[2]
          // let dd = td.substring(0,2);
          // let mm = item.CreatedOn.split('-')[1]
          // let yy = item.CreatedOn.split('-')[0]

          // console.log(`${dd}/${mm}/${yy}`)   
          const displayDate = (date) => {
            let d = new Date(date);
            let dd = d.getDate();
            // let newdd = dd+1
            let newdd = dd
            let mm = d.getMonth()+1;
            var yyyy = d.getFullYear();
            if(newdd<10) 
            {
              newdd='0'+newdd;
            } 
            if(mm<10) 
            {
                mm='0'+mm;
            } 
            let cd = newdd+ "-" +mm+ "-" +yyyy;
            return cd;
          };
        
          const displayTime = (time) => {
            console.log(time);
            let tm = new Date(time);
            // let tm = time;
        
            // console.log("timeeee", tm);
        
            var h = tm.getHours();
            if(h<10){
              h = `0${h}`
            }
            var m = tm.getMinutes();
            if(m<10){
              m = `0${m}`
            }
            var t = h > 12 ? h - 12 + ":" + m + " PM" : h + ":" + m + " AM";
            return t;
          };
         let updatedDate =  displayDate(item.CreatedOn)
         let updatedTime =  displayTime(item.CreatedOn)
        console.log(`aaya re>>>${updatedDate} ${updatedTime}`)
        item.CreatedOn = `${updatedDate} ${updatedTime}`;
        })
        console.log("Update",response.Result.WalletHistories)
       
       
        this.setState({
          walletData: response.Result,
        });
      }
    });
  };




  render() {
    const { walletData } = this.state;

    // const tableData = [
    //   {
    //     id: "1",
    //     invoiceId: "500884010",
    //     crdr: "Credit",
    //     title: "Marshall Kilburn Portable Wireless Speaker",
    //     dateCreate: "20-1-2020",
    //     amount: "42.99",
    //     status: "Successful delivery",
    //   },
    //   {
    //     id: "2",
    //     invoiceId: "593347935",
    //     title: "Herschel Leather Duffle Bag In Brown Color",
    //     dateCreate: "20-1-2020",
    //     amount: "199.99",
    //     status: "Cancel",
    //   },
    //   {
    //     id: "3",
    //     invoiceId: "593347935",
    //     title: "Xbox One Wireless Controller Black Color",
    //     dateCreate: "20-1-2020",
    //     amount: "199.99",
    //     status: "Cancel",
    //   },
    //   {
    //     id: "4",
    //     invoiceId: "615397400",
    //     title: "Grand Slam Indoor Of Show Jumping Novel",
    //     dateCreate: "20-1-2020",
    //     amount: "41.00",
    //     status: "Cancel",
    //   },
    // ];
     const tableColumn = [
  
      {
        title: "Date",
        rowKey: "date",
        dataIndex: "CreatedOn",
        key: "date",
        width: "120px",
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
        width: "150px",
      },
    ];
    return (
      <>
      <div className="float-right">
        <h3>filter</h3>
      </div>
      <div className="ps-section__content">
        <Table
        columns={tableColumn}
        dataSource={walletData && walletData.WalletHistories}
        rowKey={(record) => record.id}
        />
      </div>
      </>

    );
  }
}

export default TableWallet;
