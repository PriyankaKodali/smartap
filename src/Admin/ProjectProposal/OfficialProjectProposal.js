import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl } from '../../Config'
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import './ProjectProposal.css'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import { showErrorsForInput } from '../../ValidateForm';
import RichTextEditor from 'react-rte';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
var moment = require('moment');

class OfficialProjectProposal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: "", Proposal: null, ProposalId: 0, IsDataAvailable: false, OfficialDesignations: [],
            ProposalDescription: RichTextEditor.createEmptyValue(), Phases: [], Members: [], SelectedMembers: [],
            ProposalJustification: RichTextEditor.createEmptyValue(), DonationVisibility: null, Status: null,
            ReviewComment: RichTextEditor.createEmptyValue(), ReviewCommentHtml: "", Statuses: [], SelectedPhase: null,
            MemberAddLoading: false, NewMember: null, TemporaryVerificationAuthority: null
        };
    }

    componentWillMount() {
        this.getProject();
    }

    getProject() {
        this.setState({ ProposalId: this.props.match.params["id"] }, () => {
            var url = ApiUrl + "/api/Projects/GetProposal?id=" + this.state.ProposalId;
            MyAjax(
                url,
                (data) => this.setState({
                    Proposal: data["myProposal"], Phases: data["myProposal"]["Phases"],
                    ProposalDescription: RichTextEditor.createValueFromString(data["myProposal"]["ProposalDescription"], 'html'),
                    ProposalJustification: RichTextEditor.createValueFromString(data["myProposal"]["ProposalJustification"], 'html'),
                    IsDataAvailable: true, SelectedMembers: data["myProposal"]["Assignees"],
                    ReviewComment: data["myProposal"]["ReviewComment"] ? RichTextEditor.createValueFromString(data["myProposal"]["ReviewComment"], 'html') : RichTextEditor.createEmptyValue()
                }, () => {
                    if (this.state.Proposal["Status"] !== "Pending" && this.state.Proposal["Status"] !== "Rejected") {
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
                    <h2>{this.state.Proposal["Name"]} {"(" + this.state.Proposal["ProjectCode"] + ")"}<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/project-proposals") }}>Back</button></span></h2>
                    <div className="col-md-6">
                        <table className="table table-condensed table-bordered view-table">
                            <tbody>
                                <tr>
                                    <th>Sector</th>
                                    <td>{this.state.Proposal["Sector"]}</td>
                                </tr>
                                <tr>
                                    <th>Scope</th>
                                    <td>{this.state.Proposal["Scope"]}</td>
                                </tr>
                                <tr>
                                    <th>Submitted On</th>
                                    <td>{moment(this.state.Proposal["CreateDate"]).format("DD-MM-YYYY")}</td>
                                </tr>
                                <tr>
                                    <th>Submitted By</th>
                                    {
                                        this.state.Proposal["PartnerId"] ?
                                            <td><a className="pointer" onClick={() => this.props.history.push("/admin/partner-details/" + this.state.Proposal["PartnerId"])}>{this.state.Proposal["CreatedBy"]}</a></td>
                                            :
                                            <td>{this.state.Proposal["CreatedBy"]}</td>
                                    }
                                </tr>
                                <tr>
                                    <th>Partner Contribution</th>
                                    <td>{this.state.Proposal["PartnerContribution"]}</td>
                                </tr>
                                <tr>
                                    <th>Matching Grant</th>
                                    <td>{this.state.Proposal["MatchingGrant"]}</td>
                                </tr>
                                <tr>
                                    <th>Last Updated On</th>
                                    <td>{moment(this.state.Proposal["LastUpdatedTime"]).format("DD-MM-YYYY")}</td>
                                </tr>
                                <tr>
                                    <th>Last Updated By</th>
                                    <td>{this.state.Proposal["LastUpdatedBy"]}</td>
                                </tr>
                                <tr className={" " + (this.state.Proposal["Status"] === "Pending" ? "hidden" : "")}>
                                    <th>Reviewed By</th>
                                    <td>{this.state.Proposal["ReviewedBy"]}</td>
                                </tr>
                                <tr className={" " + (this.state.Proposal["Status"] === "Pending" ? "hidden" : "")}>
                                    <th>Reviewed Date</th>
                                    <td>{moment(this.state.Proposal["ReviewDate"]).isValid() ? moment(this.state.Proposal["ReviewDate"]).format("DD-MM-YYYY") : ""}</td>
                                </tr>
                                <tr>
                                    <th>Financial Transactions</th>
                                    <td> <a className="pointer" onClick={() => this.props.history.push("/project-funds/" + this.state.Proposal["Id"])}>View</a> </td>
                                </tr>
                            </tbody>
                        </table>
                    </div >
                    <div className="col-md-6">
                        <table className="table table-condensed table-bordered view-table">
                            <tbody>
                                <tr>
                                    <th>Detailed Estimate</th>
                                    <td><a className="pointer" href={this.state.Proposal["DetailedEstimateAttachmentURL"]} download>Download</a></td>
                                </tr>
                                <tr>
                                    <th>Other Attachments</th>
                                    <td><a className={"pointer " + (this.state.Proposal["OtherAttachments"].length > 0 ? "" : "hidden")} onClick={() => { $("#otherAttachmentModal").modal("show") }}>Download</a></td>
                                </tr>
                                <tr>
                                    <th>District</th>
                                    <td>{this.state.Proposal["District"]}</td>
                                </tr>
                                <tr>
                                    <th>Mandal/Municipality</th>
                                    <td>{this.state.Proposal["MandalMunicipality"]}</td>
                                </tr>
                                <tr>
                                    <th>Panchayat/Ward</th>
                                    <td>{this.state.Proposal["PanchayatWard"]}</td>
                                </tr>
                                <tr>
                                    <th>Address</th>
                                    <td>{this.state.Proposal["Address"]}</td>
                                </tr>
                                <tr>
                                    <th>Beneficiaries</th>
                                    <td>{this.state.Proposal["Beneficiaries"]}</td>
                                </tr>
                                <tr>
                                    <th>BeneficiariesType</th>
                                    <td>{this.state.Proposal["BeneficiariesType"]}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{this.state.Proposal["Status"]}</td>
                                </tr>
                                <tr>
                                    <th>Show in Donations</th>
                                    <td>{this.state.Proposal["DonationRequired"] ? "Yes" : "No"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div >
                    <div className="clearfix"></div>
                    <div>
                        <div className="col-sm-4">
                            <h4>CPO</h4>
                            <table className="table table-condensed table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{this.state.Proposal["CPO"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{this.state.Proposal["CPOEmail"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <td>{this.state.Proposal["CPOPhone"]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-sm-4">
                            <h4>MPDO</h4>
                            <table className="table table-condensed table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{this.state.Proposal["MPDO"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{this.state.Proposal["MPDOEmail"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <td>{this.state.Proposal["MPDOPhone"]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-sm-4">
                            <h4>Sarpanch</h4>
                            <table className="table table-condensed table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{this.state.Proposal["Sarpanch"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{this.state.Proposal["SarpanchEmail"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <td>{this.state.Proposal["SarpanchPhone"]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

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
                        <div className="communication-block" style={{ position: "relative" }}>
                            <div className="table-responsive">
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
                                                    <td>
                                                        {
                                                            ele.PhaseExpectedCostInRupees.toLocaleString('en-IN', {
                                                                style: 'currency',
                                                                currency: 'INR',
                                                            })
                                                        }
                                                    </td>
                                                    <td className={ele.PhaseCompleted ? "label-success" : ""} onClick={() => this.openPhase(ele)}>{ele.PhaseStatus}</td>
                                                    <td>{ele["Activities"].length}</td>
                                                    <td>{ele.PhaseVerificationAuthorityName}</td>
                                                </tr>
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12 mbot10">
                        <label>Review Comment</label>
                        <div className="form-group" style={{ height: "auto" }}>
                            <RichTextEditor name="reviewComment" readOnly={this.state.Proposal["ReviewComment"] ? true : false} className="reviewCommentRTE" value={this.state.ReviewComment} />
                            <input className="form-control hidden" ref="reviewComment" name="forErrorShowing" />
                        </div>
                    </div>

                    <div className={"col-xs-12 mbot20 " + (this.state.Proposal["Status"] === "Pending" || this.state.Proposal["Status"] === "Rejected" ? "hidden" : "")}>
                        <label>Members Assigned</label>
                        <div className="communication-block col-xs-12">

                            {
                                this.state.SelectedMembers.length > 0 ?
                                    this.state.SelectedMembers.map((ele, i) => {
                                        return <div className="projectAssignees" key={ele["value"]}>{i + 1 + '. ' + ele["label"]} <span className="fa fa-times text-danger pointer" onClick={() => this.removeMember(ele)}></span> </div>
                                    })
                                    :
                                    <p>There are no members attached to this project</p>
                            }
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
                                                this.state.Proposal["OtherAttachments"].map((ele, i) => {
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
                                                        return <div className={"panel " + (ele["ActivityVerified"] ? "panel-success" : "panel-default")} key={ele["ActivityId"]}>
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
                                                                                    <th>Activity Date</th>
                                                                                    <td>{moment(ele["ActivityDate"]).format("DD-MM-YYYY")}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <th>Status</th>
                                                                                    <td>{ele["ActivityVerified"] ? "Verified" : "Verification Pending"}</td>
                                                                                </tr>
                                                                                <tr className={ele["ActivityAttachments"].length > 0 ? "" : "hidden"}>
                                                                                    <th>Attachments</th>
                                                                                    <td> <a className="pointer" onClick={() => this.downloadAttachments(ele)}>Download</a> </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>

                                                                    <div className="col-xs-6">
                                                                        <table className={"table table-condensed table-bordered view-table"}>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th>Submitted Date</th>
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
                                                                    {
                                                                        ele["ActivityVerified"] || !this.state.SelectedPhase["CanVerifyActivities"] ? <br /> :
                                                                            <form className="mtop10" onSubmit={this.verifyActivity.bind(this)}>
                                                                                <input type="text" name={ele["ActivityId"]} hidden defaultValue={ele["ActivityId"]} />
                                                                                <div className="col-xs-12">
                                                                                    <div className=" form-group-textarea form-group">
                                                                                        <textarea className="form-control" name={ele["ActivityId"] + "Comment"} type="text" ref={ele["ActivityId"] + "Comment"} style={{ resize: "vertical" }} placeholder="Comment"></textarea>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-xs-12 text-center">
                                                                                    <div className="loader"></div>
                                                                                    <button type="submit" name={ele["ActivityId"] + "comment"} className="btn btn-primary">Verify</button>
                                                                                </div>
                                                                            </form>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    })
                                                }
                                            </div>
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



    downloadAttachments(activity) {
        activity["ActivityAttachments"].forEach((ele) => {
            window.open(ele["url"], "_blank");
        })
    }

    verifyActivity(e) {
        e.preventDefault();
        $(".loader").show();
        $("button[type='submit']").hide();
        var comments = $(e.target).find("textarea")[0].value.trim();
        var activityId = $(e.target).find("input[type=text]")[0].value;
        var data = { comments: comments, activityId: activityId };
        MyAjax(
            ApiUrl + "/api/Projects/VerifyActivity",
            (data) => {
                $(".loader").hide();
                $("button[type='submit']").show();
                $("#phaseModal").modal("hide");
                toast("activity verified successfully", {
                    type: toast.TYPE.SUCCESS
                });
                this.getProject();
            },
            (error) => {
                $(".loader").hide();
                $("button[type='submit']").show();
                toast("error occoured, please try again", {
                    type: toast.TYPE.ERROR
                });
            },
            "POST",
            data
        )
    }

    openPhase(phase) {
        this.setState({ SelectedPhase: phase }, () => {
            $("#phaseModal").modal("show");
        });

    }

    handleSubmit(e) {
        toast.dismiss();
        if (!this.validate()) {
            return;
        }
        $(".loader").show();
        $("button[name='submit']").hide();

        var data = new FormData();
        var phases = JSON.stringify(this.state.Phases);
        data.append("id", this.state.ProposalId);
        data.append("phases", phases);
        data.append("donationRequired", this.state.DonationVisibility.value);
        if (this.refs.status) {
            data.append("status", this.state.Status.value);
        }
        if (this.refs.matchingGrant) {
            data.append("matchingGrant", this.refs.matchingGrant.value.trim());
        }
        if (!this.state.Proposal["ReviewComment"]) {
            data.append("comment", this.state.ReviewCommentHtml);
        }

        var url = ApiUrl + "/api/Projects/UpdateProject"
        MyAjaxForAttachments(
            url,
            () => {
                this.props.history.push("/admin/project-proposals");
                toast("Project details updated successfully", {
                    type: toast.TYPE.SUCCESS
                });
                $(".loader").hide();
                $("button[name='submit']").show();
            },
            (error) => {
                toast("An error occoured, please try again!", {
                    type: toast.TYPE.ERROR
                });
                $(".loader").hide();
                $("button[name='submit']").show();
            },
            "POST",
            data
        );

    }

    validate() {
        var success = true;

        if (!this.state.ReviewComment.getEditorState().getCurrentContent().hasText()) {
            $(".reviewCommentRTE").css({ border: "1pt solid #a94442" });
            showErrorsForInput(this.refs.reviewComment, ["Please enter a comment"]);
            success = false;
        }
        else {
            $(".reviewCommentRTE").css({ border: "1pt solid #ddd" })
            showErrorsForInput(this.refs.reviewComment, []);
        }

        if (!this.state.DonationVisibility) {
            showErrorsForInput(this.refs.donationVisibility.wrapper, ["Please select a valid option"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.donationVisibility.wrapper, []);
        }

        //check and show error if Status select is visible on DOM (this.refs.status tells whether status select present or not)
        if (this.refs.status) {
            if (this.state.Status && this.state.Status.value === "Rejected") {
                this.setState({ DonationVisibility: { value: false, label: "No" } });
            }
            if (!this.state.Status) {
                showErrorsForInput(this.refs.status.wrapper, ["Please select a valid status"]);
                success = false;
            }
            else {
                showErrorsForInput(this.refs.status.wrapper, []);
            }
        }

        if (this.refs.matchingGrant) {
            if (this.refs.matchingGrant.value.trim() === "") {
                showErrorsForInput(this.refs.matchingGrant, ["Please enter a valid matching grant"]);
                success = false;
            }
            else {
                showErrorsForInput(this.refs.matchingGrant, []);
            }
        }

        return success;
    }


}

export default OfficialProjectProposal;
