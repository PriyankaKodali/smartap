import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../Config'
import { MyAjax } from '../MyAjax';
import { showErrorsForInput, setUnTouched, ValidateForm } from '../ValidateForm';
import NewPartnerGrievance from './NewPartnerGrievance';
import EditPartnerGrievance from './EditPartnerGrievance';
import  Select  from 'react-select';
var moment = require('moment');

class PartnerGrievance extends Component {

    constructor(props) {
        super(props);
        var isPartner = sessionStorage.getItem("smart_ap_roles").indexOf("Partner") !== -1;
        var isApprover = sessionStorage.getItem("smart_ap_roles").indexOf("Approver") !== -1;
        var isAdmin = sessionStorage.getItem("smart_ap_roles").indexOf("Admin") !== -1;
        this.state = {
            GrievanceId: null, Grievance: null, Partners: null, Partner: null,
            IsDataAvailable: false, IsPartner: isPartner, IsApprover: isApprover, IsAdmin: isAdmin
        };
    }

    componentWillMount() {
        this.setState({ GrievanceId: this.props.match.params["id"], IsDataAvailable: true });
    }

    render() {
        return (
            this.state.IsDataAvailable ?
                this.state.GrievanceId === undefined ? <NewPartnerGrievance history={this.props.history} IsPartner={this.state.IsPartner} />
                    :
                    <EditPartnerGrievance GrievanceId={this.state.GrievanceId} history={this.props.history} IsPartner={this.state.IsPartner}
                        IsApprover={this.state.IsApprover} IsAdmin={this.state.IsAdmin} />
                :
                <div className="loader visible"></div>
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

        var data = { subject: subject, description: description, partnerId: this.state.Partner.value };

        MyAjax(
            ApiUrl + "/api/PartnerGrievance/AddPartnerGrievance",
            (data) => {
                toast("Grievance added successfully", {
                    type: toast.TYPE.SUCCESS
                })
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

export default PartnerGrievance;
