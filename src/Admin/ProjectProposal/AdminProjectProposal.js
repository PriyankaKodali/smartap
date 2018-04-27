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
import Select from 'react-select';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

class AdminProjectProposal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            error: "", Proposal: null, ProposalId: 0, IsDataAvailable: false, OfficialDesignations: [],
            ProposalDescription: RichTextEditor.createEmptyValue(), Phases: [], Members: [], SelectedMembers: [],
            ProposalJustification: RichTextEditor.createEmptyValue(), DonationVisibility: null, Status: null,
            ReviewComment: RichTextEditor.createEmptyValue(), ReviewCommentHtml: "", Statuses: [], SelectedPhase: null,
            MemberAddLoading: false, NewMember: null, TemporaryVerificationAuthority: null, ChangeVerificationAuthority: false
        };
    }

    componentWillMount() {
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
                                    <td>{moment(this.state.Proposal["CreatedDate"]).format("DD-MM-YYYY")}</td>
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
                                                return <tr className="pointer" key={ele + "" + i}>
                                                    <td onClick={() => this.openPhase(ele)}>{ele.PhaseName}</td>
                                                    <td onClick={() => this.openPhase(ele)}>{ele.PhaseExpectedDurationInDays}</td>
                                                    <td onClick={() => this.openPhase(ele)}>
                                                        {
                                                            ele.PhaseExpectedCostInRupees.toLocaleString('en-IN', {
                                                                style: 'currency',
                                                                currency: 'INR',
                                                            })
                                                        }
                                                    </td>
                                                    <td className={ele.PhaseCompleted ? "label-success" : ""} onClick={() => this.openPhase(ele)}>{ele.PhaseStatus}</td>
                                                    <td onClick={() => this.openPhase(ele)}>{ele["Activities"].length}</td>
                                                    <td> <a onClick={() => this.openVerificationAuthorityModal(ele)}>{ele.PhaseVerificationAuthorityName ? ele.PhaseVerificationAuthorityName : "Add"}</a></td>
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
                            <RichTextEditor name="reviewComment" readOnly={this.state.Proposal["ReviewComment"] ? true : false} className="reviewCommentRTE" value={this.state.ReviewComment} onChange={this.reviewCommentChange.bind(this)} />
                            <input className="form-control hidden" ref="reviewComment" name="forErrorShowing" />
                        </div>
                    </div>

                    <div className={"col-xs-12 mbot20 " + (this.state.Proposal["Status"] === "Pending" || this.state.Proposal["Status"] === "Rejected" ? "hidden" : "")}>
                        <label>Members Assigned
                            <span className="btn btn-small btn-info mleft5" onClick={() => {
                                $("#addMemberModal").modal("show");
                            }}>Add</span>
                        </label>
                        <div className="communication-block col-xs-12">

                            {
                                this.state.SelectedMembers.length > 0 ?
                                    this.state.MemberAddLoading ?
                                        <div className="loader visible"></div>
                                        :
                                        this.state.SelectedMembers.map((ele, i) => {
                                            return <div className="projectAssignees" key={ele["value"]}>{i + 1 + '. ' + ele["label"]} <span className="fa fa-times text-danger pointer" onClick={() => this.removeMember(ele)}></span> </div>
                                        })
                                    :
                                    <p>There are no members attached to this project</p>
                            }
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="col-md-3">
                        <label>Show in Donations</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-money" aria-hidden="true"></i>
                                </span>
                                <Select className="form-control" name="donationVisibility" ref="donationVisibility" options={[{ value: true, label: "Yes" }, { value: false, label: "No" }]} placeholder="Show in donations" onChange={this.donationVisibilitySelected.bind(this)} value={this.state.DonationVisibility} />
                            </div>
                        </div>
                    </div>

                    {
                        this.state.Proposal["Status"] === "Pending" || this.state.Proposal["Status"] === "Approved" ?

                            <div className="col-md-3">
                                <label>Status</label>
                                <div className="form-group" >
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-users" aria-hidden="true"></i>
                                        </span>
                                        <Select className="form-control" name="projectStatus" ref="status" options={this.state.Statuses} placeholder="Status" onChange={this.statusSelected.bind(this)} value={this.state.Status} />
                                    </div>
                                </div>
                            </div>
                            :
                            <br />
                    }


                    {
                        this.state.Proposal["Status"] === "Approved" ?

                            <div className="col-md-3">
                                <label>Matching Grant</label>
                                <div className="form-group" >
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-money" aria-hidden="true"></i>
                                        </span>
                                        <input type="number" min={0} className="form-control" name="matchingGrant" ref="matchingGrant" placeholder="Matching Grant" autoComplete="off" />
                                    </div>
                                </div>
                            </div>
                            :
                            <br />
                    }

                    <div className="col-md-2" style={{ marginTop: "23px" }}>
                        <button type="submit" name="submit" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>Submit</button>
                        <div className="loader"></div>
                    </div>


                    {/*Popup Modal for adding members to the project */}

                    <div id="addMemberModal" className="modal fade" role="dialog" ref="addMemberModal">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <h4 className="modal-title" style={{ display: 'inline-block' }}>Add a member to project</h4>
                                    <hr />
                                    <div className="col-xs-12">
                                        <form name="search-form" id="searchForm" onChange={() => this.setState({ formChanged: 1 })}>
                                            <div className="col-md-3 form-group">
                                                <label>Member Name</label>
                                                <input className="form-control" type="text" name="memberName" ref="memberName" autoComplete="off" />
                                            </div>
                                            <div className="col-md-3 form-group">
                                                <label>Member Email</label>
                                                <input className="form-control" type="text" name="memberEmail" ref="memberEmail" autoComplete="off" />
                                            </div>
                                            <div className="col-md-3 form-group">
                                                <label>Member Phone</label>
                                                <input className="form-control" type="text" name="memberPhone" ref="memberPhone" autoComplete="off" />
                                            </div>

                                            <div className="col-md-3 button-block mtop24">
                                                <input type="button" className="btn btn-success" value="Search" onClick={this.search.bind(this)} />
                                                <input type="button" className="btn btn-default mleft10" value="Clear" onClick={this.clear.bind(this)} />
                                            </div>
                                        </form>
                                    </div>

                                    <BootstrapTable data={this.state.Members} striped hover >
                                        <TableHeaderColumn dataField='label' dataSort={true} >Name</TableHeaderColumn>
                                        <TableHeaderColumn isKey={true} dataField='Email' dataSort={true} >Email</TableHeaderColumn>
                                        <TableHeaderColumn dataField='Phone' dataSort={true}>Phone</TableHeaderColumn>
                                        <TableHeaderColumn dataField='SecondaryPhone' dataSort={true}>Secondary Phone</TableHeaderColumn>
                                        <TableHeaderColumn columnClassName="text-center" dataField='value' dataFormat={this.selectViewFormatter.bind(this)} width='50'></TableHeaderColumn>
                                    </BootstrapTable>

                                </div>
                            </div>
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
                                                    return <li key={ele["Name"]}><a href={ele["Url"]} download>{ele["Name"]}</a></li>
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
                                                                        <table className={"table table-condensed table-bordered view-table " + (ele["ActivityVerified"] ? "" : "hidden")}>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <th>Date</th>
                                                                                    <td>{moment(ele["ActivityCreatedDate"]).format("DD-MM-YYYY")}</td>
                                                                                </tr>
                                                                                <tr>
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
                                        </div>
                                    </div>
                                </div>
                            </div> : <div />
                    }

                    {/* Popup for verification authority  */}

                    {this.state.SelectedPhase ?
                        <div id="verificationAuthorityModal" className="modal fade" role="dialog" ref="verificationAuthorityModal">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        <h4 className="modal-title" style={{ display: 'inline-block' }}>{this.state.SelectedPhase["PhaseName"]}</h4>
                                        <hr />
                                        <div className="col-xs-12">
                                            <div className="col-xs-10">
                                                {
                                                    this.state.ChangeVerificationAuthority || this.state.SelectedPhase["VerifyingAuthorityDesignation"] === null ?

                                                        <div className="col-xs-12">
                                                            <div className="col-xs-6">
                                                                <div className="form-group">
                                                                    <Select className="form-control" name="verAuth" options={this.state.OfficialDesignations} placeholder="Verifying Authority" onChange={this.verifyingAuthorityChange.bind(this)} value={this.state.TemporaryVerificationAuthority} />
                                                                </div>
                                                            </div>

                                                            <div className="col-xs-2">
                                                                <button type="submit" name="submitVerificationAuthority" className="btn btn-primary" onClick={this.verificationAuthoritySubmit.bind(this)}>Submit</button>
                                                                <div className="loader loaderVerificationAuthority"></div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div>
                                                            <label>Verification Authority Name: </label>
                                                            <span className="mleft5">{this.state.SelectedPhase["PhaseVerificationAuthorityName"]}</span>

                                                            <label className="mleft10">Verification Authority Designation: </label>
                                                            <span className="mleft5"> {this.state.SelectedPhase["VerifyingAuthorityDesignation"]["label"]}</span>
                                                            <button type="button" name="button" className={"btn btn-danger mleft10 " + (this.state.SelectedPhase.PhaseCompleted ? "hidden" : "")}
                                                                onClick={() => this.setState({ ChangeVerificationAuthority: true, TemporaryVerificationAuthority: this.state.SelectedPhase["VerifyingAuthorityDesignation"] })}>
                                                                Change
                                                                </button>

                                                        </div>
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <div />
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

    openPhase(phase) {
        this.setState({ SelectedPhase: phase }, () => {
            $("#phaseModal").modal("show");
        });

    }

    memberChanged(val) {
        var assignees = this.state.Assignees;
        assignees.push(val);
        var members = this.state.Members.filter((item) => {
            return item === val ? null : item
        })
        this.setState({ Assignees: assignees, Members: members });
    }

    donationVisibilitySelected(val) {
        this.setState({ DonationVisibility: val });
        if (!val) {
            showErrorsForInput(this.refs.donationVisibility.wrapper, ["Please select a valid option"]);
        }
        else {
            showErrorsForInput(this.refs.donationVisibility.wrapper, []);
        }
    }

    statusSelected(val) {
        this.setState({ Status: val });
        if (val && val.value === "Rejected") {
            this.setState({ DonationVisibility: { value: false, label: "No" } });
        }
        if (!val) {
            showErrorsForInput(this.refs.status.wrapper, ["Please select a valid status"]);
        }
        else {
            showErrorsForInput(this.refs.status.wrapper, []);
        }
    }

    reviewCommentChange(val) {
        this.setState({ ReviewComment: val, ReviewCommentHtml: val.toString('html') });
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

    search() {
        MyAjax(
            ApiUrl + "/api/Projects/GetMembersForProject?ProjectId=" + this.state.ProposalId +
            "&MemberName=" + this.refs.memberName.value.trim() +
            "&MemberEmail=" + this.refs.memberEmail.value.trim() +
            "&MemberPhone=" + this.refs.memberPhone.value.trim(),
            (data) => { this.setState({ Members: data["members"] }); },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        )
    }

    clear() {
        this.refs.memberName.value = "";
        this.refs.memberEmail.value = "";
        this.refs.memberPhone.value = "";
        this.setState({ Members: [] });
    }

    selectViewFormatter(cell, row) {
        if (this.state.MemberAddLoading && this.state.NewMember === row) {
            return <div className="loader visible"></div>
        }
        else {
            return <i className='btn btn-small btn-success pointer fa fa-plus' onClick={() => this.addMember(row)}></i >;
        }
    }

    addMember(row) {
        this.setState({ MemberAddLoading: true, NewMember: row });
        var members = this.state.Members.filter((item) => {
            if (row["value"] !== item["value"]) {
                return item;
            }
        });

        var data = { ProjectId: this.state.ProposalId, MemberId: row["value"] };
        MyAjax(
            ApiUrl + "/api/Projects/AddMemberToProject",
            () => {
                var selectedMembers = this.state.SelectedMembers;
                selectedMembers.push(row);
                this.setState({ Members: members, SelectedMembers: selectedMembers });
                toast(row["label"] + " added successfully", {
                    type: toast.TYPE.SUCCESS
                })
                this.setState({ MemberAddLoading: false });
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
                this.setState({ MemberAddLoading: false });
            },
            "POST",
            data
        )
    }

    removeMember(row) {
        this.setState({ MemberAddLoading: true });
        var selectedMembers = this.state.SelectedMembers.filter((item) => {
            if (row["value"] !== item["value"]) {
                return item;
            }
        });

        var data = { ProjectId: this.state.ProposalId, MemberId: row["value"] };
        MyAjax(
            ApiUrl + "/api/Projects/RemoveMemberFromProject",
            () => {
                var members = this.state.Members;
                members.push(row);
                this.setState({ Members: members, SelectedMembers: selectedMembers });
                toast(row["label"] + " removed successfully", {
                    type: toast.TYPE.SUCCESS
                });
                this.setState({ MemberAddLoading: false });
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                this.setState({ MemberAddLoading: false });
            },
            "POST",
            data
        )

    }

    openVerificationAuthorityModal(row) {
        this.setState({ SelectedPhase: row }, () => {
            $("#verificationAuthorityModal").modal("show");
        });

    }

    verifyingAuthorityChange(val) {
        this.setState({ TemporaryVerificationAuthority: val });
    }

    verificationAuthoritySubmit() {
        if (this.state.SelectedPhase["VerifyingAuthorityDesignation"] === this.state.TemporaryVerificationAuthority) {
            this.setState({ TemporaryVerificationAuthority: null, ChangeVerificationAuthority: false });
            return;
        }

        $(".loaderVerificationAuthority").show();
        $("button[name='submitVerificationAuthority']").hide();

        var data = { PhaseId: this.state.SelectedPhase["PhaseId"] }
        if (this.state.TemporaryVerificationAuthority) {
            data["VerificationAuthorityDesignationId"] = this.state.TemporaryVerificationAuthority["value"]
        }
        else {
            data["VerificationAuthorityDesignationId"] = null;
        }

        MyAjax(
            ApiUrl + "/api/Projects/ChangeVerificationAuthority",
            (data) => {
                var phase = this.state.SelectedPhase;
                phase["PhaseVerificationAuthorityName"] = data["VerificationAuthorityName"];
                phase["VerifyingAuthorityDesignation"] = this.state.TemporaryVerificationAuthority;
                this.setState({ SelectedPhase: phase, ChangeVerificationAuthority: false, TemporaryVerificationAuthority: null });
                toast("Verification authority updated successfully", {
                    type: toast.TYPE.SUCCESS
                });
                $("#verificationAuthorityModal").modal("hide");
                $(".loaderVerificationAuthority").hide();
                $("button[name='submitVerificationAuthority']").show();
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });

                $(".loaderVerificationAuthority").hide();
                $("button[name='submitVerificationAuthority']").show();
            },
            "POST",
            data
        )
    }

}

export default AdminProjectProposal;
