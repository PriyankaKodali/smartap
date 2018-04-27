import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../Config'
import { MyAjax, MyAjaxForAttachments } from '../MyAjax';
import RichTextEditor from 'react-rte';
import { showErrorsForInput, setUnTouched, ValidateForm } from '../ValidateForm';
import  Select  from 'react-select';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

class EditPartnerGrievance extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Grievance: null, Partners: null, Partner: null, Employees: null, Officials: null,
            employees: null, officials: null,
            CanAddNewComment: false, Comment: RichTextEditor.createEmptyValue(), CommentHtml: "",
            Statuses: [{ value: "Open", label: "Open" }, { value: "Close", label: "Close" }],
            Status: { value: "Open", label: "Open" }
        };
    }

    componentWillMount() {
        MyAjax(
            ApiUrl + "/api/PartnerGrievance/GetPartnerGrievance?Id=" + this.props.GrievanceId,
            (data) => {
                this.setState({ Grievance: data["PartnerGrievance"], IsDataAvailable: true });
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
                this.setState({ Grievance: null, IsDataAvailable: true });
            }
        );
        if (this.props.IsApprover) {
            MyAjax(
                ApiUrl + "/api/PartnerGrievance/GetEmployeesAndOfficials?Id=" + this.props.GrievanceId,
                (data) => {
                    this.setState({ Officials: data["officials"], Employees: data["employees"] });
                },
                (error) => {
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                }
            );
            MyAjax(
                ApiUrl + "/api/PartnerGrievance/GetAssignedEmployeesAndOfficials?Id=" + this.props.GrievanceId,
                (data) => {
                    this.setState({ officials: data["officials"], employees: data["employees"] });
                },
                (error) => {
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                }
            );
        }
    }



    render() {
        return (
            this.state.IsDataAvailable ?
                this.state.Grievance ?
                    <div className="col-xs-12">
                        <h3>Partner Grievance<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/partner-grievances") }}>Back</button></span></h3>
                        <div className="col-xs-6 application-details">
                            <table className="table table-condensed table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Partner</th>
                                        <td title={this.state.Grievance["Partner"]}>{this.state.Grievance["Partner"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td title={this.state.Grievance["Status"]}>{this.state.Grievance["Status"]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-xs-6 application-details">
                            <table className="table table-condensed table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Date</th>
                                        <td title={moment(this.state.Grievance["CreatedDate"]).format("DD-MM-YYYY")}>{moment(this.state.Grievance["CreatedDate"]).format("DD-MM-YYYY")}</td>
                                    </tr>
                                    <tr>
                                        <th>Created by</th>
                                        <td title={this.state.Grievance["CreatedBy"]}>{this.state.Grievance["CreatedBy"]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="col-xs-12 application-details">
                            <table className="table table-condensed table-bordered">
                                <tbody>
                                    <tr>
                                        <th style={{ width: "100px" }}>Subject</th>
                                        <td className="td-visible">{this.state.Grievance["Subject"]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-xs-12 application-details">
                            <table className="table table-condensed table-bordered">
                                <tbody>
                                    <tr>
                                        <th style={{ width: "100px" }}>Description</th>
                                        <td className="td-visible">{this.state.Grievance["Description"]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="application-comments mbot10">
                            <h4>Comments</h4>
                            <BootstrapTable data={this.state.Grievance["Comments"]} striped hover>
                                <TableHeaderColumn dataField='CommentDate' isKey={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY hh:mm")} width='130'>Time</TableHeaderColumn>
                                <TableHeaderColumn dataField='CommentBy' width='300'>Created By</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="text-justify" dataField='Comment' dataFormat={this.richTextFormatter.bind(this)} >Comment</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="text-center" dataField='AttachmentURL' dataFormat={this.attachmentFormatter.bind(this)} width="30"></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                        {
                            this.state.Grievance["Status"] == "Open" && this.props.IsApprover ?
                                <div>
                                    <div className="col-xs-12 col-md-6">
                                        <label>Assign Employees</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-flag " aria-hidden="true"></i>
                                                </span>
                                                <Select className="employees form-control" name="employees" options={this.state.Employees} placeholder="Assign Employees" onChange={this.employeesChange.bind(this)} ref="employees" multi={true} value={this.state.employees} />
                                            </div>
                                        </div>
                                    </div> <div className="col-xs-12 col-md-6">
                                        <label>Assign Officials</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-flag " aria-hidden="true"></i>
                                                </span>
                                                <Select className="officials form-control" name="officials" options={this.state.Officials} placeholder="Assign Officials" onChange={this.officialsChange.bind(this)} ref="officials" multi={true} value={this.state.officials} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xs-12 text-center">
                                        <button type="button" name="submitAssignees" className="btn btn-primary" onClick={this._handleAssigneesSubmit.bind(this)} value="Submit" >Submit</button>
                                        <div className="loader loaderAssignees" ></div>
                                    </div>
                                </div>
                                :
                                <div />
                        }
                        <div className="clearfix"></div>
                        {
                            this.state.Grievance["Status"] == "Open" && !this.props.IsApprover ?
                                <section className="new-comment" style={{ marginTop: "20px" }}>
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            <h4>Add Comment</h4>
                                        </div>
                                        <div className="panel-body">

                                            <div className="col-xs-12">
                                                <label>Comment</label>
                                                <div className="form-group" style={{ height: "auto" }}>
                                                    <RichTextEditor name="comment" id="comment" key="comment" value={this.state.Comment} onChange={this.commentBoxChange.bind(this)} />
                                                    <input hidden ref="comment" name="forErrorShowing" />
                                                </div>
                                            </div>

                                            <div className="col-xs-12 col-sm-7">
                                                <label>Attachment</label>
                                                <div className="form-group" >
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                        </span>
                                                        <input type="file" className="form-control" name="file" ref="file" />
                                                    </div>
                                                </div>
                                            </div>

                                            {
                                                this.props.IsAdmin ? <div className="col-xs-12 col-sm-3">
                                                    <label>Status</label>
                                                    <div className="form-group" >
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-flag " aria-hidden="true"></i>
                                                            </span>
                                                            <Select className="status form-control" name="status" options={this.state.Statuses} placeholder="Status" onChange={this.statusChange.bind(this)} ref="status" value={this.state.Status} />
                                                        </div>
                                                    </div>
                                                </div>
                                                    :
                                                    <div />
                                            }


                                            <div className="col-sm-1 col-xs-6 text-center">
                                                <button type="button" name="submitComment" className="btn btn-primary" onClick={this._handleCommentSubmit.bind(this)} value="Submit" style={{ "marginTop": "23px" }} >Submit</button>
                                                <div className="loader loaderComment" style={{ marginTop: "28px" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                :
                                <div />
                        }

                    </div>
                    :
                    <div className="col-xs-12">
                        An Error occoured!
                    </div>
                :
                <div className="loader visible">
                </div>
        );
    }

    richTextFormatter(cell, row) {
        return <RichTextEditor className="readOnly" readOnly={true} value={RichTextEditor.createValueFromString(cell, 'html')} />
    }

    attachmentFormatter(cell, row) {
        if (cell)
            return <a href={cell} download className="pointer"><span className="fa fa-paperclip"></span> </a>
    }

    commentBoxChange(val) {
        this.setState({ Comment: val, CommentHtml: val.toString('html') });
    }

    statusChange(val) {
        this.setState({ Status: val });
        if (!val) {
            showErrorsForInput(this.refs.status.wrapper, ["Please select a valid status"]);
        }
        else {
            showErrorsForInput(this.refs.status.wrapper, null);
        }
    }

    employeesChange(val) {
        this.setState({ employees: val });
    }

    officialsChange(val) {
        this.setState({ officials: val });
    }

    _handleAssigneesSubmit(e) {
        e.preventDefault();
        if (this.state.officials.length == 0 && this.state.employees.length == 0) {
            showErrorsForInput(this.refs.employees.wrapper, ["Please select either an Employee or Official"]);
            return;
        }

        $(".loaderAssignees").show();
        $("button[name='submitAssignees']").hide();

        var employees = this.state.employees.map((x) => { return x.value });
        var officials = this.state.officials.map((x) => { return x.value });

        var formData = new FormData();
        formData.append("employees", JSON.stringify(employees));
        formData.append("officials", JSON.stringify(officials));
        formData.append("grievanceId", this.props.GrievanceId);

        var url = ApiUrl + "/api/PartnerGrievance/AssignEmployeesAndOfficials"

        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Employees/Officials Assigned successfully!", {
                    type: toast.TYPE.SUCCESS
                });
                $(".loaderAssignees").hide();
                $("button[name='submitAssignees']").show();
                this.props.history.push("/partner-grievances");
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".loaderAssignees").hide();
                $("button[name='submitAssignees']").show();
            },
            "POST", formData
        );
    }

    _handleCommentSubmit(e) {
        e.preventDefault();
        toast.dismiss();
        var Status = this.props.IsPartner ? null : this.state.Status;
        var Comment = this.state.CommentHtml;
        var file = this.refs.file.files;

        if (!this.state.Comment.getEditorState().getCurrentContent().hasText()) {
            showErrorsForInput(this.refs.comment, ["Please enter a comment"]);
            return;
        }
        else {
            showErrorsForInput(this.refs.comment, []);
        }

        if (!this.props.IsPartner && Status === null) {
            showErrorsForInput(this.refs.status.wrapper, ["Please select a valid status"]);
            return;
        }

        var formData = new FormData();
        formData.append("grievanceId", this.props.GrievanceId);
        if (!this.props.IsPartner) {
            formData.append("Status", Status.value);
        }
        formData.append("Comment", Comment);

        if (file.length === 1) {
            if ($.inArray(this.refs.file.value.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png", "gif", "doc", "docx", "pdf", "txt"]) === -1) {
                showErrorsForInput(this.refs.file, ["Supported formats : jpg | jpeg | png | gif | doc | docx | pdf | txt"]);
                return;
            }
            formData.append("Attachment", file[0]);
        }

        $(".loaderComment").show();
        $("button[name='submitComment']").hide();

        var url = ApiUrl + "/api/PartnerGrievance/AddCommentToPartnerGrievance"

        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Comment added succesfully!", {
                    type: toast.TYPE.SUCCESS
                });
                $(".loaderComment").hide();
                $("button[name='submitComment']").show();
                this.props.history.push("/partner-grievances");
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".loaderComment").hide();
                $("button[name='submitComment']").show();
            },
            "POST", formData
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

export default EditPartnerGrievance;
