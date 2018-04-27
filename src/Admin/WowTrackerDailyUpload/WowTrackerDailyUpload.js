import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl } from '../../Config';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { showErrorsForInput, setUnTouched } from '../../ValidateForm';
import Select from 'react-select';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

class WowTrackerDailyUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Districts: [], District: null, MandalsMunicipalities: [], MandalMunicipality: null, PanchayatsWards: [], PanchayatWard: null
        };
    }

    componentWillMount() {
        MyAjax(
            ApiUrl + "/api/MasterData/GetDistricts",
            (data) => { this.setState({ Districts: data["districts"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        );
    }

    componentDidMount() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
        $('.date').val(moment().format("DD-MM-YYYY"));
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    render() {
        return (
            <div className="col-xs-12">
                <h3>Daily Update Tracker<div className="btn btn-default pull-right" onClick={() => this.props.history.push("/admin/wow-tracker")}>Back</div> </h3>
                <div className="col-md-3">
                    <label>Date</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-calendar" aria-hidden="true"></i>
                            </span>
                            <input className="date form-control" type="text" name="date" ref="date" placeholder="Date" autoComplete="off" />
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <label>District</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                            </span>
                            <Select className="district form-control" name="district" options={this.state.Districts} placeholder="District" onChange={this.districtChange.bind(this)} ref="district" value={this.state.District} />
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <label>Mandal</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                            </span>
                            <Select
                                optionRenderer={(option) => {
                                    return <span className={"Select-menu-option " + option.type}>{option.label}</span>;
                                }}
                                backspaceRemoves={false} className="mandalMunicipality form-control" name="mandalMunicipality" options={this.state.MandalsMunicipalities} placeholder="Mandal/Municipality" ref="mandalMunicipality" onChange={this.mandalMunicipalityChange.bind(this)} value={this.state.MandalMunicipality} />
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <label>Panchayat</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                            </span>
                            <Select className="panchayatWard form-control" name="panchayatWard" options={this.state.PanchayatsWards} placeholder="Panchayat/Ward" onChange={this.panchayatWardChange.bind(this)} ref="panchayatWard" value={this.state.PanchayatWard} />
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <hr className="m0" />
                <h4>School Children</h4>
                <div className="col-md-2">
                    <label>No. of Male Children</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-users" aria-hidden="true"></i>
                            </span>
                            <input className="form-control" type="number" min="0" name="schoolMale" ref="schoolMale" placeholder="Male Children" autoComplete="off" />
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <label>No. of Female Children</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-users" aria-hidden="true"></i>
                            </span>
                            <input className="form-control" type="number" min="0" name="schoolFemale" ref="schoolFemale" placeholder="Male Children" autoComplete="off" />
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <label>Photos of All Batches</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-paperclip" aria-hidden="true"></i>
                            </span>
                            <input type="file" accept="images/*" className="form-control" name="school" ref="school" multiple />
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <hr className="m0" />
                <h4>Youth</h4>
                <div className="col-md-2">
                    <label>No. of Male</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-users" aria-hidden="true"></i>
                            </span>
                            <input className="form-control" type="number" min="0" name="youthMale" ref="youthMale" placeholder="Male Youth" autoComplete="off" />
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <label>No. of Female</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-users" aria-hidden="true"></i>
                            </span>
                            <input className="form-control" type="number" min="0" name="youthFemale" ref="youthFemale" placeholder="Female Youth" autoComplete="off" />
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <label>Photos of All Batches</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-paperclip" aria-hidden="true"></i>
                            </span>
                            <input type="file" accept="images/*" className="form-control" name="youth" ref="youth" multiple />
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <hr className="m0" />
                <h4>Community members</h4>
                <div className="col-md-2">
                    <label>No. of Male</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-users" aria-hidden="true"></i>
                            </span>
                            <input className="form-control" type="number" min="0" name="communityMale" ref="communityMale" placeholder="Male Locals" autoComplete="off" />
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <label>No. of Female</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-users" aria-hidden="true"></i>
                            </span>
                            <input className="form-control" type="number" min="0" name="communityFemale" ref="communityFemale" placeholder="Female Locals" autoComplete="off" />
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <label>Photos</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-paperclip" aria-hidden="true"></i>
                            </span>
                            <input type="file" accept="images/*" className="form-control" name="community" ref="community" multiple />
                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>
                <hr className="m0" />

                <div className="col-xs-12">
                    <label>Overall glance about day activities</label>
                    <div className="form-group form-group-textarea" >
                        <textarea className="form-control" rows={5} ref="comments"></textarea>
                    </div>
                </div>

                <div className="col-md-8">
                    <label>Additional Attachments</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-paperclip" aria-hidden="true"></i>
                            </span>
                            <input type="file" className="form-control" name="attachments" ref="attachments" multiple />
                        </div>
                    </div>
                </div>

                <div className="col-xs-12 text-center">
                    <button className="btn btn-success" name="submit" onClick={this.submitDailyActivity.bind(this)}>Submit</button>
                    <div className="loader"></div>
                </div>

            </div>
        );
    }

    districtChange(val) {
        this.setState({ District: val, MandalMunicipality: null, PanchayatWard: null }, () => {
            if (this.state.District && this.state.District.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetMandalsMunicipalities?DistrictId=" + this.state.District.value,
                    (data) => { this.setState({ MandalsMunicipalities: data["mandalsMunicipalities"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                showErrorsForInput(this.refs.district.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.district.wrapper, ["Please select a valid district"]);
            }
        });
    }

    mandalMunicipalityChange(val) {
        this.setState({ MandalMunicipality: val, PanchayatWard: null }, () => {
            if (this.state.MandalMunicipality && this.state.MandalMunicipality.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetPanchayatsWards?MandalMunicipalityId=" + this.state.MandalMunicipality.value + "&PartnerType=",
                    (data) => { this.setState({ PanchayatsWards: data["panchayatsWards"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                showErrorsForInput(this.refs.mandalMunicipality.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a valid Mandal/Municipality"]);
            }
        });
    }

    panchayatWardChange(val) {
        this.setState({ PanchayatWard: val });
        if (val) {
            showErrorsForInput(this.refs.panchayatWard.wrapper, null);
        }
        else {
            showErrorsForInput(this.refs.panchayatWard.wrapper, ["Please select a valid Panchayat/Ward"]);
        }
    }

    submitDailyActivity(e) {
        if (!this.validate(e)) {
            return;
        }
        $(".loader").show();
        $("button[name='submit']").hide();
        var data = new FormData();
        data.append("schoolMale", this.refs.schoolMale.value.trim());
        data.append("schoolFemale", this.refs.schoolFemale.value.trim());
        data.append("youthMale", this.refs.youthMale.value.trim());
        data.append("youthFemale", this.refs.youthFemale.value.trim());
        data.append("communityMale", this.refs.communityMale.value.trim());
        data.append("communityFemale", this.refs.communityFemale.value.trim());
        data.append("panchayatId", this.state.PanchayatWard.value);
        data.append("date", this.refs.date.value.trim());
        data.append("description", this.refs.comments.value.trim());
        for (var i = 0; i < this.refs.school.files.length; i++) {
            data.append("school-" + i, this.refs.school.files[i]);
        }
        for (var i = 0; i < this.refs.youth.files.length; i++) {
            data.append("youth-" + i, this.refs.youth.files[i]);
        }
        for (var i = 0; i < this.refs.community.files.length; i++) {
            data.append("community-" + i, this.refs.community.files[i]);
        }
        for (var i = 0; i < this.refs.attachments.files.length; i++) {
            data.append("attachments-" + i, this.refs.attachments.files[i]);
        }
        var url = ApiUrl + "api/Wow/AddDailyActivity";
        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Daily Activity submitted successfully", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    this.props.history.push("/admin/wow-tracker")
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
        var success = true;

        if (this.refs.date.value.trim().length == 0) {
            if (success) {
                success = false;
                this.refs.date.focus();
            }
            showErrorsForInput(this.refs.date, ["Please select a valid date"]);
        }
        else {
            showErrorsForInput(this.refs.date, []);
        }

        if (this.state.District == null) {
            if (success) {
                success = false;
                this.refs.district.focus();
            }
            showErrorsForInput(this.refs.district.wrapper, ["Please select a district"]);
        }
        else {
            showErrorsForInput(this.refs.district.wrapper, []);
        }

        if (this.state.MandalMunicipality == null) {
            if (success) {
                success = false;
                this.refs.mandalMunicipality.focus();
            }
            showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a mandal"]);
        }
        else {
            showErrorsForInput(this.refs.mandalMunicipality.wrapper, []);
        }

        if (this.state.PanchayatWard == null) {
            if (success) {
                success = false;
                this.refs.panchayatWard.focus();
            }
            showErrorsForInput(this.refs.panchayatWard.wrapper, ["Please select a panchayat"]);
        }
        else {
            showErrorsForInput(this.refs.panchayatWard.wrapper, []);
        }

        if (this.refs.schoolMale.value.trim().length === 0) {
            if (success) {
                success = false;
                this.refs.schoolMale.focus();
            }
            showErrorsForInput(this.refs.schoolMale, ["Please enter a valid number"]);
        }
        else {
            showErrorsForInput(this.refs.schoolMale, []);
        }
        if (this.refs.schoolFemale.value.trim().length === 0) {
            if (success) {
                success = false;
                this.refs.schoolFemale.focus();
            }
            showErrorsForInput(this.refs.schoolFemale, ["Please enter a valid number"]);
        }
        else {
            showErrorsForInput(this.refs.schoolFemale, []);
        }

        if (this.refs.school.files.length === 0) {
            success = false;
            showErrorsForInput(this.refs.school, ["Please select atleast one image"]);
        }
        for (var i = 0; i < this.refs.school.files.length; i++) {
            if ($.inArray(this.refs.school.files[i].name.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png"]) === -1) {
                showErrorsForInput(this.refs.school, ["Supported formats : jpg | jpeg | png"]);
                success = false;
                break;
            }
            else {
                showErrorsForInput(this.refs.school, []);
            }
        }

        if (this.refs.youthMale.value.trim().length === 0) {
            if (success) {
                success = false;
                this.refs.youthMale.focus();
            }
            showErrorsForInput(this.refs.youthMale, ["Please enter a valid number"]);
        }
        else {
            showErrorsForInput(this.refs.youthMale, []);
        }
        if (this.refs.youthFemale.value.trim().length === 0) {
            if (success) {
                success = false;
                this.refs.youthFemale.focus();
            }
            showErrorsForInput(this.refs.youthFemale, ["Please enter a valid number"]);
        }
        else {
            showErrorsForInput(this.refs.youthFemale, []);
        }

        if (this.refs.youth.files.length === 0) {
            success = false;
            showErrorsForInput(this.refs.youth, ["Please select atleast one image"]);
        }
        for (var i = 0; i < this.refs.youth.files.length; i++) {
            if ($.inArray(this.refs.youth.files[i].name.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png"]) === -1) {
                showErrorsForInput(this.refs.youth, ["Supported formats : jpg | jpeg | png"]);
                success = false;
                break;
            }
            else {
                showErrorsForInput(this.refs.youth, []);
            }
        }


        if (this.refs.communityMale.value.trim().length === 0) {
            if (success) {
                success = false;
                this.refs.communityMale.focus();
            }
            showErrorsForInput(this.refs.communityMale, ["Please enter a valid number"]);
        }
        else {
            showErrorsForInput(this.refs.communityMale, []);
        }
        if (this.refs.communityFemale.value.trim().length === 0) {
            if (success) {
                success = false;
                this.refs.communityFemale.focus();
            }
            showErrorsForInput(this.refs.communityFemale, ["Please enter a valid number"]);
        }
        else {
            showErrorsForInput(this.refs.communityFemale, []);
        }

        if (this.refs.community.files.length === 0) {
            success = false;
            showErrorsForInput(this.refs.community, ["Please select atleast one image"]);
        }
        for (var i = 0; i < this.refs.community.files.length; i++) {
            if ($.inArray(this.refs.community.files[i].name.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png"]) === -1) {
                showErrorsForInput(this.refs.community, ["Supported formats : jpg | jpeg | png"]);
                success = false;
                break;
            }
            else {
                showErrorsForInput(this.refs.community, []);
            }
        }

        return success;
    }


}

export default WowTrackerDailyUpload;


