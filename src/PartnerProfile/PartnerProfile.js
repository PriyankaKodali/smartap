import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { toast } from 'react-toastify';
import { MyAjaxForAttachments, MyAjax } from '../MyAjax';
import { ApiUrl } from '../Config'
import { showErrorsForInput, setUnTouched, ValidateForm } from '../ValidateForm';
import { validate } from 'validate.js'
import './PartnerProfile.css'
import  Select  from 'react-select';
var moment = require('moment');

class PartnerProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "", Partner: {}, Countries: [], Country: null, States: [], State: null, Cities: [], IsOrg: false,
            City: null, Categories: [], Category: null, SubCategories: [], SubCategory: null, IsDataAvailable: false,
            LocalCountry: null, LocalStates: [], LocalState: null, LocalCities: [], LocalCity: null, IsNri: false,
            CountryCodes: [], CountryCode: null, PreviousPhone: null, CompletePhoneNumber: null
        };
    }

    componentWillMount() {
        var url = ApiUrl + "/api/Partner/GetPartner?PartnerId=";
        MyAjax(
            url,
            (data) => {
                this.setState({
                    Partner: data["partner"], IsDataAvailable: true
                }, () => {
                    this.createObjectsForSelect();
                    setUnTouched(document);/*because form loads after fetching data*/
                });
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );
        MyAjax(
            ApiUrl + "/api/MasterData/GetCountries",
            (data) => { this.setState({ Countries: data["countries"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        );
        $.ajax({
            url: ApiUrl + "/api/MasterData/GetCountriesAndTelephoneCodes",
            success: (data) => { this.setState({ CountryCodes: data["countryCodes"] }) },
            error: (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            type: "GET"
        });
        MyAjax(
            ApiUrl + "/api/MasterData/GetCategoriesForIndividual",
            (data) => { this.setState({ Categories: data["categories"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )

    }

    createObjectsForSelect() {
        if (this.state.Partner["Country_Id"]) {
            this.countrySelected({ value: this.state.Partner["Country_Id"], label: this.state.Partner["Country"] });
            this.stateSelected({ value: this.state.Partner["State_Id"], label: this.state.Partner["State"] });
            this.citySelected({ value: this.state.Partner["City_Id"], label: this.state.Partner["City"] });
        }
        if (this.state.Partner["PartnerCategory_Id"]) {
            this.categorySelected({ value: this.state.Partner["PartnerCategory_Id"], label: this.state.Partner["PartnerCategory"] });
            this.subCategorySelected({ value: this.state.Partner["PartnerSubCategory_Id"], label: this.state.Partner["PartnerSubCategory"] });
            if (this.state.Partner["PartnerCategory_Id"] === 5) {
                this.setState({ IsNri: true });
                this.localCountrySelected({ value: this.state.Partner["LocalAddressCountry_Id"], label: this.state.Partner["LocalAddressCountry"] });
                this.localStateSelected({ value: this.state.Partner["LocalAddressState_Id"], label: this.state.Partner["LocalAddressState"] });
                this.localCitySelected({ value: this.state.Partner["LocalAddressCity_Id"], label: this.state.Partner["LocalAddressCity"] });
            }
            if (this.state.Partner["PartnerCategory_Id"] === 3) {
                this.setState({ IsOrg: true });
            }
        }
        var phone = this.state.Partner["PhoneNumber"].split('-');
        if (phone.length > 1) {
            var partner = this.state.Partner;
            var previousPhone = partner["PhoneNumber"];
            var countryCode = { label: phone[0], value: "" };
            partner["PhoneNumber"] = phone[1];
            this.setState({ CountryCode: countryCode, Partner: partner, PreviousPhone: previousPhone });
        }
        setUnTouched(document);
    }

    componentDidMount() {
        setUnTouched(document);
        $('[data-toggle="popover"]').popover();
        $('.date').datepicker({dateFormat: 'dd-mm-yy'});
    }

    componentDidUpdate() {
        $('[data-toggle="popover"]').popover();
        $('.date').datepicker({dateFormat: 'dd-mm-yy'});
    }

    componentWillUnmount(){
        $(".modal").modal("hide");
    }

    previousExperienceChange() {
        var remaining = this.refs.previousExperience.maxLength - this.refs.previousExperience.value.length;
        this.refs.previousExperienceCount.innerHTML = remaining;
    }

    render() {
        if (this.state.IsDataAvailable) {
            return (
                <div className="container profile-container">
                    <h1>Profile</h1>
                    <form id="partnerForm" onSubmit={this._handleSubmit.bind(this)} onChange={this.validate.bind(this)} key={this.state.Partner}>

                        {
                            this.state.IsOrg ?
                                <div>
                                    <div className="col-md-6">
                                        <label>Organization Name</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" name="firstName" ref="firstName" placeholder="First Name" autoComplete="off" defaultValue={this.state.Partner["FirstName"]} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3" key={this.state.Partner["DOB"]}>
                                        <label>Date of Estabilshment</label>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user" aria-hidden="true"></i>
                                                </span>
                                                <input className="date form-control" type="text" name="DOB" ref="dob" placeholder="Date of Estb." autoComplete="off" defaultValue={moment(this.state.Partner["DOB"]).format("DD-MM-YYYY")} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : <div>
                                    <div className="col-md-3">
                                        <label>First Name</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" name="firstName" ref="firstName" placeholder="First Name" autoComplete="off" defaultValue={this.state.Partner["FirstName"]} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <label>Last Name</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" name="lastName" ref="lastName" placeholder="Last Name" autoComplete="off" defaultValue={this.state.Partner["LastName"]} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <label>Gender</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <div className="radio-inline" ref="gender">
                                                    <label><input type="radio" name="gender" className="" value="Male" defaultChecked={this.state.Partner["Gender"] === "Male"} />Male</label>
                                                </div>
                                                <div className="radio-inline">
                                                    <label><input type="radio" name="gender" className="" value="Female" defaultChecked={this.state.Partner["Gender"] === "Female"} />Female</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <label>Date of Birth</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user" aria-hidden="true"></i>
                                                </span>
                                                <input className="date form-control" type="text" name="DOB" ref="dob" placeholder="Date of Birth" autoComplete="off" defaultValue={moment(this.state.Partner["DOB"]).format("DD-MM-YYYY")} />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                        }
                        <div className="col-md-3">
                            <label>Category</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-users" aria-hidden="true"></i>
                                    </span>
                                    <Select className="category form-control" name="category" options={this.state.Categories} placeholder="Category" onChange={this.categorySelected.bind(this)} ref="category" value={this.state.Category} disabled={this.state.IsOrg} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label>Sub Category</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </span>
                                    <Select className="subCategory form-control" name="subCategory" options={this.state.SubCategories} placeholder="Sub Category" onChange={this.subCategorySelected.bind(this)} ref="subCategory" value={this.state.SubCategory} />
                                </div>
                            </div>
                        </div>


                        <div className="col-md-3">
                            <label>Financial Contribution Capability</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-money" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="number" placeholder="Financial Contribution" ref="financialContribution" name="financialContribution" autoComplete="off" defaultValue={this.state.Partner["FinancialContribution"]} min={0} />
                                </div>
                            </div>
                        </div>


                        <div className="col-md-3">
                            <label>PAN</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-info" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="text" placeholder="PAN" ref="pan" name="pan" autoComplete="off" defaultValue={this.state.Partner["Pan"]} onBlur={this.checkIfPanExists.bind(this)} />
                                </div>
                            </div>
                        </div>
                        {!this.state.IsOrg ?
                            <div className="col-md-3">
                                <label>Aadhar</label>
                                <div className="form-group" >
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-info" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Aadhar" ref="aadhar" name="aadhar" autoComplete="off" defaultValue={this.state.Partner["Aadhar"]} onBlur={this.checkIfAadharExists.bind(this)} />
                                    </div>
                                </div>
                            </div> : <div />
                        }

                        <div className="col-xs-12">
                            <label><h4>Communication Details</h4></label>
                            <div className="communication-block">


                                <div className="col-md-4" key={this.state.Partner["PhoneNumber"]}>
                                    <label>Phone Number</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-phone" aria-hidden="true"></i>
                                            </span>
                                            <Select className="countryCode form-control" clearble={false} id="country-code" name="countryCode" options={this.state.CountryCodes} placeholder="Code" onChange={this.countryCodeChanged.bind(this)} ref="countryCode" value={this.state.CountryCode}
                                                optionRenderer={(option) => {
                                                    return <span className="Select-menu-option">{option.value + " (" + option.label + ")"}</span>;
                                                }}
                                            />
                                            <input className="form-control" type="text" id="phone-number" placeholder="Phone Number" name="phoneNumber" ref="phoneNumber" autoComplete="off" defaultValue={this.state.Partner["PhoneNumber"]} />
                                        </div>
                                    </div>
                                </div>

                                {/* <div className="col-md-4">
                                    <label>Phone Number</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-phone" aria-hidden="true"></i>
                                            </span>
                                            <input className="form-control" type="text" placeholder="Phone Number" ref="phoneNumber" name="phoneNumber" autoComplete="off" defaultValue={this.state.Partner["PhoneNumber"]} />
                                        </div>
                                    </div>
                                </div> */}

                                <div className="col-md-4">
                                    <label>Secondary Phone</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-phone" aria-hidden="true"></i>
                                            </span>
                                            <input className="form-control" type="text" placeholder="Secondary Phone" ref="secondaryPhoneNumber" name="secondaryPhoneNumber" autoComplete="off" defaultValue={this.state.Partner["SecondaryPhoneNumber"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>Email</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-envelope" aria-hidden="true"></i>
                                            </span>
                                            <input className="form-control" type="text" placeholder="Email" name="email" autoComplete="off" defaultValue={this.state.Partner["Email"]} disabled />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <label>Address</label>
                                    <div className="form-group form-group-textarea" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <textarea className="form-control" placeholder="Address" name="address" ref="address" autoComplete="off" defaultValue={this.state.Partner["Address"]}></textarea>
                                            {/* <input className="form-control" type="text" placeholder="Address" name="address" ref="address" autoComplete="off" defaultValue={this.state.Partner["Address"]} /> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>Country</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <Select className="country form-control" name="country" options={this.state.Countries} placeholder="Country" onChange={this.countrySelected.bind(this)} ref="country" value={this.state.Country} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>State</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <Select className="state form-control" name="state" options={this.state.States} placeholder="State" onChange={this.stateSelected.bind(this)} ref="state" value={this.state.State} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>City</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <Select className="city form-control" name="city" options={this.state.Cities} placeholder="City" onChange={this.citySelected.bind(this)} ref="city" value={this.state.City} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>PIN/ZIP</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <input className="form-control" type="text" placeholder="PIN/ZIP" name="pin" ref="pin" autoComplete="off" defaultValue={this.state.Partner["PIN"]} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            this.state.IsNri ?
                                <div className="col-xs-12">
                                    <label><h4>Origin Details</h4></label>
                                    <div className="communication-block">   {/*only for nris*/}
                                        <div className="col-md-12">
                                            <label>Address</label>
                                            <div className="form-group form-group-textarea" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                    </span>
                                                    <textarea className="form-control" placeholder="Address" name="localAddress" ref="localAddress" autoComplete="off" defaultValue={this.state.Partner["LocalAddress"]}></textarea>
                                                    {/* <input className="form-control" type="text" placeholder="Address" name="localAddress" ref="localAddress" autoComplete="off" defaultValue={this.state.Partner["LocalAddress"]} /> */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label>Country</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="country form-control" name="localCountry" options={this.state.Countries} placeholder="Country" onChange={this.localCountrySelected.bind(this)} ref="localCountry" value={this.state.LocalCountry} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label>State</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="state form-control" name="localState" options={this.state.LocalStates} placeholder="State" onChange={this.localStateSelected.bind(this)} ref="localState" value={this.state.LocalState} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label>City</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="city form-control" name="localCity" options={this.state.LocalCities} placeholder="City" onChange={this.localCitySelected.bind(this)} ref="localCity" value={this.state.LocalCity} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                <div />
                        }

                        <div className="col-xs-12">
                            <label><h4>Partner Interests</h4></label>
                            <div className="partner-interests-container">
                                {
                                    this.state.Partner["PartnerInterests"].map((ele, i) => {
                                        return <div className="col-md-3" key={ele["Name"]}>
                                            <div className="checkbox-inline">
                                                <label><input type="checkbox" name={ele["Name"]} defaultChecked={ele["Checked"]} />{ele["Name"]}</label>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        {
                            this.state.IsOrg ?
                                <div>
                                    <div className={"col-md-6 " + (this.state.Partner["AnnualReportsAttachmentURL"] ? "hidden" : "")}>
                                        <label>Annual Reports (Last 3 yrs)</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                </span>
                                                <input type="file" className="form-control" name="annualReports" ref="annualReports" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"col-md-6 " + (this.state.Partner["PreviousProjectsAttachmentURL"] ? "hidden" : "")}>
                                        <label>Previous Projects</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                </span>
                                                <input type="file" className="form-control" name="previousProjects" ref="previousProjects" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="col-xs-12">
                                    <label>Previous Experience
                              <a data-toggle="popover" data-trigger="hover" className="mleft5"
                                            data-content="Previous experience in relevant community work/management activities">
                                            <span className="fa fa-info-circle pointer" ></span>
                                        </a>
                                    </label>
                                    <div className="form-group form-group-textarea" >
                                        <textarea className="form-control" maxLength="1500" rows={5} ref="previousExperience" onChange={this.previousExperienceChange.bind(this)} defaultValue={this.state.Partner["PreviousExperience"]}></textarea>
                                        <div><span>Remaining Characters :</span><span ref="previousExperienceCount">1500</span></div>
                                    </div>
                                </div>

                        }

                        <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center form-group mtop24">
                            <button type="submit" name="submit" className="btn btn-primary">Submit</button>
                            <div className="loader"></div>
                        </div>

                    </form>

                    <div id="verifyPhoneModal" className="modal fade" role="dialog">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title">Verify Phone Number</h4>
                                </div>
                                <div className="modal-body">
                                    <h3 className="text-center"> Please enter the OTP sent to your registered mobile ({this.state.CompletePhoneNumber})  </h3>
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
                                        <button type="submit" name="submitVerify" className="btn btn-primary" onClick={this._handleVerifySubmit.bind(this)}>Verify</button>
                                        <div className="loader verifyLoader"></div>
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </div>
            );

        }
        else {
            return (
                <div className="loader visible"></div>
            )
        }
    }

    countryCodeChanged(val) {
        if (val) {
            this.setState({ CountryCode: val });
        }
        else {
            this.setState({ CountryCode: { label: 91, value: "India" } })
        }
    }

    countrySelected(val) {
        this.setState({ Country: val }, () => {
            if (this.state.Country && this.state.Country.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetStates?CountryId=" + this.state.Country.value,
                    (data) => { this.setState({ States: data["states"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                showErrorsForInput(this.refs.country.wrapper, null);
            }
            else {
                this.setState({ States: [], State: null });
                this.setState({ Cities: [], City: null });
                showErrorsForInput(this.refs.country.wrapper, ["Please select a valid country"]);
                showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            }
        });

    }

    stateSelected(val) {
        this.setState({ State: val }, () => {

            if (this.state.State && this.state.State.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetCities?StateId=" + this.state.State.value,
                    (data) => { this.setState({ Cities: data["cities"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )

                showErrorsForInput(this.refs.state.wrapper, null);
            }
            else {
                this.setState({ Cities: [], City: null });
                showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            }
        });
    }

    citySelected(val) {
        this.setState({ City: val }, () => {
            if (this.state.City && this.state.City.value) {
                showErrorsForInput(this.refs.city.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            }
        });
    }

    localCountrySelected(val) {
        this.setState({ LocalCountry: val }, () => {
            if (this.state.LocalCountry && this.state.LocalCountry.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetStates?CountryId=" + this.state.LocalCountry.value,
                    (data) => { this.setState({ LocalStates: data["states"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                showErrorsForInput(this.refs.localCountry.wrapper, null);
            }
            else {
                this.setState({ LocalStates: [], LocalState: null });
                this.setState({ LocalCities: [], LocalCity: null });
                showErrorsForInput(this.refs.localCountry.wrapper, ["Please select a valid country"]);
                showErrorsForInput(this.refs.localState.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.localCity.wrapper, ["Please select a valid city"]);
            }
        });

    }

    localStateSelected(val) {
        this.setState({ LocalState: val }, () => {

            if (this.state.LocalState && this.state.LocalState.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetCities?StateId=" + this.state.LocalState.value,
                    (data) => { this.setState({ LocalCities: data["cities"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )

                showErrorsForInput(this.refs.localState.wrapper, null);
            }
            else {
                this.setState({ LocalCities: [], LocalCity: null });
                showErrorsForInput(this.refs.localState.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.localCity.wrapper, ["Please select a valid city"]);
            }
        });
    }

    localCitySelected(val) {
        this.setState({ LocalCity: val }, () => {
            if (this.state.LocalCity && this.state.LocalCity.value) {
                showErrorsForInput(this.refs.localCity.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.localCity.wrapper, ["Please select a valid city"]);
            }
        });
    }

    categorySelected(val) {
        this.setState({ Category: val, SubCategory: null }, () => {
            if (this.state.Category && this.state.Category.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetSubCategories?CategoryId=" + this.state.Category.value,
                    (data) => { this.setState({ SubCategories: data["subCategories"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                if (val.value === 5) {
                    this.setState({ IsNri: true });
                }
                else {
                    this.setState({ IsNri: false });
                }
                showErrorsForInput(this.refs.category.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.category.wrapper, ["Please select a valid category"]);
            }
        });
    }

    subCategorySelected(val) {
        this.setState({ SubCategory: val }, () => {
            if (this.state.SubCategory && this.state.SubCategory.value) {
                showErrorsForInput(this.refs.subCategory.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.subCategory.wrapper, ["Please select a valid subcategory"]);
            }
        });

    }

    _handleSubmit(e) {
        e.preventDefault();
        toast.dismiss();

        if (!this.validate(e)) {
            return;
        }

        var partnerInterests = []
        $(".partner-interests-container").find("input").map((i, ele) => {
            if (ele.checked) {
                partnerInterests.push(ele.name);
            }
            return null;
        });
        var phonenumber = this.state.CountryCode.label + "-" + this.refs.phoneNumber.value.replace(/\ /g, '').replace(/\-/g, '').trim();
        if (this.state.PreviousPhone !== phonenumber) {
            if (!window.confirm("Do you wish to update your phone number?")) {
                var phone = this.state.PreviousPhone.split('-');
                if (phone.length > 1) {
                    var partner = this.state.Partner;
                    var countryCode = { label: phone[0], value: "" };
                    partner["PhoneNumber"] = phone[1];
                    this.setState({ CountryCode: countryCode, Partner: partner });
                    this.refs.phoneNumber.value = phone[1];
                    return;
                }
            }
            else {
                this.setState({ CompletePhoneNumber: phonenumber }, () => {
                    this.verifyPhone();
                })
                return;
            }
        }


        var data = new FormData();
        data.append("id", this.state.Partner["Id"]);
        data.append("firstName", this.refs.firstName.value.trim());

        if (this.state.IsOrg) {
            data.append("lastName", "");
            data.append("gender", "");
        }
        else {
            data.append("lastName", this.refs.lastName.value.trim());
            data.append("gender", $("input[name='gender']:checked").val());
            data.append("aadhar", this.refs.aadhar.value.trim());
        }
        data.append("dob", this.refs.dob.value);
        data.append("PartnerSubCategory_Id", this.state.SubCategory.value);
        data.append("financialContribution", this.refs.financialContribution.value.trim());
        data.append("phoneNumber", phonenumber);
        data.append("secondaryPhoneNumber", this.refs.secondaryPhoneNumber.value);
        data.append("pan", this.refs.pan.value.trim());
        data.append("address", this.refs.address.value.trim());
        data.append("City_Id", this.state.City.value);
        data.append("pin", this.refs.pin.value.trim());
        data.append("CheckedPartnerInterests", JSON.stringify(partnerInterests));

        if (this.state.IsNri) {
            data.append("localAddress", this.refs.localAddress.value.trim());
            data.append("LocalAddressCity_Id", this.state.LocalCity.value);
        }

        if (this.state.IsOrg) {
            var annualReports = this.refs.annualReports.files;
            var previousProjects = this.refs.previousProjects.files;

            if (annualReports.length > 0) {
                if ($.inArray(annualReports[0].name.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png", "gif", "doc", "docx", "pdf", "txt", "xls", "xlsx"]) === -1) {
                    showErrorsForInput(this.refs.annualReports, ["Supported formats : jpg | jpeg | png | gif | doc | docx | pdf | txt | xls"]);
                    return;
                }
                else {
                    showErrorsForInput(this.refs.annualReports, null)
                    data.append("annualReports", annualReports[0]);
                }
            }

            if (previousProjects.length > 0) {
                if ($.inArray(previousProjects[0].name.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png", "gif", "doc", "docx", "pdf", "txt"]) === -1) {
                    showErrorsForInput(this.refs.previousProjects, ["Supported formats : jpg | jpeg | png | gif | doc | docx | pdf | txt"]);
                    return;
                }
                else {
                    showErrorsForInput(this.refs.previousProjects, null)
                    data.append("previousProjects", previousProjects[0]);
                }
            }
        }
        else {
            data.append("previousExperience", this.refs.previousExperience.value);
        }

        $(".loader").css("display", "inline-block");
        $("button[name='submit']").hide();

        var url = ApiUrl + "api/Partner/EditPartner";
        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Details updated succesfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    this.props.history.push("/partner-dashboard");
                    return true;
                },
                (error) => {
                    toast("An error occoured, please try again!", {
                        type: toast.TYPE.ERROR
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    return false;
                },
                "POST",
                data
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

    validate(e) {
        var success = ValidateForm(e);

        if(this.refs.dob.value.trim().length==0){
            success = false;
            showErrorsForInput(this.refs.dob, ["Please enter a valid date"]);
        }
        else{
            showErrorsForInput(this.refs.dob, []);
        }

        if (!this.state.IsOrg && e.type === "submit") {
            if (!$("input[name='gender']:checked").val()) {
                success = false;
                showErrorsForInput(this.refs.gender, ["Please choose a gender"]);
            }
        }

        if (!this.state.Category) {
            success = false;
            showErrorsForInput(this.refs.category.wrapper, ["Please select a valid category"]);
        }
        if (!this.state.SubCategory) {
            success = false;
            showErrorsForInput(this.refs.subCategory.wrapper, ["Please select a valid subcategory"]);
        }
        if (!this.state.CountryCode) {
            success = false;
            showErrorsForInput(this.refs.countryCode.wrapper, ["Please select a valid country code"]);
        }
        if (!this.state.Country) {
            success = false;
            showErrorsForInput(this.refs.country.wrapper, ["Please select a valid country"]);
        }
        if (!this.state.State) {
            success = false;
            showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
        }
        if (!this.state.City) {
            success = false;
            showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
        }
        if (this.state.Category && this.state.Category.value === 5) {
            if (!this.state.LocalCountry) {
                success = false;
                showErrorsForInput(this.refs.localCountry.wrapper, ["Please select a valid country"]);
            }
            if (!this.state.LocalState) {
                success = false;
                showErrorsForInput(this.refs.localState.wrapper, ["Please select a valid state"]);
            }
            if (!this.state.LocalCity) {
                success = false;
                showErrorsForInput(this.refs.localCity.wrapper, ["Please select a valid city"]);
            }
        }

        return success;
    }

    checkIfPanExists() {
        var pan = this.refs.pan.value.trim();
        var isValid = validate.single(pan, {
            presence: true,
            format: {
                pattern: "[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}"
            }
        }) === undefined;
        if (!isValid) {
            return;
        }
        else {
            var url = ApiUrl + "/api/Partner/CheckIfPanExists?PartnerId=" + this.state.Partner["Id"] + "&Pan=" + pan;
            $.get(url).then((data) => {
                if (data["result"] === true) {
                    showErrorsForInput(this.refs.pan, ["PAN already exists!"]);
                }
                else {
                    showErrorsForInput(this.refs.pan, null); //to remove any previous error
                }
            });
        }
    }

    checkIfAadharExists() {
        var aadhar = this.refs.aadhar.value.trim();
        var isValid = validate.single(aadhar, {
            presence: true,
            format: {
                pattern: "([0-9]{12})?"
            }
        }) === undefined;
        if (!isValid) {
            return;
        }
        else {
            var url = ApiUrl + "/api/Partner/CheckIfAadharExists?PartnerId=" + this.state.Partner["Id"] + "&Aadhar=" + aadhar;
            $.get(url).then((data) => {
                if (data["result"] === true) {
                    showErrorsForInput(this.refs.aadhar, ["Aadhar already exists!"]);
                }
                else {
                    showErrorsForInput(this.refs.aadhar, null); //to remove any previous error
                }
            });
        }
    }

    verifyPhone() {
        var url = ApiUrl + "/api/Sms/SendOtp?mobile=" + this.state.CompletePhoneNumber;
        $.get(url).then(
            (result) => {
                $('#verifyPhoneModal').modal({ backdrop: 'static', keyboard: false });
            },
            (error) => {
                toast("Error sending OTP to " + this.state.CompletePhoneNumber + ", please try again!", {
                    type: toast.TYPE.ERROR
                });
            }
        );
    }

    resendOtp(type) {
        var url = ApiUrl + "/api/Sms/ResendOtp?mobile=" + this.state.CompletePhoneNumber + "&type=" + type;
        $.get(url).then(
            (result) => {
                toast("OTP sent to " + this.state.CompletePhoneNumber, {
                    type: toast.TYPE.SUCCESS
                });
            },
            (error) => {
                $(".verifyLoader").hide();
                $("button[name='submitVerify']").show();
                toast("Error sending OTP, please try again!", {
                    type: toast.TYPE.ERROR
                });
            }
        );
    }

    _handleVerifySubmit() {
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
        $(".verifyLoader").show();
        $("button[name='submitVerify']").hide();
        var url = ApiUrl + "/api/Sms/VerifyOtp?mobile=" + this.state.CompletePhoneNumber + "&otp=" + otp;
        $.get(url).then(
            (result) => {
                $('#verifyPhoneModal').modal("hide");
                this.setState({ PreviousPhone: this.state.CompletePhoneNumber }, () => {
                    $("button[name='submit']").click();
                });

            },
            (error) => {
                $(".verifyLoader").hide();
                $("button[name='submitVerify']").show();
                toast("Invalid OTP", {
                    type: toast.TYPE.ERROR
                });
            }
        );
    }

}

export default PartnerProfile;