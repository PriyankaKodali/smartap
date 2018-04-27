import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { validate } from 'validate.js'
import { showErrorsForInput } from '../ValidateForm';
import { ApiUrl } from '../Config'

class ForgotPassword extends Component {

    constructor(props) {

        super(props);
        this.state = {
            error: ""
        }
    }

    componentDidMount() {
        this.refs.email.focus();
    }



    render() {
        return (

            <div className="col-xs-12 m0 flex">
                <div className="col-xs-12 col-sm-6 hidden-xs">
                    <img src="Images/loginbanner.png" alt="" className="col-xs-12 col-md-8 col-md-offset-2 img-responsive" />
                </div>
                <div className="col-xs-12 col-sm-6 mtop10">
                    <div className="col-xs-12 registration-form">
                        <div className="row  text-center formBlock">
                            <div className="borderBottom regHeading">
                                <h3 className="login-panel">Forgot Password</h3>
                            </div>
                            <form className="regFields" name="regForm" onSubmit={this._handleSubmit.bind(this)}>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 input-container form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-envelope" aria-hidden="true"></i>
                                        </span>
                                        <input name="email" className="form-control" type="text" placeholder="Email" autoComplete="off" ref="email" />
                                    </div>
                                    <div className="messages">
                                    </div>
                                </div>

                                <div className="clearfix"></div>
                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center input-container mbot10">
                                    <button type="submit" name="submit" className="btn btn-primary">Reset</button>
                                    <div className="loader"></div>
                                </div>
                                <div className="col-xs-12 text-center">
                                    <a className="pointer" onClick={()=>{this.props.history.push("/login")}}>Go to Login</a>
                                </div>

                            </form>
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

        if (validate.single(this.refs.email.value.trim(), { email: true }) !== undefined) {
            this.refs.email.focus();
            showErrorsForInput(this.refs.email,["Please enter a valid email"]);
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }
        else{
            showErrorsForInput(this.refs.email,[]);
        }

        var url = ApiUrl + "/api/Account/ForgotPassword?email=" + this.refs.email.value;
        $.get(url).then((data) => {
            toast("Please check your registered email!", {
                type: toast.TYPE.SUCCESS
            });
            this.props.history.push("/login");
        },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".loader").hide();
                $("button[name='submit']").show();
                return false;
            });

    }


}

export default ForgotPassword;

