import React, { Component, useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AccountLinks from "./AccountLinks";
import API from "api/api";
import { languageLable } from "utilities/helpers";
import StarOutlined from '@ant-design/icons';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
//import swal from '@sweetalert/with-react'
import swal from "sweetalert"
import Button from '@material-ui/core/Button';
import { FaFilter } from 'react-icons/fa';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Spin } from "antd";
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'contents',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1),
      // width: theme.spacing(49),
      height: "auto",
      //  width:'100%'
    },
  },
  paper: {
    padding: 25,
  },
  appBar: {
    position: 'relative',
    background: '#396470'
  },
  title: {
    marginLeft: theme.spacing(1),
    flex: 1,
    color: "#fff",
    fontSize: 15
  },
  myContainer: {
    display: "flex",
    flexDirection: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  myDatePicker: {
    width: "85%",  // note: if I change this value to a fixed value (such as 500px) then the width is effected

  },
  datepicker: {
    width: "100%"
  },


}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function AllLoyalty() {

  const state1 = useSelector(state => state)
  // console.log("===============>",state1.app.selectedLanguage)
  const { selectedLanguageData } = state1.app;
  // console.log("language Label.....",languageLable(selectedLanguageData, "Wallet"))

  const classes = useStyles();

  const showTransactionsCard = () => {
    try {
      var Startdate = new Date(state[0].startDate).valueOf();
      var Enddate = new Date(state[0].endDate).valueOf();
      // var Startdate = new Date(state[0].startDate);
      // var Enddate = new Date(state[0].endDate);

      return (

        <div className={classes.root}>

          {loyaltyHistoryData.map(item => {

            var date = item.transaction_on;
            let dd = date.split('-')[0];
            let mm = date.split('-')[1];
            let yy = date.split('-')[2];

            let finalDate = new Date(`${mm}-${dd}-${yy}`).valueOf()
            console.log("===>", Startdate, Enddate, finalDate)

            if (Startdate <= finalDate && Enddate >= finalDate) {
              return (
                <Paper elevation={2} className={classes.paper}  >
                  <div >
                    <div class="row" style={{ maxWidth: "100%" }} >
                      <div className="col-sm-5" style={{ width: "50%", fontWeight: 'bold' }} > {languageLable(selectedLanguageData, "Transaction Type")}</div>
                      <div className="col-sm-7" style={{ width: "50%", display: "flex", justifyContent: "flex-end", fontWeight: 'bold' }}> {languageLable(selectedLanguageData, item.transaction_transactiontype)} </div>
                    </div>
                    {item.transaction_creditpoint > 0 ? (
                      <div class="row" style={{ maxWidth: "100%" }}>
                        <div className="col-sm-5" style={{ width: "50%", fontWeight: 'bold', color: "#27ae60" }}> {languageLable(selectedLanguageData, "Credit Points")} </div>
                        <div className="col-sm-7" style={{ width: "50%", display: "flex", justifyContent: "flex-end", fontWeight: 'bold', color: '#27ae60' }}> {languageLable(selectedLanguageData, item.transaction_creditpoint)} </div>
                      </div>
                    ) : (
                      <div class="row" style={{ maxWidth: "100%" }}>
                        <div className="col-sm-5" style={{ width: "50%", fontWeight: 'bold', color: "#c0392b" }} > {languageLable(selectedLanguageData, "Debit Points")} </div>
                        <div className="col-sm-7" style={{ width: "50%", display: "flex", justifyContent: "flex-end", fontWeight: 'bold', color: '#c0392b' }}> {languageLable(selectedLanguageData, item.transaction_debitpoint)} </div>
                      </div>
                    )}

                    <div class="row" style={{ maxWidth: "100%" }}>
                      <div className="col-sm-5" style={{ width: "50%", fontWeight: 'bold', }} > {languageLable(selectedLanguageData, "Transaction Date")} </div>
                      <div className="col-sm-7" style={{ width: "50%", display: "flex", justifyContent: "flex-end", fontWeight: 'bold' }}> {languageLable(selectedLanguageData, item.transaction_on)}  </div>
                    </div>
                  </div>
                </Paper>
              )
            }
            else if (Startdate == Enddate) {
              return (
                <Paper elevation={2} className={classes.paper}  >
                  <div >
                    <div class="row" style={{ maxWidth: "100%" }} >
                      <div className="col-sm-5" style={{ fontWeight: 'bold', width: "50%" }} > {languageLable(selectedLanguageData, "Transaction Type")} </div>
                      <div className="col-sm-7" style={{ width: "50%", display: "flex", justifyContent: "flex-end", fontWeight: 'bold' }}> {languageLable(selectedLanguageData, item.transaction_transactiontype)} </div>
                    </div>
                    {item.transaction_creditpoint > 0 ? (
                      <div class="row" style={{ maxWidth: "100%" }}>
                        <div className="col-sm-5" style={{ width: "50%", fontWeight: 'bold', color: "#27ae60" }} > {languageLable(selectedLanguageData, "Credit Points")} </div>
                        <div className="col-sm-7" style={{ width: "50%", display: "flex", justifyContent: "flex-end", fontWeight: 'bold', color: '#27ae60' }}> {languageLable(selectedLanguageData, item.transaction_creditpoint)} </div>
                      </div>
                    ) : (
                      <div class="row" style={{ maxWidth: "100%" }}>
                        <div className="col-sm-5" style={{ width: "50%", fontWeight: 'bold', color: "#c0392b" }} > {languageLable(selectedLanguageData, "Debit Points")} </div>
                        <div className="col-sm-7" style={{ width: "50%", display: "flex", justifyContent: "flex-end", fontWeight: 'bold', color: '#c0392b' }}> {languageLable(selectedLanguageData, item.transaction_debitpoint)} </div>
                      </div>
                    )}

                    <div class="row" style={{ maxWidth: "100%" }}>
                      <div className="col-sm-5" style={{ width: "50%", fontWeight: 'bold', }}> {languageLable(selectedLanguageData, "Transaction Date")}  </div>
                      <div className="col-sm-7" style={{ width: "50%", display: "flex", justifyContent: "flex-end", fontWeight: 'bold' }}> {languageLable(selectedLanguageData, item.transaction_on)} </div>
                    </div>
                  </div>
                </Paper>
              )
            }
          })}

        </div>
      )
    } catch (e) {
      console.log("Error...in showTransactionsCard..:", e)
    }
  }

  const handleLoyaltyRedeemPoints = async () => {

    let cid = localStorage.getItem('userData');
    let customerid = JSON.parse(cid);
    let auth = localStorage.getItem("authToken")
    let device = localStorage.getItem("deviceToken")

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    swal({
      title: languageLable(selectedLanguageData, "Redeem Your Loyalty Points"),
      content: "input",
      //placeholder: "Enter your loyalty points",
      button: {
        text: languageLable(selectedLanguageData, "Redeem"),
        closeModal: false,
      },
    })
      .then((ok) => {

        if (ok) {

          fetch(`https://loyaltyuat.biotech.archisys.biz/api/RedeemPoints?customerid=${customerid.id}&points=${ok}&authorizetoken=Bearer ${auth}&devicetoken=${device}&baseurl=@http://localhost:7100`, requestOptions)
            .then(response => response.json())
            .then(result => {

              //console.log("REDEEM LOYALTY POINTS...:", result)

              swal(`${result.message}`, {
                icon: "success",
              })
                .catch(error => console.log('error', error));

              window.location.reload()
            })

        }
        else {
          swal(languageLable(selectedLanguageData, "Something went wrong!"), {
            icon: "error"
          });
        }
      });
  }


  ////////////////////////////////////////////////  Filter Calender  //////////////////////////////////////////////////////////

  const [state, setState] = React.useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
      color: "#396470"
    }
  ]);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

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


  const handleClose = () => {
    setOpen(false);
  };


  const handleSave = () => {
    setOpen(false);
  };

  const showDialog = () => {

    return (
      <div>
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} aria-labelledby="form-dialog-title" maxWidth="lg">

          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                <CloseIcon style={{ fontSize: 20 }} />
              </IconButton>
              <Typography variant="h5" className={classes.title}>
                {languageLable(selectedLanguageData, "Select Range")}
              </Typography>
              <Button autoFocus color="inherit" style={{ fontSize: 15 }} onClick={() => handleSave()}>
                {languageLable(selectedLanguageData, "Save")}
              </Button>
            </Toolbar>
          </AppBar>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className={classes.myContainer} >
                <DateRange
                  editableDateInputs={true}
                  onChange={item => setState([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                  months={2}
                  wrapperClassName={classes.datepicker}
                  //className={classes.myDatePicker}
                  direction="horitental"
                />
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>

      </div>
    );

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const [loading, setLoading] = useState(true)
  const [loyaltyPoint, setLoyaltyPoint] = useState("")
  const [loyaltyPlan, setLoyaltyPlan] = useState("")
  const [loyaltyHistoryData, setLoyaltyHistoryData] = useState([])


  const handleGetLoyaltyCustomerStatus = async () => {

    let cid = localStorage.getItem('userData');
    let customerid = JSON.parse(cid);

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://loyaltyuat.biotech.archisys.biz/api/CustomerStatus?customerid=${customerid.id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("LOYALTY Customer Status...:", result)
        setLoyaltyPoint(result.data.totalAvailable)
        setLoyaltyPlan(result.data.plan)
      }
      )
      .catch(error => console.log('error', error));

  }

  const handleGetLoyaltyHistory = async () => {
    try {
      let cid = localStorage.getItem('userData');
      let customerid = JSON.parse(cid);
      //alert(customerid.id)
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      fetch(`https://loyaltyuat.biotech.archisys.biz/api/CustomerEarningHistory?customerid=${customerid.id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log("LOYALTY Customer Earning History...:", result)
          if (result.data != null) {
            setLoyaltyHistoryData(result.data)
          }
        }
        )
        .catch(error => console.log('error', error));
      setLoading(false)

    } catch (e) {
      setLoading(false)
      console.log("Error..in handleGetLoyaltyHistory", e)
    }
  }

  useEffect(() => {
    handleGetLoyaltyCustomerStatus();
    handleGetLoyaltyHistory();
  }, [])


  const handleRibbion = () => {
    if (loyaltyPlan == 'Classic') {
      return (
        <>
          <span class="ribbon" style={{ background: "#458DA3", color: "#fff", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
            <span> {languageLable(selectedLanguageData, loyaltyPlan)}</span>
          </span>
        </>
      )
    }
    else if (loyaltyPlan == 'Silver') {
      return (
        <>
          <span class="ribbon" style={{ background: "#808080", color: "#fff", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
            <span>{languageLable(selectedLanguageData, loyaltyPlan)}</span>
          </span>
        </>
      )
    }
    else if (loyaltyPlan == 'Gold') {
      return (
        <>
          <span class="ribbon" style={{ background: "#D2AE36", color: "#fff", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
            <span>{languageLable(selectedLanguageData, loyaltyPlan)}</span>
          </span>
        </>
      )
    }
    else {
      return (
        <>
          <span class="ribbon" style={{ background: "#E6E6E6", color: "#808080", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
            <span>{languageLable(selectedLanguageData, loyaltyPlan)}</span>
          </span>
        </>
      )
    }
  }

  const handleLoyaltyBalance = () => {
    if (loyaltyPlan == 'Classic') {
      return (
        <>
          <div style={{ color: "#458DA3", }}>
            <div style={{ display: "flex", justifyContent: 'flex-end', fontSize: 30, fontWeight: "bold", }} >
              {loyaltyPoint != undefined ? (<>{languageLable(selectedLanguageData, loyaltyPoint)} </>) : 0}
            </div>
            <div style={{ display: "flex", justifyContent: 'flex-end', fontSize: 15, fontWeight: "bold" }}>
              {languageLable(selectedLanguageData, "Available Balance Points")}
            </div>
          </div>
        </>
      )
    }
    else if (loyaltyPlan == 'Silver') {
      return (
        <>
          <div style={{ color: "#808080", }}>
            <div style={{ display: "flex", justifyContent: 'flex-end', fontSize: 30, fontWeight: "bold", }} >
              {loyaltyPoint != undefined ? (<>{languageLable(selectedLanguageData, loyaltyPoint)} </>) : 0}
            </div>
            <div style={{ display: "flex", justifyContent: 'flex-end', fontSize: 15, fontWeight: "bold" }}>
              {languageLable(selectedLanguageData, "Available Balance Points")}
            </div>
          </div>
        </>
      )
    }
    else if (loyaltyPlan == 'Gold') {
      return (
        <>
          <div style={{ color: "#D2AE36" }}>
            <div style={{ display: "flex", justifyContent: 'flex-end', fontSize: 30, fontWeight: "bold", }} >
              {loyaltyPoint != undefined ? (<>{languageLable(selectedLanguageData, loyaltyPoint)} </>) : 0}
            </div>
            <div style={{ display: "flex", justifyContent: 'flex-end', fontSize: 15, fontWeight: "bold" }}>
              {languageLable(selectedLanguageData, "Available Balance Points")}
            </div>
          </div>
        </>
      )
    }
    else {
      return (
        <>
          <div style={{ color: "#808080" }}>
            <div style={{ display: "flex", justifyContent: 'flex-end', fontSize: 30, fontWeight: "bold", }} >
              {loyaltyPoint != undefined ? (<>{languageLable(selectedLanguageData, loyaltyPoint)} </>) : 0}
            </div>
            <div style={{ display: "flex", justifyContent: 'flex-end', fontSize: 15, fontWeight: "bold" }}>
              {languageLable(selectedLanguageData, "Available Balance Points")}
            </div>
          </div>
        </>
      )
    }
  }



  return (
    <section className="ps-my-account ps-page--account">
      <div className="ps-container">
        <div className="row">

          <AccountLinks page="Loyalty" />
          <div className="col-lg-8">
            <div className="ps-section__content">

              <div style={{ margin: 5 }} />

              <div style={{ background: "#fff", borderRadius: 15, height: 170, maxWidth: "100%", border: " 1px solid #7f8c8d" }}>
                <div className="row">
                  <div className="col-lg-7" style={{ width: "50%" }}>
                    <img src="/MAp1.png" style={{ height: 168, width: 500, borderRadius: 17, }} />
                  </div>
                  <div className="col-lg-5" style={{ width: "50%" }}>
                    {loyaltyPlan != undefined ?
                      <div>
                        {handleRibbion()}
                      </div>
                      : ""}
                    <div style={{ display: 'flex', justifyContent: "flex-end", marginTop: "75px", marginRight: 5 }}>
                      {handleLoyaltyBalance()}
                    </div>
                  </div>
                </div>
              </div>

              {loading == true ?
                (
                  <div className="ps-section--shopping ps-shopping-cart"  >
                    <div className="ps-container">

                      <div class="row" style={{ maxWidth: "100%", opacity: 0.5 }} >
                        <div class="col" style={{ width: "70%" }}>
                          <h3>{languageLable(selectedLanguageData, "Recent Transactions")}</h3>
                        </div>

                        <div class="col" style={{ justifyContent: 'end', display: 'flex', width: "40%" }}>
                          <Button onClick={() => handleClickOpen()} style={{ borderRadius: 5, textAlign: 'center', background: '#396470', color: '#FFF', padding: "6px 12px", position: "absolute" }} >
                            <FaFilter style={{ height: 14, width: 20, }} />
                            <b style={{ fontSize: 15 }}>{languageLable(selectedLanguageData, "Filter")}</b>
                          </Button>
                        </div>
                      </div>

                      <div style={{ width: '820px', height: "300px", position: 'static', display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Spin style={{ zIndex: 9999, display: 'inline-block', justifyContent: "center", alignSelf: "initial", alignItem: 'center', position: "absolute" }} />
                      </div>

                    </div>
                  </div>
                ) : (
                  loyaltyHistoryData.length > 0 ?
                    <div className="ps-section--shopping ps-shopping-cart" >
                      <div className="ps-container">
                        <div class="row" style={{ maxWidth: "100%" }} >
                          <div class="col" style={{ width: "70%" }}>
                            <h3>{languageLable(selectedLanguageData, "Recent Transactions")}</h3>
                          </div>

                          <div class="col" style={{ justifyContent: 'end', display: 'flex', width: "40%" }}>
                            <Button onClick={() => handleClickOpen()} style={{ borderRadius: 5, textAlign: 'center', background: '#396470', color: '#FFF', padding: "6px 12px", position: "absolute" }} >
                              <FaFilter style={{ height: 14, width: 20, }} />
                              <b style={{ fontSize: 15 }}>{languageLable(selectedLanguageData, "Filter")}</b>
                            </Button>
                          </div>
                        </div>

                        <div class="scrollerLoyalty" >
                          {showTransactionsCard()}
                        </div>

                      </div>
                    </div>
                    : <div style={{ marginTop: 10 }} />
                )
              }
              {(loyaltyPoint > 0) || (loyaltyPoint != undefined) ?
                < div className="ps-container">
                  <div className="ps-section__content" style={{ justifyContent: 'end', display: 'flex' }}>
                    <Button variant="contained" onClick={() => handleLoyaltyRedeemPoints()} style={{ borderRadius: 5, textAlign: 'center', background: '#396470', color: '#FFF', padding: "6px 12px" }} >
                      <b style={{ fontSize: 15 }}>{languageLable(selectedLanguageData, "REDEEM POINTS")}</b>
                    </Button>
                  </div>
                </div>
                : ""}

              {showDialog()}
            </div>
          </div>
        </div>
      </div>
    </section >

  )
}
