import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { toast } from 'react-toastify';
import { ValidateForm, showErrorsForInput, setUnTouched } from '../../ValidateForm';
import { ApiUrl } from '../../Config'
import { MyAjax } from '../../MyAjax'
import './OfficialContact.css'


class NewOfficialContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            OfficialContact: null, Designation: null, EndDate: ""
        };
    }

    componentWillMount() {
        MyAjax(
            ApiUrl + "/api/Admin/GetOfficialContact?Id=" + this.props.officialContactId,
            (data) => {
                data["officialContact"]["StartDate"] = data["officialContact"]["StartDate"] !== null ? data["officialContact"]["StartDate"].split('T')[0] : "";
                data["officialContact"]["EndDate"] = data["officialContact"]["EndDate"] !== null ? data["officialContact"]["EndDate"].split('T')[0] : "";
                this.setState({ OfficialContact: data["officialContact"], Designation: { label: data["officialContact"]["Designation"] } });
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET", null
        );
    }

    componentDidMount() {
        setUnTouched(document);
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }
    
    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    render() {
        if (this.state.OfficialContact !== null) {
            return (
                <div className="container">
                    <form name="officialContactForm" ref="officialContactForm" onChange={this.validateForm.bind(this)} onSubmit={this.handleOfficialContactFormSubmit.bind(this)} >
                        <div className="col-sm-12">
                            <div className="col-sm-6">
                                <label htmlFor="name">Name</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Name" name="firstName" autoComplete="off" disabled={true} defaultValue={this.state.OfficialContact["FirstName"]} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3 ">
                                <label htmlFor="designation">Designation</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-briefcase " aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Designation" name="designation" autoComplete="off" disabled={true} defaultValue={this.state.OfficialContact["Designation"]} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-phone" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Phone Number" name="phoneNumber" autoComplete="off" defaultValue={this.state.OfficialContact["PhoneNumber"]} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <label htmlFor="secondaryPhoneNumber">Secondary Phone Number</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-phone" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Secondary Phone Number" name="secondaryPhoneNumber" autoComplete="off" defaultValue={this.state.OfficialContact["SecondaryPhoneNumber"]} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <label htmlFor="endDate">Address</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" type="text" placeholder="Address" name="address" autoComplete="off" defaultValue={this.state.OfficialContact["Address"]} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <label htmlFor="startDate">Start Date</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-calendar " aria-hidden="true"></i>
                                        </span>
                                        <input className="date form-control" type="text" placeholder="Start Date" name="startDate" autoComplete="off" disabled={true} defaultValue={this.state.OfficialContact["StartDate"]} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-3">
                                <label htmlFor="endDate">End Date</label>
                                <div className="form-group">
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-calendar " aria-hidden="true"></i>
                                        </span>
                                        <input type="text" className="date form-control" name="endDate" ref="endDate" placeholder="End Date" defaultValue={this.state.OfficialContact["EndDate"]} />
                                    </div>
                                </div>
                            </div>

                            {(function () {
                                var element = [];
                                if (this.state.Designation && (this.state.Designation.label === "Sarpanch" || this.state.Designation.label === "MPDO" || this.state.Designation.label === "MO" || this.state.Designation.label === "CPO")) {
                                    element.push(<div className="col-sm-3" key="distict">
                                        <label htmlFor="endDate">District</label>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" type="text" placeholder="District" name="district" autoComplete="off" disabled={true} defaultValue={this.state.OfficialContact["District"]} />
                                            </div>
                                        </div>
                                    </div>);
                                    if (this.state.Designation && (this.state.Designation.label === "MPDO" || this.state.Designation.label === "MO" || this.state.Designation.label === "Sarpanch")) {
                                        element.push(<div className="col-sm-3" key="mandalMunicipality">
                                            <label htmlFor="mandalMunicipality">{this.state.Designation.label === "MO" ? "Municipality" : "Mandal"}</label>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                    </span>
                                                    <input className="form-control" type="text" placeholder="Mandal/Municipality" name="mandalMunicipality" autoComplete="off" disabled={true} defaultValue={this.state.OfficialContact["MandalMunicipality"]} />
                                                </div>
                                            </div>
                                        </div>);
                                    }
                                    if (this.state.Designation && this.state.Designation.label === "Sarpanch") {
                                        element.push(<div className="col-sm-3" key="panchayatWard">
                                            <label htmlFor="endDate">Panchayat/Ward</label>
                                            <div className="form-group">
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                    </span>
                                                    <input className="form-control" type="text" placeholder="Panchayat/Ward" name="panchayatWard" autoComplete="off" disabled={true} defaultValue={this.state.OfficialContact["PanchayatWard"]} />
                                                </div>
                                            </div>
                                        </div>);
                                    }
                                }

                                if (this.state.Designation && this.state.Designation.label === "MLA") {

                                    element.push(<div className="col-sm-3" key="assemblyConstituency">
                                        <label htmlFor="endDate">Assembly Constituency</label>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" type="text" placeholder="Assembly Constituency" name="assemblyConstituency" autoComplete="off" disabled={true} defaultValue={this.state.OfficialContact["AssemblyConstituency"]} />
                                            </div>
                                        </div>
                                    </div>);
                                }

                                return element;

                            }.bind(this))()}

                            <div className="col-sm-6 col-md-12 text-center">
                                <button type="submit" name="submitOfficialContact" className="btn btn-primary">Submit</button>
                                <div className="loader loaderOfficialContact"></div>
                            </div>
                        </div>
                    </form>
                </div>

            );
        }
        else {
            return (<div className="loader"></div>)
        }
    }

    validateForm(e) {
        return ValidateForm(e);
    }

    handleOfficialContactFormSubmit(e) {
        try {
            $(".loaderOfficialContact").css("display", "inline-block");
            $("button[name='submitOfficialContact']").hide();

            e.preventDefault();
            toast.dismiss();

            if (!this.validateForm(e)) {
                $(".loaderOfficialContact").hide();
                $("button[name='submitOfficialContact']").show();
                return;
            }
            var startDate = $("input[name=startDate]").val();
            var endDate = $("input[name=endDate]").val();
            if (startDate > endDate && endDate !== "") {
                showErrorsForInput(this.refs.endDate, ["Please select a valid date"]);
                $(".loaderOfficialContact").hide();
                $("button[name='submitOfficialContact']").show();
                return;
            }

            //get only visible fields value
            var inputs = $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                if (el.closest(".form-group").classList.contains("hidden") || el.getAttribute("disabled") !== null) {
                    return null;
                }
                else {
                    return el;
                }
            });

            var data = {};
            //create object with {inputName : inputValue}
            inputs.map((i, el) => {
                data[el.name] = el.value;
                return null;
            });

            data["Id"] = this.props.officialContactId;

            var url = ApiUrl + "/api/Admin/EditOfficialContact";
            MyAjax(url,
                (result) => {
                    toast("official details updated sucessfully!", {
                        type: toast.TYPE.SUCCESS
                    }); this.props.toggleEditMode();
                },
                (error) => {
                    $(".loaderOfficialContact").hide();
                    $("button[name='submitOfficialContact']").show();
                    this.setState({ error: error.responseText.replace(/\[|"|\]/g, '') });
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    });
                }, "POST", data)

        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
        }

    }

}



export default NewOfficialContact;

