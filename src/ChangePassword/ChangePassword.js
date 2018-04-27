import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl } from '../Config';
import { MyAjax } from '../MyAjax'
import { showErrorsForInput } from '../ValidateForm';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="col-xs-12 m0 flex">
                <div className="col-xs-12 col-sm-6 hidden-xs">
                    <img src="Images/loginbanner.png" alt="" className="col-xs-12 col-md-8 col-md-offset-2 img-responsive" />
                </div>
                <div className="col-xs-12 col-sm-6">
                    <div className="col-xs-12 registration-form">
                        <div className="row formBlock">
                            <div className="borderBottom regHeading text-center">
                                <h3 className="login-panel">Change Password</h3>
                            </div>

                            <form className="resetFields" name="resetForm" onSubmit={this._handleValidSubmit.bind(this)}>


                                <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                                    <label htmlFor="password">Old Password</label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                                            </span>
                                            <input type="password" className="form-control"
                                                placeholder="Old Password"
                                                name="oldPassword" ref="oldPassword" autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                                    <label htmlFor="password">New Password</label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                                            </span>
                                            <input type="password" className="form-control"
                                                placeholder="New Password" autoComplete="off"
                                                name="newPassword" ref="newPassword"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                                            </span>
                                            <input type="password" className="form-control"
                                                placeholder="Confirm Password" autoComplete="off"
                                                name="confirmPassword" ref="confirmPassword"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="clearfix"></div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center mbot10 input-container">
                                    <button type="submit" className="btn btn-primary">Change</button>
                                    <div className="loader"></div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div >

        );
    }

    logout() {
        sessionStorage.removeItem("smart_ap_access_token");
        sessionStorage.removeItem("roles");
        window.isLoggedIn = false;
        window.open("/#/login", "_self")
    }

    _handleValidSubmit(e) {
        e.preventDefault();
        toast.dismiss();
        if (this.refs.oldPassword.value.trim() === "") {
            this.refs.oldPassword.focus();
            showErrorsForInput(this.refs.oldPassword, ["Please enter a valid password"]);
            return false;
        }
        else {
            showErrorsForInput(this.refs.oldPassword, null);
        }
        if (this.refs.newPassword.value.trim() === "") {
            this.refs.newPassword.focus();
            showErrorsForInput(this.refs.newPassword, ["Please enter a valid password"]);
            return false;
        }
        else if (this.refs.newPassword.value.trim().length < 6) {
            this.refs.newPassword.focus();
            showErrorsForInput(this.refs.newPassword, ["Password should contain atleast 6 characters"]);
            return false;
        }
        else {
            showErrorsForInput(this.refs.newPassword, null);
        }
        if (this.refs.confirmPassword.value.trim() === "") {
            this.refs.confirmPassword.focus();
            showErrorsForInput(this.refs.confirmPassword, ["Please enter a valid password"]);
            return null;
        }
        else {
            showErrorsForInput(this.refs.confirmPassword, null);
        }
        if (this.refs.confirmPassword.value.trim() !== this.refs.newPassword.value.trim()) {
            this.refs.confirmPassword.focus();
            showErrorsForInput(this.refs.confirmPassword, ["Password doesnt match"]);
            return false;
        }
        else {
            showErrorsForInput(this.refs.confirmPassword, null);
        }
        $(".loader").show();
        $("button[type='submit']").hide();

        var data = {
            OldPassword: this.refs.oldPassword.value.trim(),
            NewPassword: this.refs.newPassword.value.trim(),
            ConfirmPassword: this.refs.confirmPassword.value.trim()
        };

        var url = ApiUrl + "/api/Account/ChangePassword";
        MyAjax(
            url,
            (data) => {
                toast("Password updated succesfully!", {
                    type: toast.TYPE.SUCCESS
                });
                this.logout();
            },
            (error) => {
                this.setState({ error: error.responseJSON[0] });
                toast(error.responseJSON[0], {
                    type: toast.TYPE.ERROR
                });
                $(".loader").hide();
                $("button[type='submit']").show();
            },
            "POST",
            data
        );
    }
}

export default ResetPassword;

