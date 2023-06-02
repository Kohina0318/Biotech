import React, { Component, useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Form, Input, Select, notification, Checkbox, Spin } from "antd";
import { Link } from "react-router-dom";
import AccountLinks from "./AccountLinks";
import API from "api/api";
import { languageLable } from "utilities/helpers";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import swal from "sweetalert"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { RAZORPAY_CREDENTIALS, RAZORPAY_ENV } from "utilities/constants";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useLocation } from 'react-router-dom'

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

export default function PaymentHistory(props) {

    var api = new API();
    const state1 = useSelector(state => state)
    const { selectedLanguageData } = state1.app;

    const location = useLocation()
    const userData = location.state.UserData.userData;

    const [loading, setLoading] = useState(true)
    const [myBalanceTransaction, setMyBalanceTransaction] = useState([])
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = useState("")
    const [remark, setRemark] = useState("")
    const [refresh, SetRefresh] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleGetMyBalanceTransactions = () => {
        try{
        api.get("GetMyBalanceTransactions").then((response) => {
            if (response.StatusCode === 200 && response.Result) {
                console.log('GetMyBalanceTransactions.......api data:', response.Result.BalanceTransactions)
                setMyBalanceTransaction(response.Result.BalanceTransactions)
                setLoading(false)
            }
            else{
                setLoading(false)
                notification.error({
                    message: "Error",
                    description: languageLable(
                        selectedLanguageData,
                        "Something Went wrong. Please try after sometime."
                    ),
                });
            }
        });
    }catch(e){
        setLoading(false)
        notification.error({
            message: "Error",
            description: languageLable(
                selectedLanguageData,
                "Something Went wrong. Please try after sometime."
            ),
        });
    }
    };

    useEffect(() => {
        handleGetMyBalanceTransactions()
    }, [refresh])


    const ShowPaymentHistory = () => {
        return (
            <div className={useStyles.root}>
                <div className="scrollerPaymentHistory" style={{ padding: 2, }}>
                    {myBalanceTransaction && myBalanceTransaction.map((item, index) => (
                        item.Verified == false ? (
                            <Paper elevation={2} style={{ marginTop: 8 }} key={index} >
                                <div className="ps-form__content"
                                    style={{ padding: 30, }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', maxwidth: "100%", }}>

                                        <div className="col" style={{ padding: 0, width: "50%" }}>
                                            <div style={{ fontSize: 20, }}>
                                                {languageLable(selectedLanguageData, item.Remarks)}
                                            </div>
                                            <div>
                                                {new Date(item.CreatedOn).toLocaleString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}
                                            </div>
                                        </div>

                                        <div className="col" style={{ display: 'flex', justifyContent: 'flex-end', width: "50%", alignItems: "center", padding: 0 }}>
                                            <div style={{ fontSize: 20, }}>
                                                {languageLable(selectedLanguageData, item.Amount)}
                                                <div style={{ fontSize: 11, color: 'red', display: 'flex', justifyContent: 'center', padding: 0 }}>
                                                    {languageLable(selectedLanguageData, "Failed")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </Paper>
                        ) : (
                            <Paper elevation={2} style={{ marginTop: 8 }} key={index}>
                                <div className="ps-form__content"
                                    style={{ padding: 30, }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', maxwidth: "100%", }}>

                                        <div className="col" style={{ padding: 0, width: "50%" }}>
                                            <div style={{ fontSize: 20, }}>
                                                {languageLable(selectedLanguageData, item.Remarks)}
                                            </div>
                                            <div>
                                                {new Date(item.CreatedOn).toLocaleString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}
                                            </div>
                                        </div>

                                        <div className="col" style={{ display: 'flex', justifyContent: 'flex-end', padding: 0, width: "50%", alignItems: "center" }}>
                                            <div style={{ fontSize: 20, color: 'green' }}>
                                                {languageLable(selectedLanguageData, item.Amount)}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </Paper>
                        )
                    ))}
                </div>
            </div>
        )
    }

    const handleAdd = () => {
        if (amount == "") {
            notification.error({
                message: "Error",
                description: languageLable(
                    selectedLanguageData,
                    "Amount is Required"
                ),
            });
        }
        else if (remark == "") {
            notification.error({
                message: "Error",
                description: languageLable(
                    selectedLanguageData,
                    "Remark is Required"
                ),
            });
        }
        else {
            try {
                api.get(`AddBalance?Amount=${amount}&Remark=${remark}`).then((response) => {
                    if (response.StatusCode === 200 && response.Result) {
                        console.log('AddBalance.......api data:', response.Result)
                        var PaymentOrderId = response.Result;
                        setOpen(false);
                        let options = {
                            key: RAZORPAY_CREDENTIALS[RAZORPAY_ENV].key,
                            // amount: checkoutData.TotalAmount * 100, // 2000 paise = INR 20, amount in paisa
                            order_id: response.Result,
                            name: RAZORPAY_CREDENTIALS.MERCHANT_NAME,
                            handler: (response) => {
                                if (response.razorpay_payment_id) {
                                    ConfimBalanceTransaction(
                                        PaymentOrderId,
                                        response.razorpay_payment_id
                                    );
                                } else {
                                    notification.error({
                                        message: "Error",
                                        description: languageLable(
                                            selectedLanguageData,
                                            "Something Went wrong. Please try after sometime."
                                        ),
                                    });
                                }
                            },
                            prefill: {
                                name: userData && userData.name,
                                email: userData && userData.email,
                                contact: userData && userData.phonenumber,
                            },
                            theme: {
                                color: "#2c5662",
                            },
                            modal: {
                                ondismiss: function () {
                                    window.location.reload();
                                }
                            }
                        };
                        let rzp = new window.Razorpay(options);
                        rzp.open();


                    }
                    else {
                        console.log("Error...in AddBalance")
                        setOpen(false);
                        notification.error({
                            message: "Error",
                            description: languageLable(
                                selectedLanguageData,
                                "Something Went wrong. Please try after sometime."
                            ),
                        });
                    }
                });
                SetRefresh(true);
            } catch (e) {
                notification.error({
                    message: "Error",
                    description: e,
                });
            }
        }
    }

    const ConfimBalanceTransaction = (PaymentOrderId, transactionId) => {
        try {
            api.get(
                `ConfimBalanceTransaction?PaymentOrderId=${PaymentOrderId}&TransactionId=${transactionId}`
            )
                .then((response) => {
                    if (response.StatusCode === 200 && response.Result) {
                        //   this.handleClearCart();
                        notification.success({
                            message: languageLable(
                                selectedLanguageData,
                                "Payment has been successfully."
                            ),
                        });
                    }
                });
        } catch (e) {
            notification.error({
                message: "Error",
                description: e,
            });
        }
    };


    return (
        <>
            <section className="ps-my-account ps-page--account">
                <div className="ps-container">
                    <div className="row">
                        <AccountLinks page="payment-history" />
                        <div className="col-lg-8">
                            <div className="ps-section__content">
                                <div className="ps-section--account-setting">

                                    <div style={{ marginTop: 4 }} />

                                    <div className="ps-section__header">
                                        <h3>
                                            {languageLable(selectedLanguageData, "Payment History")}
                                        </h3>
                                    </div>

                                    {loading == true ? (
                                        <div style={{ width: '820px', height: "489px", position: 'static', display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <Spin style={{ zIndex: 9999, display: 'inline-block', justifyContent: "center", alignSelf: "initial", alignItem: 'center', position: "absolute" }} />
                                        </div>

                                    ) : (
                                        myBalanceTransaction.length > 0 ?
                                            ShowPaymentHistory()
                                            : ""
                                    )
                                    }

                                    <div style={{ marginTop: 15 }} />

                                    <div onClick={() => handleClickOpen()} style={{ justifyContent: 'end', display: 'flex' }}>
                                        <button variant="contained"
                                            style={{ borderRadius: 4, textAlign: 'center', background: '#396470', color: '#FFF', padding: "7px 18px", fontSize: 16, border: 0, }}
                                        >
                                            {languageLable(selectedLanguageData, "Make Payment")}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* <---------------------------------------- Add Payment -------------------------------------------> */}

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="lg"  >
                <div style={{ width: 400, padding: 5 }}>
                    <DialogTitle id="form-dialog-title" >
                        <h5>  {languageLable(selectedLanguageData, "Add Payment")} </h5>
                    </DialogTitle>
                    <DialogContent >
                        <TextField
                            autoFocus
                            // margin="normal"
                            id="number"
                            placeholder="Enter Amount"
                            type="number"
                            variant="outlined"
                            fullWidth
                            inputProps={{ style: { fontSize: 14 } }} // font size of input text
                            InputLabelProps={{ style: { fontSize: 14 } }} // font size of input label
                            onChange={(txt) => setAmount(txt.target.value)}
                        />
                        <TextField
                            id="outlined-multiline-static"
                            placeholder="Enter Remark"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            style={{ fontSize: 14 }}
                            inputProps={{ style: { fontSize: 14 } }} // font size of input text
                            InputLabelProps={{ style: { fontSize: 14 } }} // font size of input label
                            margin="normal"
                            onChange={(txt) => setRemark(txt.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button style={{ fontSize: 14 }} onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => handleAdd()} variant="contained" style={{ fontSize: 14, background: '#396470', color: '#FFF' }} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    )
}
