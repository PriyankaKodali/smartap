import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { toast } from 'react-toastify';
import { ValidateForm, showErrorsForInput, setUnTouched } from '../../ValidateForm';
import { ApiUrl } from '../../Config'
import { MyAjax } from '../../MyAjax'
import './OfficialContact.css'

var Select = require("react-select")


class NewOfficialContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Designations: [], Designation: null, Districts: [], District: null, MandalsMunicipalities: [], MandalMunicipality: null,
            PanchayatsWards: [], PanchayatWard: null, AssemblyConstituencies: [], AssemblyConstituency: null, StartDate: "",
            EndDate: "",
        };
    }

    componentWillMount() {
        MyAjax(
            ApiUrl + "/api/MasterData/GetOfficialDesignations",
            (data) => { this.setState({ Designations: data["designations"] }); },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
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
        return (
            <div className="container">
                <h2>New Official Contact</h2>
                <hr />
                <form name="officialContactForm" ref="officialContactForm" onChange={this.validateForm.bind(this)} onSubmit={this.handleOfficialContactFormSubmit.bind(this)} >
                    <div className="col-sm-12">
                        <div className="col-sm-6">
                            <label htmlFor="firstName">Name</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="text" placeholder="Name" name="firstName" autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="designation">Designation</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-briefcase" aria-hidden="true"></i>
                                    </span>
                                    <Select className="designation form-control" name="designation" options={this.state.Designations} placeholder="Designation" ref="designation" value={this.state.Designation} onChange={this.designationChanged.bind(this)} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <label htmlFor="phoneNumer">Primary Phone Number</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-phone" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="text" placeholder="Phone Number" name="phoneNumber" autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <label htmlFor="secondaryPhoneNumer">Secondary Phone Number</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-phone" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="text" placeholder="Secondary Phone Number" name="secondaryPhoneNumber" autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <label htmlFor="address">Address</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="text" placeholder="Address" name="address" autoComplete="off" />
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
                                    <input type="text" className="date form-control" name="startDate" ref="startDate" placeholder="Start Date" />
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
                                    <input type="text" className="date form-control" name="endDate" ref="endDate" placeholder="End Date" />
                                </div>
                            </div>
                        </div>

                        {(function () {
                            var element = [];
                            if (this.state.Designation && (this.state.Designation.label === "Sarpanch" || this.state.Designation.label === "MPDO" || this.state.Designation.label === "MO" || this.state.Designation.label === "CPO")) {
                                element.push(<div className="col-sm-3" key="distict">
                                    <div className="form-group">
                                        <label htmlFor="district">District</label>
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <Select className="district form-control un-touched" ref="district" name="district" options={this.state.Districts} placeholder="District" onChange={this.districtChange.bind(this)} value={this.state.District} />
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
                                                <Select className="mandalMunicipality form-control un-touched" ref="mandalMunicipality" name="mandalMunicipality" options={this.state.MandalsMunicipalities} placeholder="Mandal/Municipality" onChange={this.mandalMunicipalityChange.bind(this)} value={this.state.MandalMunicipality} />
                                            </div>
                                        </div>
                                    </div>);
                                }
                                if (this.state.Designation && this.state.Designation.label === "Sarpanch") {
                                    element.push(<div className="col-sm-3" key="panchayatWard">
                                        <label htmlFor="panchayatWard">Panchayat</label>
                                        <div className="form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                </span>
                                                <Select className="panchayatWard form-control un-touched" ref="panchayatWard" name="panchayatWard" options={this.state.PanchayatsWards} placeholder="Panchayat/Ward" onChange={this.panchayatWardChange.bind(this)} value={this.state.PanchayatWard} />
                                            </div>
                                        </div>
                                    </div>);
                                }
                            }

                            /*if (this.state.Designation && this.state.Designation.label === "MLA") {

                                element.push(<div className="col-sm-3" key="assemblyConstituency">
                                    <label htmlFor="assemblyConstituency">Assembly Constituency</label>
                                    <div className="form-group">
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <Select className="assemblyConstituency form-control un-touched" ref="assemblyConstituency" name="assemblyConstituency" options={this.state.AssemblyConstituencies} placeholder="Assembly Constituency" onChange={this.assemblyConstituencyChange.bind(this)} value={this.state.AssemblyConstituency} />
                                        </div>
                                    </div>
                                </div>);
                            }*/
                            setUnTouched(document);
                            return element;

                        }.bind(this))()}


                        <div className="col-sm-6 col-md-12 text-center">
                            <button type="submit" name="submitOfficialContact" className="btn btn-primary">Add</button>
                            <div className="loader loaderOfficialContact"></div>
                        </div>
                    </div>
                </form>
            </div>

        );
    }

    designationChanged(val) {
        this.setState({ Designation: val, District: null, MandalMunicipality: null, AssemblyConstituency: null },
            () => {
                if (val && (val.label === "CPO" || val.label === "MPDO" || val.label === "MO" || val.label === "Sarpanch") && this.state.Districts.length === 0) {
                    MyAjax(
                        ApiUrl + "/api/MasterData/GetDistricts",
                        (data) => { this.setState({ Districts: data["districts"] }); },
                        (error) => toast(error.responseText, {
                            type: toast.TYPE.ERROR
                        })
                    )
                }
                if (val && val.label === "MLA") {
                    MyAjax(
                        ApiUrl + "/api/MasterData/GetAssemblyConstituencies",
                        (data) => { this.setState({ AssemblyConstituencies: data["assemblyConstituencies"] }); },
                        (error) => toast(error.responseText, {
                            type: toast.TYPE.ERROR
                        })
                    )
                }
            });
        if (!val) {
            showErrorsForInput(this.refs.designation.wrapper, ["Please select a valid Designation"]);
        }
        else {
            showErrorsForInput(this.refs.designation.wrapper, null);
        }
    }

    districtChange(val) {
        this.setState({ District: val, MandalMunicipality: null }, () => {
            if (!val) {
                showErrorsForInput(this.refs.district.wrapper, ["Please select a valid District"]);
                return;
            }
            if (this.state.Designation.label === "Sarpanch" || this.state.Designation.label === "MPDO") {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetMandals?DistrictId=" + val.value,
                    (data) => { this.setState({ MandalsMunicipalities: data["mandalsMunicipalities"] }); },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
            }
            else if (this.state.Designation.label === "MO") {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetMunicipalities?DistrictId=" + val.value,
                    (data) => { this.setState({ MandalsMunicipalities: data["mandalsMunicipalities"] }); },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
            }
            showErrorsForInput(this.refs.district.wrapper, null);
        })
    }

    mandalMunicipalityChange(val) {
        this.setState({ MandalMunicipality: val }, () => {
            if (!val) {
                showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a valid mandal/municipality"]);
            }
            if (this.state.Designation.label === "Sarpanch") {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetPanchayatsWards?MandalMunicipalityId=" + this.state.MandalMunicipality.value + "&PartnerType=",
                    (data) => { this.setState({ PanchayatsWards: data["panchayatsWards"] }); },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
            }
            showErrorsForInput(this.refs.mandalMunicipality.wrapper, null);
        })
    }

    panchayatWardChange(val) {
        this.setState({ PanchayatWard: val })
        if (!val) {
            showErrorsForInput(this.refs.panchayatWard.wrapper, ["Please select a valid panchayat/ward"]);
        }
        else {
            showErrorsForInput(this.refs.panchayatWard.wrapper, null);
        }
    }

    validateForm(e) {
        var success = ValidateForm(e);

        if (!this.state.Designation || !this.state.Designation.value) {
            success = false;
            showErrorsForInput(this.refs.designation.wrapper, ["Please select a valid Designation"]);
        }


        if ((this.state.Designation && (this.state.Designation.label === "CPO" || this.state.Designation.label === "MPDO" || this.state.Designation.label === "MO" || this.state.Designation.label === "Sarpanch")) && (!this.state.District || !this.state.District.value)) {
            success = false;
            showErrorsForInput(this.refs.district.wrapper, ["Please select a valid District"]);
        }

        if ((this.state.Designation && (this.state.Designation.label === "MPDO" || this.state.Designation.label === "Sarpanch")) && (!this.state.MandalMunicipality || !this.state.MandalMunicipality.value)) {
            success = false;
            showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a valid Mandal"]);
        }

        if ((this.state.Designation && this.state.Designation.label === "MO") && (!this.state.MandalMunicipality || !this.state.MandalMunicipality.value)) {
            success = false;
            showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a valid Municipality"]);
        }

        if ((this.state.Designation && this.state.Designation.label === "Sarpanch") && (!this.state.PanchayatWard || !this.state.PanchayatWard.value)) {
            success = false;
            showErrorsForInput(this.refs.panchayatWard.wrapper, ["Please select a valid Panchayat"]);
        }

        // if ((this.state.Designation && this.state.Designation.label === "MLA") && (!this.state.AssemblyConstituency || !this.state.AssemblyConstituency.value)) {
        //     success = false;
        //     showErrorsForInput(this.refs.assemblyConstituency.wrapper, ["Please select a valid assembly constituency"]);
        // }
        return success;
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
                showErrorsForInput(this.refs.startDate, ["Please select a valid date"]);
                showErrorsForInput(this.refs.endDate, ["Please select a valid date"]);
                $(".loaderOfficialContact").hide();
                $("button[name='submitOfficialContact']").show();
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
            inputs.map((i, el) => {
                data[el.name] = el.value;
                return null;
            });


            data["designation"] = this.state.Designation.label;
            data["designation_Id"] = this.state.Designation.value;

            if (this.state.Designation.label === "CPO") {
                data["district_id"] = this.state.District.value;
            }

            if (this.state.Designation.label === "MPDO" || this.state.Designation.label === "MO") {
                data["mandalMunicipality_id"] = this.state.MandalMunicipality.value;
            }

            if (this.state.Designation.label === "Sarpanch") {
                data["panchayatWard_Id"] = this.state.PanchayatWard.value;
            }
            // if (this.state.Designation.label === "MLA") {
            //     data["assemblyConstituency_id"] = this.state.AssemblyConstituency.value;
            // }


            var url = ApiUrl + "/api/Admin/AddOfficialContact";
            MyAjax(url,
                (data) => {
                    toast("sucessfull!", {
                        type: toast.TYPE.SUCCESS
                    });
                    this.props.history.push("/admin/official-contacts");
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

