import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ValidateForm, setUnTouched } from '../ValidateForm';
import { ApiUrl } from '../Config'
import { MyAjax } from '../MyAjax'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { error: "" };
    }

    componentDidMount() {
        setUnTouched(document);
        // this.refs.email.focus();
    }

    render() {
        return (
            <div className="col-xs-12 m0 flex">
                <div className="col-xs-12 col-sm-6 hidden-xs">
                    <img src="Images/loginbanner.png" alt="" className="col-xs-12 col-md-8 col-md-offset-2 img-responsive" />
                </div>
                <div className="col-xs-12 col-sm-6 mtop10">
                    <div className="col-xs-12 login-form bg-white">
                        <div className="row  text-center formBlock">
                            <div className="borderBottom regHeading">
                                <h3 className="login-panel">Sign In</h3>
                            </div>

                            <form className="loginForm" name="loginForm" onChange={(e) => ValidateForm(e)} onSubmit={this._handleSubmit.bind(this)}>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-envelope" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Email" name="email" autoComplete="off" ref="email" />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="password" placeholder="Password" name="password" autoComplete="off" ref="password" />
                                    </div>
                                </div>

                                <div className="clearfix"></div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center form-group">
                                    <button type="submit" name="submit" className="btn btn-primary">Sign In</button>
                                    <div className="loader"></div>
                                </div>
                            </form>

                        </div>
                        <div className="text-center row m10">
                            <Link to="forgot-password" className="myLink"><u>Forgot password?</u></Link>
                        </div>
                        <div className="text-center row m10">
                            <Link to="/quick-registration" className="myLink"><u>New user?</u></Link>
                        </div>
                        <div className="text-center row m10">
                            <a href="https://www.facebook.com/APSmartVillage/" style={{ margin: "0px 5px", padding: "0px" }} target="_blank ">
                                <img src="../Images/fb.png" alt="" width="32" height="32" />
                            </a>
                            <a href="https://twitter.com/APSmartVillage" style={{ margin: "0px 5px", padding: "0px" }} target="_blank ">
                                <img src="../Images/tw.png" alt="" width="32" height="32" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _handleSubmit(e) {
        e.preventDefault();
        toast.dismiss();
        $(".loader").css("display", "inline-block");
        $("button[name='submit']").hide();

        if (!ValidateForm(e)) {
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }

        var data = {
            username: this.refs.email.value,
            password: this.refs.password.value,
            grant_type: "password"
        };

        var url = ApiUrl + "/Token";
        try {
            $.post(url, data).done(
                (data) => {
                    window.isLoggedIn = true;
                    sessionStorage.setItem("smart_ap_access_token", data["access_token"]);
                    sessionStorage.setItem("smart_ap_roles", data["roles"]);
                    sessionStorage.setItem("smart_ap_displayName", data["userName"]);
                    sessionStorage.setItem("smart_ap_officialLocation", data["officialLocation"]);

                    if (data["roles"].indexOf("CPO") !== -1) {
                        this.props.history.push("/admin/cpo-dashboard");
                        return;
                    }
                    if (data["roles"].indexOf("MPDO") !== -1) {
                        this.props.history.push("/admin/mpdo-dashboard");
                        return;
                    }
                    if (data["roles"].indexOf("MO") !== -1) {
                        this.props.history.push("/admin/mo-dashboard");
                        return;
                    }
                    if (data["roles"].indexOf("WowTracker") !== -1) {
                        this.props.history.push("/admin/wow-tracker");
                        return;
                    }
                    if (data["roles"].indexOf("Employee") !== -1) {
                        this.props.history.push("/admin/admin-dashboard");
                        return;
                    }
                    this.props.history.push("/partner-dashboard");
                }
            ).fail(
                (error) => {
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    if (error.responseJSON) {
                        if (error.responseJSON.error === "unverified_email") {
                            var msg = <div>Please verify your registered email before logging in! <u className="pointer" onClick={() => this.resendEmail(error.responseJSON.error_uri)}>Resend Email</u> </div>
                            toast(msg, {
                                type: toast.TYPE.INFO,
                                autoClose: false
                            });
                            return;
                        }
                        if (error.responseJSON.error === "unverified_phone") {
                            var msg = <div>Please verify your registered mobile before logging in!! <u className="pointer" onClick={() => this.resendOtp(error.responseJSON.error_uri)}>Resend OTP</u> </div>
                            toast(msg, {
                                type: toast.TYPE.INFO,
                                autoClose: false
                            });
                            return;
                        }
                        toast(error.responseJSON.error_description, {
                            type: toast.TYPE.ERROR
                        });
                    }
                    else {
                        toast("An error occoured, please try again", {
                            type: toast.TYPE.ERROR
                        });
                    }
                    return false;
                }
                )
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }

    }

    getDisplayName() {
        var url = ApiUrl + "/api/MasterData/GetDisplayName";
        MyAjax(
            url,
            (data) => { },
            (error) => { },
            "GET",
            null
        )
    }

    resendEmail(userId) {
        var url = ApiUrl + "/api/Account/SendEmailConfirmation?UserId=" + userId;
        $.get(url).then(
            (result) => {
                toast("Verification email sent sucessfully!", {
                    type: toast.TYPE.SUCCESS
                });
            },
            (error) => {
                toast("An error occoured, please try again!", {
                    type: toast.TYPE.ERROR
                });
            }
        );
    }

    resendOtp(userId) {
        var url = ApiUrl + "/api/Account/SendMobileConfirmation?UserId=" + userId;
        $.get(url).then(
            (result) => {
                toast("OTP Sent Successfully!", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/verify-phone/" + userId + "/" + result["PhoneNumber"]);
            },
            (error) => {
                toast("An error occoured, please try again!", {
                    type: toast.TYPE.ERROR
                });
            }
        );
    }
}

export default Login;

