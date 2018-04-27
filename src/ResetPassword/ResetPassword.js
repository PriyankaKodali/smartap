import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl } from '../Config';
import { showErrorsForInput } from '../ValidateForm';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = { userId: "", code: "" };
    }
    componentDidMount() {
        this.setState({ userId: this.props.match.params["userId"], code: this.props.match.params["code"] });
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
                                <h3 className="login-panel">Reset Password</h3>
                            </div>

                            <form className="resetFields" name="resetForm" onSubmit={this._handleValidSubmit.bind(this)}>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1">
                                    <label htmlFor="password">New Password</label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                                            </span>
                                            <input type="password" className="form-control"
                                                placeholder="New Password" autoComplete="off"
                                                name="password" ref="password"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 input-container">
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
                                    <button type="submit" name="submit" className="btn btn-primary">Reset</button>
                                    <div className="loader"></div>
                                </div>
                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center mbot10 input-container">
                                    <a className="pointer" onClick={() => this.props.history.push("/login")}>back to login</a>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div >

        );
    }

    _handleValidSubmit(e) {
        e.preventDefault();
        toast.dismiss();
        if (this.refs.password.value.trim() === "") {
            this.refs.password.focus();
            showErrorsForInput(this.refs.password, ["Please enter a valid password"]);
            return false;
        }
        if (this.refs.password.value.trim().length < 6) {
            showErrorsForInput(this.refs.password, ["Password should contain atleast 6 characters"]);
            return false;
        }
        if (this.refs.confirmPassword.value.trim() === "") {
            showErrorsForInput(this.refs.confirmPassword, ["Please enter a valid password"]);
            return null;
        }
        if (this.refs.confirmPassword.value.trim() !== this.refs.password.value.trim()) {
            showErrorsForInput(this.refs.confirmPassword, ["Password doesnt match"]);
            return false;
        }
        $(".loader").show();
        $("button[name='submit']").hide();

        var data = {
            NewPassword: this.refs.password.value.trim(),
            ConfirmPassword: this.refs.confirmPassword.value.trim(),
            UserId: this.state.userId,
            Code: this.state.code
        };

        var url = ApiUrl + "/api/Account/SetPassword";
        $.post(url, data).then(
            (data) => {
                toast("Password updated succesfully!", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/login");
            },
            (error) => {
                this.setState({ error: error.responseText.replace(/\[|"|\]/g, '') });
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".loader").hide();
                $("button[name='submit']").show();
            }
        );
    }
}

export default ResetPassword;

