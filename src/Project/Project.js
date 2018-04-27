import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { toast } from 'react-toastify';
import { ApiUrl } from '../Config'
import { MyAjax, MyAjaxForAttachments } from '../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { showErrorsForInput } from '../ValidateForm';
import RichTextEditor from 'react-rte';
import './Project.css'
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
var moment = require('moment');

class Project extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: "", Project: null, ProjectId: 0, IsDataAvailable: false, OfficialDesignations: [],
            ProposalDescription: RichTextEditor.createEmptyValue(), Phases: [], Members: [], SelectedMembers: [],
            ProposalJustification: RichTextEditor.createEmptyValue(), DonationVisibility: null, Status: null,
            ReviewComment: RichTextEditor.createEmptyValue(), ReviewCommentHtml: "", Statuses: [], SelectedPhase: null
        };
    }

    componentWillMount() {
        this.getProject();
    }

    componentDidMount() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    getProject() {
        this.setState({ ProjectId: this.props.match.params["id"] }, () => {
            var url = ApiUrl + "/api/Partner/GetProject?id=" + this.state.ProjectId;
            MyAjax(
                url,
                (data) => this.setState({
                    Project: data["myProject"], Phases: data["myProject"]["Phases"],
                    ProposalDescription: RichTextEditor.createValueFromString(data["myProject"]["ProposalDescription"], 'html'),
                    ProposalJustification: RichTextEditor.createValueFromString(data["myProject"]["ProposalJustification"], 'html'),
                    IsDataAvailable: true, SelectedMembers: data["myProject"]["Assignees"],
                    ReviewComment: data["myProject"]["ReviewComment"] ? RichTextEditor.createValueFromString(data["myProject"]["ReviewComment"], 'html') : RichTextEditor.createEmptyValue()
                }, () => {
                    if (this.state.Project["Status"] !== "Pending" && this.state.Project["Status"] !== "Rejected") {
                        MyAjax(
                            ApiUrl + "/api/MasterData/GetOfficialDesignations",
                            (data) => { this.setState({ OfficialDesignations: data["designations"] }); },
                            (error) => toast(error.responseText, {
                                type: toast.TYPE.ERROR
                            }),
                            "GET",
                            null
                        );
                        this.setState({ Statuses: [{ value: "In Progress", label: "Convert to project" }, { value: "Rejected", label: "Reject" }] })
                    }
                    else {
                        this.setState({ Statuses: [{ value: "Approved", label: "Approve" }, { value: "Rejected", label: "Reject" }] })
                    }


                }),
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                }),
                "GET",
                null
            );
        })

    }

    componentWillUnmount() {
        $(".modal").modal("hide");
    }

    render() {
        return (
            this.state.IsDataAvailable ?
                <div className="col-xs-12">
                    <h2>{this.state.Project["Name"]} {"(" + this.state.Project["ProjectCode"] + ")"}<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/partner-dashboard") }}>Back</button></span></h2>
                    <div className="col-xs-6">
                        <table className="table table-condensed table-bordered view-table">
                            <tbody>
                                <tr>
                                    <th>Sector</th>
                                    <td>{this.state.Project["Sector"]}</td>
                                </tr>
                                <tr>
                                    <th>Scope</th>
                                    <td>{this.state.Project["Scope"]}</td>
                                </tr>
                                <tr>
                                    <th>Submitted On</th>
                                    <td>{moment(this.state.Project["CreatedDate"]).format("DD-MM-YYYY")}</td>
                                </tr>
                                <tr>
                                    <th>Submitted By</th>
                                    <td>{this.state.Project["CreatedBy"]}</td>
                                </tr>
                                <tr>
                                    <th>Partner Contribution</th>
                                    <td>{this.state.Project["PartnerContribution"]}</td>
                                </tr>
                                <tr>
                                    <th>Matching Grant</th>
                                    <td>{this.state.Project["MatchingGrant"]}</td>
                                </tr>
                                <tr>
                                    <th>Last Updated On</th>
                                    <td>{moment(this.state.Project["LastUpdatedTime"]).format("DD-MM-YYYY")}</td>
                                </tr>
                                <tr>
                                    <th>Last Updated By</th>
                                    <td>{this.state.Project["LastUpdatedBy"]}</td>
                                </tr>
                                <tr className={" " + (this.state.Project["Status"] === "Pending" ? "hidden" : "")}>
                                    <th>Reviewed By</th>
                                    <td>{this.state.Project["ReviewedBy"]}</td>
                                </tr>
                                <tr className={" " + (this.state.Project["Status"] === "Pending" ? "hidden" : "")}>
                                    <th>Reviewed Date</th>
                                    <td>{moment(this.state.Project["ReviewDate"]).isValid() ? moment(this.state.Project["ReviewDate"]).format("DD-MM-YYYY") : ""}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div >
                    <div className="col-xs-6">
                        <table className="table table-condensed table-bordered view-table">
                            <tbody>
                                <tr>
                                    <th>Detailed Estimate</th>
                                    <td><a className="pointer" href={this.state.Project["DetailedEstimateAttachmentURL"]} download>Download</a></td>
                                </tr>
                                <tr>
                                    <th>Other Attachments</th>
                                    <td><a className={"pointer " + (this.state.Project["OtherAttachments"].length > 0 ? "" : "hidden")} onClick={() => { $("#otherAttachmentModal").modal("show") }}>Download</a></td>
                                </tr>
                                <tr>
                                    <th>District</th>
                                    <td>{this.state.Project["District"]}</td>
                                </tr>
                                <tr>
                                    <th>Mandal/Municipality</th>
                                    <td>{this.state.Project["MandalMunicipality"]}</td>
                                </tr>
                                <tr>
                                    <th>Panchayat/Ward</th>
                                    <td>{this.state.Project["PanchayatWard"]}</td>
                                </tr>
                                <tr>
                                    <th>Address</th>
                                    <td>{this.state.Project["Address"]}</td>
                                </tr>
                                <tr>
                                    <th>Beneficiaries</th>
                                    <td>{this.state.Project["Beneficiaries"]}</td>
                                </tr>
                                <tr>
                                    <th>BeneficiariesType</th>
                                    <td>{this.state.Project["BeneficiariesType"]}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{this.state.Project["Status"]}</td>
                                </tr>
                                <tr>
                                    <th>Financial Transactions</th>
                                    <td> <a className="pointer" onClick={() => this.props.history.push("/project-funds/" + this.state.Project["Id"])}>View</a> </td>
                                </tr>
                            </tbody>
                        </table>
                    </div >


                    <div className="col-xs-12 mbot20">
                        <div className="communication-block col-xs-12">
                            <div className="mbot20">
                                <label>Proposal Description</label>
                                <RichTextEditor className="readOnly" readOnly={true} value={this.state.ProposalDescription} />
                            </div>
                            <div className="mbot20">
                                <label>Proposal Justification</label>
                                <RichTextEditor className="readOnly" readOnly={true} value={this.state.ProposalJustification} />
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 mbot20">
                        <label>Phases</label>
                        <div className="communication-block col-xs-12">
                            <table className="table table-bordered table-striped">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Expected Duration(days)</th>
                                        <th>Expected Cost(₹)</th>
                                        <th>Status</th>
                                        <th>No. of Activities</th>
                                        <th title="Verifying Authority">Verifying Authority</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.Phases.map((ele, i) => {
                                            return <tr className="pointer" key={ele + "" + i} onClick={() => this.openPhase(ele)}>
                                                <td>{ele.PhaseName}</td>
                                                <td>{ele.PhaseExpectedDurationInDays}</td>
                                                <td>{ele.PhaseExpectedCostInRupees}</td>
                                                <td className={ele.PhaseCompleted ? "label-success" : ""} onClick={() => this.openPhase(ele)}>{ele.PhaseStatus}</td>
                                                <td>{ele["Activities"].length}</td>
                                                <td>{ele.PhaseVerificationAuthorityName ? ele.PhaseVerificationAuthorityName : "Not Assigned"}</td>
                                            </tr>
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={"col-xs-12 mbot20 " + (this.state.Project["Status"] === "Pending" || this.state.Project["Status"] === "Rejected" ? "hidden" : "")}>
                        <label>Members Assigned</label>
                        <div className="communication-block col-xs-12">

                            {
                                this.state.SelectedMembers.length > 0 ?
                                    this.state.SelectedMembers.map((ele, i) => {
                                        return <div className="projectAssignees" key={ele["value"]}>{i + 1 + '. ' + ele["label"]}</div>
                                    })
                                    :
                                    <p>There are no members attached to this project</p>
                            }
                        </div>
                    </div>

                    <div className="col-xs-12 mbot10">
                        <label>Review Comment</label>
                        <div className="form-group" style={{ height: "auto" }}>
                            <RichTextEditor name="reviewComment" readOnly={true} className="reviewCommentRTE" value={this.state.ReviewComment} />
                            <input className="form-control hidden" ref="reviewComment" name="forErrorShowing" />
                        </div>
                    </div>

                    {/*Popup Modal for showing additional downloads */}

                    <div id="otherAttachmentModal" className="modal fade" role="dialog" ref="otherAttachmentModal">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <h4 className="modal-title" style={{ display: 'inline-block' }}>Other Attachments</h4>
                                    <hr />
                                    <div className="col-xs-12">
                                        <ul>
                                            {
                                                this.state.Project["OtherAttachments"].map((ele, i) => {
                                                    return <li key={ele["Url"]}><a href={ele["Url"]} download>{ele["Name"]}</a></li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*Popup for Phase  */}
                    {
                        this.state.SelectedPhase ?
                            <div id="phaseModal" className="modal fade" role="dialog" ref="phaseModal">
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                                            <h4 className="modal-title" style={{ display: 'inline-block' }}>{this.state.SelectedPhase["PhaseName"]}</h4>
                                            <hr />
                                            <div className="col-xs-6">
                                                <table className="table table-condensed table-bordered view-table">
                                                    <tbody>
                                                        <tr>
                                                            <th>Status</th>
                                                            <td>{this.state.SelectedPhase["PhaseStatus"]}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Verification Authority</th>
                                                            <td>{this.state.SelectedPhase["PhaseVerificationAuthorityName"]}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col-xs-6">
                                                <table className="table table-condensed table-bordered view-table">
                                                    <tbody>
                                                        <tr>
                                                            <th>Expected Cost (₹)</th>
                                                            <td>{this.state.SelectedPhase["PhaseExpectedCostInRupees"]}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Expected Duration (days)</th>
                                                            <td>{this.state.SelectedPhase["PhaseExpectedDurationInDays"]}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col-xs-12">
                                                <label>Description</label>
                                                <div>{this.state.SelectedPhase["PhaseDescription"]}</div>
                                            </div>
                                            <div className="clearfix"></div>
                                            <div className="col-xs-12 mtop24">
                                                <label className={this.state.SelectedPhase["Activities"].length > 0 ? "" : "hidden"}>Activities</label>
                                                {
                                                    this.state.SelectedPhase["Activities"].map((ele) => {
                                                        return <div className={"panel " + (ele["ActivityVerified"] ? "panel-success" : "panel-default")}>
                                                            <div className="panel-heading activity-heading">
                                                                {ele["ActivityTitle"]}
                                                                <span className="pull-right">
                                                                    <a href={"#" + ele["ActivityId"]} data-toggle="collapse" >
                                                                        <span className="fa fa-angle-down"></span>
                                                                    </a>
                                                                </span>

                                                            </div>
                                                            <div id={ele["ActivityId"]} className="panel-collapse collapse">
                                                                <div className="panel-body">

                                                                    <div className="col-xs-6">
                                                                        <table className="table table-condensed table-bordered view-table">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th>Status</th>
                                                                                    <td>{ele["ActivityVerified"] ? "Verified" : "Verification Pending"}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <th>Amount Spent</th>
                                                                                    <td>{ele["AmountSpent"]}</td>
                                                                                </tr>
                                                                                <tr className={ele["ActivityAttachments"].length > 0 ? "" : "hidden"}>
                                                                                    <th>Attachments</th>
                                                                                    <td> <a className="pointer" onClick={() => this.downloadAttachments(ele)}>Download</a> </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>

                                                                    <div className="col-xs-6">
                                                                        <table className="table table-condensed table-bordered view-table">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th>Date</th>
                                                                                    <td>{moment(ele["ActivityCreatedDate"]).format("DD-MM-YYYY")}</td>
                                                                                </tr>
                                                                                <tr className={ele["ActivityVerified"] ? "" : "hidden"}>
                                                                                    <th>Verified on</th>
                                                                                    <td>{moment(ele["ActivityVerifiedDate"]).format("DD-MM-YYYY")}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    <div className="clearfix"></div>
                                                                    <div>
                                                                        <label>Activity Description</label>
                                                                        <div>{ele["ActivityDescription"]}</div>
                                                                    </div>

                                                                    <div className={"mtop24 " + (ele["ActivityVerified"] ? "" : "hidden")}>
                                                                        <label>Verification Comments</label>
                                                                        <div>{ele["ActivityVerificationComments"]}</div>
                                                                    </div>

                                                                    <div className="mtop24">
                                                                        <div>
                                                                            <ImageGallery
                                                                                items={ele["ActivityImages"]}
                                                                                slideInterval={2000}
                                                                                fullscreen={true}
                                                                                showThumbnails={false}
                                                                                useBrowserFullscreen={true}
                                                                                autoPlay={true}
                                                                            />

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </div>

                                            <div className="clearfix"></div>
                                            {
                                                !this.state.SelectedPhase.PhaseCompleted && this.state.Project["IsOwner"] ?
                                                    <div className="panel panel-default">
                                                        <div className="panel-heading">
                                                            <h4>Upload New Activity</h4>
                                                        </div>
                                                        <div className="panel-body">
                                                            <form name="activityForm" id="activityForm" onSubmit={this._handleActivitySubmit.bind(this)}>
                                                                <div className="col-xs-12">
                                                                    <label>Title</label>
                                                                    <div className="form-group" >
                                                                        <div className="input-group">
                                                                            <span className="input-group-addon">
                                                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                                            </span>
                                                                            <input className="form-control" name="title" type="text" ref="title" placeholder="Title" />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <label>Activity Date</label>
                                                                    <div className="form-group" >
                                                                        <div className="input-group">
                                                                            <span className="input-group-addon">
                                                                                <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                                            </span>
                                                                            <input type="text" className="date form-control" name="activityDate" ref="activityDate" />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <label>Amount Spent</label>
                                                                    <div className="form-group" >
                                                                        <div className="input-group">
                                                                            <span className="input-group-addon">
                                                                                <i className="fa fa-money" aria-hidden="true"></i>
                                                                            </span>
                                                                            <input type="number" className="form-control" name="amountSpent" ref="amountSpent" min="1" />
                                                                        </div>
                                                                    </div>
                                                                </div>


                                                                <div className="col-md-4">
                                                                    <label>Final Activity in phase?</label>
                                                                    <div className="form-group" >
                                                                        <div className="">
                                                                            <label className="mleft5"><input type="checkbox" name="finalActivity" ref="finalActivity" style={{ position: "relative", top: "2px", marginRight: "2px" }} />Yes</label>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-xs-6">
                                                                    <label>Activity Images</label>
                                                                    <div className="form-group" >
                                                                        <div className="input-group">
                                                                            <span className="input-group-addon">
                                                                                <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                                            </span>
                                                                            <input type="file" multiple accept="image/*" className="form-control" name="activityImages" ref="activityImages" />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-xs-6">
                                                                    <label>Activity Attachments</label>
                                                                    <div className="form-group" >
                                                                        <div className="input-group">
                                                                            <span className="input-group-addon">
                                                                                <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                                            </span>
                                                                            <input type="file" multiple className="form-control" name="activityAttachments" ref="activityAttachments" />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-12">
                                                                    <label>Description</label>
                                                                    <div className="form-group" >
                                                                        <textarea className="form-control" name="description" type="text" ref="description" style={{ resize: "vertical" }} placeholder="Description"></textarea>
                                                                    </div>
                                                                </div>

                                                                <div className="col-sm-1 col-xs-12 text-center">
                                                                    <button type="submit" name="submitActivity" className="btn btn-primary" value="Submit" style={{ "marginTop": "23px" }} >Submit</button>
                                                                    <div className="loader loaderActivity" style={{ marginTop: "28px" }}></div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div> : <div />
                    }


                </div >
                :
                <div className="loader visible"></div>
        );
    }

    openPhase(phase) {
        this.setState({ SelectedPhase: phase }, () => {
            $("#phaseModal").modal("show");
        });

    }

    downloadAttachments(activity) {
        activity["ActivityAttachments"].forEach((ele) => {
            window.open(ele["url"], "_blank");
        })
    }


    _handleActivitySubmit(e) {
        e.preventDefault();
        toast.dismiss();
        if (!this.validate(e)) {
            return;
        }

        var title = this.refs.title.value.trim();
        var activityDate = this.refs.activityDate.value.trim();
        var isFinalActivity = this.refs.finalActivity.checked;
        var amountSpent = this.refs.amountSpent.value.trim();
        var description = this.refs.description.value.trim();
        var activityImages = this.refs.activityImages.files;
        var activityAttachments = this.refs.activityAttachments.files;


        $(".loaderActivity").show();
        $("button[name='submitActivity']").hide();

        var formData = new FormData();
        formData.append("PhaseId", this.state.SelectedPhase["PhaseId"]);
        formData.append("title", title);
        formData.append("activityDate", activityDate);
        formData.append("amountSpent", amountSpent);
        formData.append("isFinalActivity", isFinalActivity);
        formData.append("description", description);
        for (var i = 0; i < activityImages.length; i++) {
            formData.append("activityImages" + i, activityImages[i]);
        }
        for (var j = 0; j < activityAttachments.length; j++) {
            formData.append("activityAttachments" + j, activityAttachments[j]);
        }

        var url = ApiUrl + "/api/Partner/AddActivityForPhase";
        MyAjaxForAttachments(
            url,
            (data) => {
                $("#activityForm")[0].reset();
                $("#phaseModal").modal("hide");
                $(".loaderActivity").hide();
                $("button[name='submitActivity']").show();
                toast("Activity uploaded successfully", {
                    type: toast.TYPE.SUCCESS
                });
                this.getProject();
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".loaderActivity").hide();
                $("button[name='submitActivity']").show();
            },
            "POST",
            formData
        );


    }

    validate(e) {
        var isSubmit = e.type === "submit";
        var success = true;
        var title = this.refs.title.value.trim();
        var description = this.refs.description.value.trim();
        var activityDate = this.refs.activityDate.value.trim();
        var amountSpent = this.refs.amountSpent.value.trim();
        var activityImages = this.refs.activityImages.files;
        var activityAttachments = this.refs.activityAttachments.files;

        //title
        if (title.length === 0) {
            if (isSubmit) {
                this.refs.title.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.title, ["Please enter a title"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.title, []);
        }


        //activityDate
        if (!moment(activityDate).isValid() || moment(activityDate).isAfter(moment())) {
            if (isSubmit) {
                this.refs.activityDate.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.activityDate, ["Please enter a valid date"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.activityDate, []);
        }


        //amountSpent
        if (amountSpent.length === 0) {
            if (isSubmit) {
                this.refs.amountSpent.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.amountSpent, ["Please enter a amount"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.amountSpent, []);
        }


        //activityImages
        if (activityImages.length === 0) {
            showErrorsForInput(this.refs.activityImages, ["Please select atleast one image!"]);
            success = false;
        }
        else {
            for (var i = 0; i < activityImages.length; i++) {
                if ($.inArray(activityImages[i].name.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png"]) === -1) {
                    showErrorsForInput(this.refs.activityImages, ["Supported formats : jpg | jpeg | png"]);
                    success = false;
                }
            }
            showErrorsForInput(this.refs.activityImages, []);
        }


        //activityAttachments
        if (activityAttachments.length > 0) {
            for (var k = 0; k < activityAttachments.length; k++) {

                if ($.inArray(activityAttachments[k].name.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png", "gif", "doc", "docx", "pdf", "txt", "xls", "xlsx"]) === -1) {
                    showErrorsForInput(this.refs.activityAttachments, ["Supported formats : jpg | jpeg | png | gif | doc | docx | xls | xlsx | pdf | txt"]);
                    success = false;
                }
            }
            showErrorsForInput(this.refs.activityAttachments, []);
        }


        //description
        if (description.length === 0) {
            if (isSubmit) {
                this.refs.description.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.description, ["Please enter a description"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.description, []);
        }


        return success;
    }



}

export default Project;
