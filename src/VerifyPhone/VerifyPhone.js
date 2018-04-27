import React, { Component } from 'react';
import $ from 'jquery';
import { MyAjax } from '../MyAjax'
import { toast } from 'react-toastify';
import { ApiUrl } from '../Config';
import moment from 'moment';
import { showErrorsForInput } from '../ValidateForm';
import validate from "validate.js";

class PhoneVerify extends Component {

    constructor(props) {
        super(props);
        this.state = { PhoneNumber: null, UserId: null };
    }


    componentDidMount() {
        this.setState({ PhoneNumber: this.props.match.params["phone"], UserId: this.props.match.params["userId"] })
    }

    render() {
        return (
            <div className="container">
                <h3 className="text-center"> Please enter the OTP sent to your registered mobile ({this.state.PhoneNumber})  </h3>
                <div className="col-md-4 text-center col-md-offset-4 mtop10">
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-lock" aria-hidden="true"></i>
                            </span>
                            <input className="form-control" name="otp" ref="otp" placeholder="OTP" autoComplete="off" />
                        </div>
                    </div>
                </div>

                <div className="col-xs-12 text-center">
                    Resend OTP by <a className="link pointer" onClick={() => { this.resendOtp("text") }}>SMS</a> or <a className="link pointer" onClick={() => { this.resendOtp("voice") }}>Call</a>
                </div>

                <div className="col-xs-12 text-center form-group mtop10">
                    <button type="submit" name="submit" className="btn btn-primary" onClick={this._handleSubmit.bind(this)}>Verify</button>
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    _handleSubmit(e) {
        e.preventDefault();
        var otp = this.refs.otp.value.trim();
        if (otp === "") {
            showErrorsForInput(this.refs.otp, ["Please enter the OTP"]);
            return;
        }
        if (otp.length !== 6) {
            showErrorsForInput(this.refs.otp, ["OTP should be 6 digits"]);
            return;
        }
        else {
            showErrorsForInput(this.refs.otp, []);
        }
        $(".loader").show();
        $("button[name='submit']").hide();
        var url = ApiUrl + "/api/Account/ConfirmPhone?userId=" + this.state.UserId + "&mobile=" + this.state.PhoneNumber + "&otp=" + otp;
        $.get(url).then(
            (result) => {
                // toast("Please verify your registered email by clicking on the link sent to you!", {
                //     type: toast.TYPE.SUCCESS
                // });
                this.props.history.push("/verification-success");
            },
            (error) => {
                $(".loader").hide();
                $("button[name='submit']").show();
                toast("Invalid OTP", {
                    type: toast.TYPE.ERROR
                });
            }
        );
    }

    resendOtp(type) {
        var url = ApiUrl + "/api/Sms/ResendOtp?mobile=" + this.state.PhoneNumber + "&type=" + type;
        $.get(url).then(
            (result) => {
                toast("OTP sent to " + this.state.PhoneNumber, {
                    type: toast.TYPE.SUCCESS
                });
            },
            (error) => {
                $(".loader").hide();
                $("button[name='submit']").show();
                toast("Error sending OTP, please try again!", {
                    type: toast.TYPE.ERROR
                });
            }
        );
    }
}

export default PhoneVerify;

