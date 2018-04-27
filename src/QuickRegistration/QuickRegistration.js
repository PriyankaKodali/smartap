import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl } from '../Config';
import { MyAjax } from '../MyAjax';
import { ValidateForm, showErrorsForInput, setUnTouched } from '../ValidateForm';
import { validate } from 'validate.js';
import { Link } from 'react-router-dom';
import "./QuickRegistration.css";
import  Select  from 'react-select';



class QuickRegistration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            OrganizationMasterDataAvailable: false, OrganizationCategories: [], PartnerType: false,
            Countries: [], States: [], Cities: [], City_Id: null, OrganizationCategory_Id: null,
            checked: false, CountryCodes: [], countryCode: { label: 91, value: "India" }, IsDataAvailable: false
        };
    }

    componentWillMount() {
        $.ajax(
            {
                url: ApiUrl + "/api/MasterData/GetCountriesAndTelephoneCodes",
                success: (data) => { this.setState({ CountryCodes: data["countryCodes"] }) },
                error: (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                }),
                type: "GET"
            });
    }

    componentDidMount() {
        setUnTouched(document);
        this.refs.firstName.focus();
    }

    render() {
        return (
            <div className="col-xs-12 m0 flex">
                <div className="col-xs-12 col-sm-6 hidden-xs">
                    <img src="Images/loginbanner.png" alt="" className="col-xs-12 col-md-8 col-md-offset-2 img-responsive" />
                </div>
                <div className="col-xs-12 col-sm-6">
                    <div className="col-xs-12 registration-form">
                        <div className=" text-center formBlock">
                            <div className="borderBottom regHeading">
                                <h3 className="login-panel">Sign Up</h3>
                            </div>

                            <form className="regForm" name="regForm" ref="regFom" onChange={this.validateForm.bind(this)} onSubmit={this._handleSubmit.bind(this)} >

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 form-group">
                                    <div className="switch-container">
                                        <label className={"switch-label " + (this.state.PartnerType ? '' : 'checked')}>Individual</label>
                                        <label className="switch">
                                            <input name="partnerType" type="checkbox" onChange={this.switchChanged.bind(this)} />
                                            <div className="slider round">
                                            </div>
                                        </label>
                                        <label className={"switch-label " + (this.state.PartnerType ? 'checked' : '')}>Organization</label>
                                    </div>
                                </div>

                                <div className={"col-xs-12 col-sm-10 col-sm-offset-1 form-group " + (this.state.PartnerType ? 'hidden' : 'visible')}>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="First Name" name="firstName" ref="firstName" autoComplete="off" />
                                    </div>
                                </div>

                                <div className={"col-xs-12 col-sm-10 col-sm-offset-1 form-group " + (this.state.PartnerType ? 'hidden' : 'visible')}>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Last Name" name="lastName" autoComplete="off" />
                                    </div>
                                </div>

                                <div className={"col-xs-12 col-sm-10 col-sm-offset-1 form-group " + (this.state.PartnerType ? 'visible' : 'hidden')}>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Organization Name" name="organizationName" autoComplete="off" />
                                    </div>
                                </div>

                                <div className={"col-xs-12 col-sm-10 col-sm-offset-1 form-group " + (this.state.PartnerType ? 'visible' : 'hidden')}>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-university" aria-hidden="true"></i>
                                        </span>
                                        <Select className="organizationType form-control" name="organizationType" options={this.state.OrganizationCategories} placeholder="Organization Type" onChange={this.organizationCategorySelected.bind(this)} ref="organizationType" value={this.state.organizationType} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-envelope" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Email" name="email" autoComplete="off"
                                            onBlur={this.checkIfEmailExists.bind(this)} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="password" placeholder="Password" name="password" autoComplete="off" />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-unlock-alt" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="password" placeholder="Confirm Password" name="confirmPassword" autoComplete="off" />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-phone" aria-hidden="true"></i>
                                        </span>
                                        <Select className="countryCode form-control" clearble={false} id="country-code" name="countryCode" options={this.state.CountryCodes} placeholder="Code" onChange={this.countryCodeChanged.bind(this)} ref="countryCode" value={this.state.countryCode}
                                            optionRenderer={(option) => {
                                                return <span className="Select-menu-option">{option.value + " (" + option.label + ")"}</span>;
                                            }}
                                        />
                                        <input className="form-control" type="text" id="phone-number" placeholder="Phone Number" name="phoneNumber" autoComplete="off" />
                                    </div>
                                </div>

                                {/*<div className={"col-xs-12 col-sm-10 col-sm-offset-1 form-group " + (this.state.PartnerType ? 'visible' : 'hidden')}>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Address" name="address" autoComplete="off" />
                                    </div>
                                </div>

                                <div className={"col-xs-12 col-sm-10 col-sm-offset-1 form-group " + (this.state.PartnerType ? 'visible' : 'hidden')}>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        </span>
                                        <Select className="country form-control" name="country" options={this.state.Countries} placeholder="Country" onChange={this.countrySelected.bind(this)} ref="country" value={this.state.country} />
                                    </div>
                                </div>

                                <div className={"col-xs-12 col-sm-10 col-sm-offset-1 form-group " + (this.state.PartnerType ? 'visible' : 'hidden')}>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        </span>
                                        <Select className="state form-control" name="state" options={this.state.States} placeholder="State" onChange={this.stateSelected.bind(this)} ref="state" value={this.state.state} />
                                    </div>
                                </div>

                                <div className={"col-xs-12 col-sm-10 col-sm-offset-1 form-group " + (this.state.PartnerType ? 'visible' : 'hidden')}>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        </span>
                                        <Select className="city form-control" name="city" options={this.state.Cities} placeholder="City" onChange={this.citySelected.bind(this)} ref="city" value={this.state.city} />
                                    </div>
                                </div>

                                <div className={"col-xs-12 col-sm-10 col-sm-offset-1 form-group " + (this.state.PartnerType ? 'visible' : 'hidden')}>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="PIN/ZIP" name="pin" autoComplete="off" />
                                    </div>
                                </div>*/}

                                <div className="clearfix"></div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center form-group">
                                    <button type="submit" name="submit" className="btn btn-primary">Sign Up</button>
                                    <div className="loader"></div>
                                </div>
                            </form>

                        </div>
                        <div className="clearfix"></div>
                        <div className="text-center row m10">
                            <Link to="/login" className="myLink"><u>Login</u></Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    countryCodeChanged(val) {
        if (val) {
            this.setState({ countryCode: val });
        }
        else {
            this.setState({ countryCode: { label: 91, value: "India" } })
        }
    }

    switchChanged(e) {
        this.setState({ PartnerType: e.target.checked });
        this.getDataForOrganization();
        $(".regForm").find("input").val("");
        this.setState({ organizationType: null });
        // this.countrySelected(null);
        setUnTouched(document);
    }

    organizationCategorySelected(val) {
        this.setState({ organizationType: val }, () => {
            if (this.state.organizationType && this.state.organizationType.value) {

                if (!this.state.organizationType.value) {
                    showErrorsForInput(this.refs.organizationType.wrapper, ["Please select a valid organization type"]);
                }
                else {
                    showErrorsForInput(this.refs.organizationType.wrapper, null);
                }
            }
            else {
                showErrorsForInput(this.refs.organizationType.wrapper, ["Please select a valid organization type"]);
            }
        });
    }

    getDataForOrganization() {
        if (this.state.OrganizationMasterDataAvailable) {
            return;
        }
        var url = ApiUrl + "/api/MasterData";

        MyAjax(
            url + "/GetOrganizationSubCategories",
            (data) => { this.setState({ OrganizationCategories: data["organizationSubCategories"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
        this.setState({ OrganizationMasterDataAvailable: true });
    }

    checkIfEmailExists(e) {
        e.persist();
        var input = e.target;
        var email = input.value;
        if (validate.single(email, { presence: true, email: true }) === undefined) {
            var url = ApiUrl + "api/Partner/CheckIfEmailExists?Email=" + email;
            $.get(url).then((data) => {
                if (data["result"] === true) {
                    $("button[name='submit']").attr("disabled", "true");
                    showErrorsForInput(input, ["Email already exists! Click <a href='/login' style='color: #6495ed;'>here</a> to login"]);
                }
                else {
                    $("button[name='submit']").removeAttr("disabled");
                    showErrorsForInput(input, null); //to remove any previous error
                }
            });
        }

    }

    _handleSubmit(e) {

        e.preventDefault();
        toast.dismiss();
        $(".loader").css("display", "inline-block");
        $("button[name='submit']").hide();

        if (!this.validateForm(e)) {
            $(".loader").hide();
            $("button[name='submit']").show();
            return;
        }

        //get only visible fields value
        var inputs = $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
            if (el.closest(".form-group").classList.contains("hidden")) {
                return null;
            }
            else {
                return el;
            }
        });

        var data = {};
        //create object with {inputName : inputValue}
        inputs.map((i, e) => {
            data[e.name] = e.value;
            return null;
        });

        data["phoneNumber"] = this.state.countryCode.label +"-"+data["phoneNumber"].replace(/\ /g,'').replace(/\-/g,'').trim();

        if (this.state.PartnerType) {
            data["PartnerSubCategory_Id"] = this.state.organizationType.value;
        }

        var url = ApiUrl + "/api/Partner/AddPartner";
        $.post(url, data).then(
            (result) => {
                toast("Please verify your registered email by clicking on the link sent to you!", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/login");
            },
            (error) => {
                this.setState({ error: error.responseText.replace(/\[|"|\]/g, '') });
                $(".loader").hide();
                $("button[name='submit']").show();
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
            }
        );
    }

    validateForm(e) {

        var success = ValidateForm(e);

        if (this.state.PartnerType) {


            // if (!this.state.country || !this.state.country.value) {
            //     success = false;
            //     showErrorsForInput(this.refs.country.wrapper, ["Please select a valid country"]);
            // }

            // if (!this.state.state || !this.state.state.value) {
            //     success = false;
            //     showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
            // }

            // if (!this.state.city || !this.state.city.value) {
            //     success = false;
            //     showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            // }

            if (!this.state.organizationType || !this.state.organizationType.value) {
                success = false;
                showErrorsForInput(this.refs.organizationType.wrapper, ["Please select a valid organization category"]);
            }
        }
        return success;
    }
}





export default QuickRegistration;

