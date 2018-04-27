import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../Config'
import { MyAjax } from '../MyAjax';
import { showErrorsForInput, setUnTouched, ValidateForm } from '../ValidateForm';
import  Select  from 'react-select';
var moment = require('moment');

class NewPartnerGrievance extends Component {

    constructor(props) {
        super(props);
        var isPartner = sessionStorage.getItem("smart_ap_roles").indexOf("Partner") !== -1;
        var isAdmin = sessionStorage.getItem("smart_ap_roles").indexOf("Admin") !== -1;
        this.state = {
            GrievanceId: null, Grievance: null, Partners: null, Partner: null, IsPartner: isPartner,
            IsAdmin: isAdmin
        };
    }

    componentWillMount() {
        if (!this.props.IsPartner) {
            MyAjax(
                ApiUrl + "/api/PartnerGrievance/GetAllPartners",
                (data) => {
                    this.setState({ IsDataAvailable: true, Partners: data["partners"] });
                },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            );
        }
        else {
            this.setState({ IsDataAvailable: true });
        }
    }

    render() {
        return (
            this.state.IsPartner || this.state.IsAdmin ?
                this.state.IsDataAvailable ?
                    <div className="col-xs-12">
                        <h2>New Ticket<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/partner-grievances") }}>Back</button></span></h2>
                        <hr />
                        {
                            !this.props.IsPartner ? <div className="col-md-4">
                                <label>Partner</label>
                                <div className="form-group" >
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                        </span>
                                        <Select className="partners form-control" name="partners" options={this.state.Partners} placeholder="Partners" onChange={this.partnersChange.bind(this)} ref="partners" value={this.state.Partner} />
                                    </div>
                                </div>
                            </div>
                                :
                                <div />
                        }

                        <div className={this.props.IsPartner ? "col-md-12" : "col-md-8"}>
                            <label>Subject</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" name="subject" ref="subject" placeholder="Subject" autoComplete="off" />
                                </div>
                            </div>
                        </div>


                        <div className="col-xs-12">
                            <label>Description</label>
                            <div className="form-group form-group-textarea" >
                                <textarea className="form-control" rows={5} ref="description" ></textarea>
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center form-group mtop24">
                            <button type="submit" name="submit" className="btn btn-primary" onClick={this.submitTicket.bind(this)}>Submit</button>
                            <div className="loader submitLoader"></div>
                        </div>
                    </div>
                    :
                    <div className="loader visible">
                    </div>
                :
                <div />
        );
    }

    partnersChange(val) {
        this.setState({ Partner: val });
        if (val) {
            showErrorsForInput(this.refs.partners.wrapper, []);
        }
        else {
            showErrorsForInput(this.refs.partners.wrapper, ["Please select a partner"]);
        }
    }

    submitTicket(e) {
        e.preventDefault();
        toast.dismiss();

        if (!this.validate()) {
            return;
        }

        $(".submitLoader").css("display", "inline-block");
        $("button[name='submit']").hide();

        var subject = this.refs.subject.value.trim();
        var description = this.refs.description.value.trim();
        var partnerId = this.props.IsPartner ? null : this.state.Partner.value
        var data = { subject: subject, description: description, partnerId: partnerId };

        MyAjax(
            ApiUrl + "/api/PartnerGrievance/AddPartnerGrievance",
            (data) => {
                toast("Grievance added successfully", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/partner-grievances");
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "POST",
            data
        );
    }

    validate() {
        var success = true;
        var subject = this.refs.subject.value.trim();
        var description = this.refs.description.value.trim();

        if (!this.props.IsPartner) {
            if (!this.state.Partner) {
                showErrorsForInput(this.refs.partners.wrapper, ["Please select a partner"]);
                if (success) {
                    this.refs.partners.wrapper.focus();
                    success = false;
                }
            }
            else {
                showErrorsForInput(this.refs.partners.wrapper, []);
            }
        }


        if (subject === "") {
            showErrorsForInput(this.refs.subject, ["Please enter a subject"]);
            if (success) {
                this.refs.subject.focus();
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.subject, []);
        }

        if (description === "") {
            showErrorsForInput(this.refs.description, ["Please enter a description"]);
            if (success) {
                this.refs.description.focus();
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.description, []);
        }

        return success;
    }
}

export default NewPartnerGrievance;
