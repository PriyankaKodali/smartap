import React, { Component } from 'react';
import { showErrorsForInput } from '../../ValidateForm';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl } from '../../Config';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import RichTextEditor from 'react-rte';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import Select from 'react-select';
var moment = require('moment');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;



class AdoptionApplication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Application_Id: null, Application: null, ApplicationInternalStatus: "Closed",
            Statuses: [], Status: null, CanAddNewComment: false, Comment: RichTextEditor.createEmptyValue(), CommentHtml: ""
            , PopupComment: RichTextEditor.createEmptyValue(), PopupCommentHtml: "", Adoption: null, IsAdoptionDataAvailable: false,
            AdoptionActivity: {}, ActivityImages: []
        };
    }

    componentWillMount() {
        this.setState({ Application_Id: this.props.match.params["id"] }, () => {
            var roles = sessionStorage.getItem("smart_ap_roles");
            var url = ApiUrl + "/api/Official/GetApplication?Id=" + this.state.Application_Id;
            MyAjax(
                url,
                (data) => this.setState({ Application: data["application"], ApplicationInternalStatus: data["application"]["InternalStatus"] }, () => {
                    if (this.state.Application["InternalStatus"] === "Closed") {
                        this.setState({ CanAddNewComment: false });
                        //get Activity Images if user is sapf employee
                        if (roles.indexOf("Employee") !== -1) {
                            MyAjax(
                                ApiUrl + "/api/Partner/GetAdoption?Id=" + this.state.Application_Id,
                                (data) => {
                                    this.setState({ Adoption: data["adoption"], IsAdoptionDataAvailable: true });
                                },
                                (error) => {
                                    toast(error.responseText, {
                                        type: toast.TYPE.ERROR
                                    });
                                    this.setState({ IsAdoptionDataAvailable: true });
                                },
                                "GET",
                                null
                            );
                        }
                    }
                    else {
                        if (roles.indexOf("CPO") !== -1 && this.state.Application["Status_Id"] === 2 && this.state.Application["Area"] === "Rural") {
                            this.setState({ Statuses: [{ value: "Forward", label: "Forward to MPDO" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                        }
                        else if (roles.indexOf("CPO") !== -1 && this.state.Application["Status_Id"] === 2 && this.state.Application["Area"] === "Urban") {
                            this.setState({ Statuses: [{ value: "Forward", label: "Forward to Commissioner" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                        }
                        else if ((roles.indexOf("MPDO") !== -1 || roles.indexOf("MO") !== -1 || roles.indexOf("CPO") !== -1) && this.state.Application["Status_Id"] === 3) {
                            this.setState({ Statuses: [{ value: "Approve", label: "Approve" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                        }
                        else if (roles.indexOf("CPO") !== -1 && this.state.Application["Status_Id"] === 4 && this.state.Application["Area"] === "Rural") {
                            this.setState({ Statuses: [{ value: "Approve", label: "Approve" }, { value: "Forward", label: "Forward to MPDO" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                        }
                        else if (roles.indexOf("CPO") !== -1 && this.state.Application["Status_Id"] === 4 && this.state.Application["Area"] === "Urban") {
                            this.setState({ Statuses: [{ value: "Approve", label: "Approve" }, { value: "Forward", label: "Forward to Commissioner" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                        }
                        else if (roles.indexOf("Admin") !== -1 && roles.indexOf("Approver") === -1 && this.state.Application["Status_Id"] === 1) {
                            this.setState({ Statuses: [{ value: "Forward", label: "Forward to CPO" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                        }
                        //Check approver after admin (Approver has additional privilege than admin)
                        else if (roles.indexOf("Approver") !== -1 && this.state.Application["Status_Id"] === 1) {
                            this.setState({ Statuses: [{ value: "Approve", label: "Approve" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                        }
                    }

                }),
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                }),
                "GET",
                null
            );

        });
    }

    componentWillUnmount() {
        $(".modal").modal("hide");
    }

    commentBoxChange(val) {
        this.setState({ Comment: val, CommentHtml: val.toString('html') });
    }

    popupCommentBoxChange(val) {
        this.setState({ PopupComment: val, PopupCommentHtml: val.toString('html') });
    }

    render() {
        if (this.state.Application) {
            return (
                <div className="col-xs-12">
                    <h2>Partnership Application<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/adoption-applications") }}>Back</button></span></h2>
                    <section className="application-details row">
                        <div className="col-md-6 col-xs-12 ">
                            <table className="table table-condensed table-bordered">
                                <tbody>
                                    <tr>
                                        <th>Partner</th>
                                        <td><a className="pointer" onClick={() => this.props.history.push("/admin/partner-details/" + this.state.Application["Partner_Id"])}>{this.state.Application["PartnerName"]}</a></td>
                                    </tr>
                                    <tr>
                                        <th>Partner Email</th>
                                        <td>{this.state.Application["PartnerEmail"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Partner Phone</th>
                                        <td>{this.state.Application["PartnerPrimaryPhone"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Secondary Phone</th>
                                        <td>{this.state.Application["PartnerSecondaryPhone"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td>{this.state.Application["Status"]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-6 col-xs-12">
                            <table className="table table-condensed table-bordered">
                                <tbody>
                                    <tr onMouseDown={(e) => this.changePartnerType(e)} >
                                        <th>Type</th>
                                        <td>{this.state.Application["Type"]}</td>
                                    </tr>
                                    <tr>
                                        <th>District</th>
                                        <td>{this.state.Application["District"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Mandal/Municipality</th>
                                        <td>{this.state.Application["MandalMunicipality"]}</td>
                                    </tr>
                                    <tr>
                                        <th>Panchayath/Ward</th>
                                        <td><strong>{this.state.Application["PanchayatWard"]}</strong></td>
                                    </tr>
                                    <tr>
                                        <th>Financial Support</th>
                                        <td>-</td>
                                        {/*<td>{this.state.Application["FinancialSupport"]}</td>*/}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {this.state.Application["Representative_Id"] !== null ?
                            <div className="col-xs-12">
                                <h4>Representative Details</h4>
                                <table className="table table-condensed table-bordered">
                                    <tbody>
                                        <tr>
                                            <th>Name</th>
                                            <td>{this.state.Application["Representative"]}</td>
                                        </tr>
                                        <tr>
                                            <th>Phone</th>
                                            <td>{this.state.Application["RepresentativePrimaryPhone"]}</td>
                                        </tr>
                                        <tr>
                                            <th>Secondary Phone</th>
                                            <td>{this.state.Application["RepresentativeSecondaryPhone"]}</td>
                                        </tr>
                                        <tr>
                                            <th>Email</th>
                                            <td>{this.state.Application["RepresentativeEmail"]}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div> : <div />
                        }
                        {/* <div className="partner-type-menu" style={{ display: "none" }}>Hello</div> */}
                    </section>
                    <section className="application-comments mbot10">
                        <h4>Comments</h4>

                        <BootstrapTable data={this.state.Application["Comments"]} striped hover>
                            <TableHeaderColumn dataField='CreatedTime' isKey={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY hh:mm")} width='130'>Time</TableHeaderColumn>
                            <TableHeaderColumn dataField='Status' width='230' dataFormat={this.statusFormatter.bind(this)}>Status</TableHeaderColumn>
                            <TableHeaderColumn dataField='CreatedBy' width='300'>Created By</TableHeaderColumn>
                            <TableHeaderColumn columnClassName="text-justify" dataField='Comment' dataFormat={this.richTextFormatter.bind(this)} >Comment</TableHeaderColumn>
                            <TableHeaderColumn columnClassName="text-center" dataField='AttachmentURL' dataFormat={this.attachmentFormatter.bind(this)} width="30"></TableHeaderColumn>
                        </BootstrapTable>

                    </section>
                    {
                        sessionStorage.getItem("smart_ap_roles").indexOf("Employee") !== -1
                            && this.state.Application["InternalStatus"] === "Closed"
                            && this.state.IsAdoptionDataAvailable ?
                            <section>
                                <h4 className="">Activities</h4>
                                <div className="clearfix"></div>
                                <BootstrapTable data={this.state.Adoption["Activities"]} striped hover>
                                    <TableHeaderColumn dataField='ActivityDate' isKey={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='130'>Date</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Title'>Title</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Description'>Description</TableHeaderColumn>
                                    <TableHeaderColumn columnClassName="text-center" dataField='Id' width="40" dataFormat={this.activityImagesFormatter.bind(this)}></TableHeaderColumn>
                                </BootstrapTable>

                                <div id="activityModal" className="modal fade" role="dialog" ref="commentModal">
                                    <div className="modal-dialog modal-lg">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                <h4 className="modal-title" style={{ display: 'inline-block' }}> {this.state.AdoptionActivity["Title"]}</h4>
                                            </div>
                                            <div className="modal-body">
                                                <label>Date:</label><span className="mleft5"> {moment(this.state.AdoptionActivity["ActivityDate"]).format("DD-MM-YYYY")}</span>
                                                <div className="clearfix"></div>
                                                <label>Description:</label><span className="mleft5">{this.state.AdoptionActivity["Description"]}</span>

                                                {this.state.ActivityImages.length > 0 ?
                                                    <ImageGallery
                                                        items={this.state.ActivityImages}
                                                        slideInterval={2000}
                                                        showFullscreenButton={false}
                                                        autoPlay={true} />
                                                    :
                                                    <div>No Activity Images Available!</div>
                                                }
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                    </div>
                                </div>

                            </section>
                            :
                            <div />
                    }
                    {
                        this.state.CanAddNewComment ?
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

                                        <div className="col-xs-12 col-sm-3">
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

                                        <div className="col-sm-1 col-xs-12 text-center">
                                            <button type="button" name="submitComment" className="btn btn-primary" onClick={this._handleCommentSubmit.bind(this)} value="Submit" style={{ "marginTop": "23px" }} >Submit</button>
                                            <div className="loader loaderComment" style={{ marginTop: "28px" }}></div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            :
                            sessionStorage.getItem("smart_ap_roles").indexOf("CPO") !== -1 || sessionStorage.getItem("smart_ap_roles").indexOf("Approver") !== -1 ?
                                this.state.Application["Status_Id"] === 5 ?
                                    <div className="col-xs-12 text-center"><button className="btn btn-danger" onClick={() => $("#commentModal").modal("toggle")}>Terminate</button></div>
                                    :
                                    this.state.Application["Status_Id"] === 8 ?
                                        <div className="col-xs-12 text-center"><button className="btn btn-success" onClick={() => $("#commentModal").modal("toggle")}>Revoke</button></div>
                                        :
                                        <div />
                                :
                                <div />
                    }




                    <div id="commentModal" className="modal fade" role="dialog" ref="commentModal">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <h4 className="modal-title" style={{ display: 'inline-block' }}> {this.state.Application["Status_Id"] === 5 ? "Terminate Partnership" : "Revoke Partnership"}</h4>
                                </div>
                                <div className="modal-body">

                                    <div className="col-xs-12">
                                        <label>Comment</label>
                                        <div className="form-group" style={{ height: "auto" }}>
                                            <RichTextEditor name="popupComment" id="popupComment" key="popupComment" value={this.state.PopupComment} onChange={this.popupCommentBoxChange.bind(this)} />
                                            <input hidden ref="popupComment" name="forErrorShowing" />
                                        </div>
                                    </div>

                                    <div className="col-xs-12 col-sm-3">
                                        <label>Status</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-flag " aria-hidden="true"></i>
                                                </span>
                                                {this.state.Application["Status_Id"] === 5 ?
                                                    <Select className="status form-control" name="status" placeholder="Status" ref="status" value={{ label: "Terminate", value: "Terminate" }} disabled={true} />
                                                    :
                                                    <Select className="status form-control" name="status" placeholder="Status" ref="status" value={{ label: "Revoke", value: "Revoke" }} disabled={true} />
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xs-12 col-sm-7">
                                        <label>Attachment</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                </span>
                                                <input type="file" className="form-control" name="file" ref="modalFile" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-sm-1 col-xs-12 text-center">
                                        {
                                            this.state.Application["Status_Id"] === 5 ?
                                                <button type="button" name="submitComment" className="btn btn-danger" onClick={this._handleTerminateSubmit.bind(this)} value="Submit" style={{ "marginTop": "23px" }} >Submit</button>
                                                :
                                                <button type="button" name="submitComment" className="btn btn-success" onClick={this._handleRevokeSubmit.bind(this)} value="Submit" style={{ "marginTop": "23px" }} >Submit</button>
                                        }
                                        <div className="loader loaderComment" style={{ marginTop: "28px" }}></div>
                                    </div>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
                    <div className="mbot10"></div>
                </div>
            );
        }
        else {
            return (
                <div className="loader visible"></div>
            );
        }
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

    _handleCommentSubmit(e) {
        e.preventDefault();
        toast.dismiss();
        var Status = this.state.Status;
        var Comment = this.state.CommentHtml;
        var file = this.refs.file.files;

        if (!this.state.Comment.getEditorState().getCurrentContent().hasText()) {
            showErrorsForInput(this.refs.comment, ["Please enter a comment"]);
            return;
        }
        else {
            showErrorsForInput(this.refs.comment, []);
        }

        if (Status === null) {
            showErrorsForInput(this.refs.status.wrapper, ["Please select a valid status"]);
            return;
        }

        var formData = new FormData();
        formData.append("Adoption_Id", this.state.Application["Id"]);
        formData.append("Status", Status.value);
        formData.append("Comment", Comment);

        if (file.length === 1) {
            if ($.inArray(this.refs.file.value.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png", "gif", "doc", "docx", "pdf", "txt"]) === -1) {
                showErrorsForInput(this.refs.file, ["Supported formats : jpg | jpeg | png | gif | doc | docx | pdf | txt"]);
                return;
            }
            showErrorsForInput(this.refs.file, []);
            formData.append("Attachment", file[0]);
        }

        $(".loaderComment").show();
        $("button[name='submitComment']").hide();

        var url = ApiUrl + "/api/Official/PostComment"

        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Comment added succesfully!", {
                    type: toast.TYPE.SUCCESS
                });

                $(".loaderComment").hide();
                $("button[name='submitComment']").show();

                this.setState({ Application: data["application"], ApplicationInternalStatus: data["application"]["InternalStatus"], CanAddNewComment: false }, () => {
                    var roles = sessionStorage.getItem("smart_ap_roles");

                    if (roles.indexOf("CPO") !== -1 && this.state.Application["Status_Id"] === 2 && this.state.Application["Area"] === "Rural") {
                        this.setState({ Statuses: [{ value: "Forward", label: "Forward to MPDO" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                    }
                    else if (roles.indexOf("CPO") !== -1 && this.state.Application["Status_Id"] === 2 && this.state.Application["Area"] === "Urban") {
                        this.setState({ Statuses: [{ value: "Forward", label: "Forward to Commissioner" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                    }
                    else if (roles.indexOf("MPDO") !== -1 || roles.indexOf("MO") !== -1 && this.state.Application["Status_Id"] === 3) {
                        this.setState({ Statuses: [{ value: "Approve", label: "Approve" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                    }
                    else if (roles.indexOf("CPO") !== -1 && this.state.Application["Status_Id"] === 4 && this.state.Application["Area"] === "Rural") {
                        this.setState({ Statuses: [{ value: "Approve", label: "Approve" }, { value: "Forward", label: "Forward to MPDO" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                    }
                    else if (roles.indexOf("CPO") !== -1 && this.state.Application["Status_Id"] === 4 && this.state.Application["Area"] === "Urban") {
                        this.setState({ Statuses: [{ value: "Approve", label: "Approve" }, { value: "Forward", label: "Forward to Commissioner" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                    }
                    else if (roles.indexOf("Admin") !== -1 && roles.indexOf("Approver") === -1 && this.state.Application["Status_Id"] === 1) {
                        this.setState({ Statuses: [{ value: "Forward", label: "Forward to CPO" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                    }
                    //Check approver after admin (Approver has additional privilege than admin)
                    else if (roles.indexOf("Approver") !== -1 && this.state.Application["Status_Id"] === 1) {
                        this.setState({ Statuses: [{ value: "Approve", label: "Approve" }, { value: "Reject", label: "Reject" }], CanAddNewComment: true });
                    }
                })

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

    _handleTerminateSubmit(e) {
        e.preventDefault();
        toast.dismiss();
        if (!window.confirm("Do you want to terminate the partnership")) {
            return;
        }
        var Comment = this.state.PopupCommentHtml;
        var file = this.refs.modalFile.files;

        if (!this.state.PopupComment.getEditorState().getCurrentContent().hasText()) {
            showErrorsForInput(this.refs.popupComment, ["Please enter a comment"]);
            return;
        }
        else {
            showErrorsForInput(this.refs.popupComment, []);
        }

        var formData = new FormData();
        formData.append("Adoption_Id", this.state.Application["Id"]);
        formData.append("Status", "Terminate");
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

        var url = ApiUrl + "/api/Official/PostComment"

        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Partnership terminated successfully!", {
                    type: toast.TYPE.SUCCESS
                });

                $(".loaderComment").hide();
                $("button[name='submitComment']").show();

                $("#commentModal").modal("hide");
                this.props.history.push("/admin/adoption-applications");

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

    _handleRevokeSubmit(e) {
        e.preventDefault();
        toast.dismiss();
        if (!window.confirm("Do you want to revoke the partnership")) {
            return;
        }
        var Comment = this.state.PopupCommentHtml;
        var file = this.refs.modalFile.files;

        if (!this.state.PopupComment.getEditorState().getCurrentContent().hasText()) {
            showErrorsForInput(this.refs.popupComment, ["Please enter a comment"]);
            return;
        }
        else {
            showErrorsForInput(this.refs.popupComment, []);
        }

        var formData = new FormData();
        formData.append("Adoption_Id", this.state.Application["Id"]);
        formData.append("Status", "Revoke");
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

        var url = ApiUrl + "/api/Official/PostComment"

        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Partnership revoked successfully!", {
                    type: toast.TYPE.SUCCESS
                });

                $(".loaderComment").hide();
                $("button[name='submitComment']").show();

                $("#commentModal").modal("hide");

                this.props.history.push("/admin/adoption-applications");
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

    richTextFormatter(cell, row) {
        return <RichTextEditor className="readOnly" readOnly={true} value={RichTextEditor.createValueFromString(cell, 'html')} />
    }

    attachmentFormatter(cell, row) {
        if (cell)
            return <a href={cell} download className="pointer"><span className="fa fa-paperclip"></span> </a>
    }

    statusFormatter(cell, row) {
        // if(cell==="MPDO Review" && this.state.Application["Area"]==="Urban"){
        //     return "Commissioner Review";
        // }
        // else{
        return cell;
        // }
    }

    changePartnerType(e) {
        //     e.preventDefault();
        //     var isRightMB = false;
        //     if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        //         isRightMB = e.which == 3;
        //     else if ("button" in e)  // IE, Opera 
        //         isRightMB = e.button == 2;
        //     if (isRightMB) {
        //         $(".partner-type-menu").show();
        //     }
    }

    activityImagesFormatter(cell, row) {
        return <a className="pointer"><span className="fa fa-eye" onClick={() => this.showActivityModal(row)}></span> </a>
    }

    showActivityModal(row) {
        var images = [];
        row["Attachments"].forEach(image => {
            images.push(
                {
                    original: image["URL"],
                    thumbnail: image["URL"],
                    description: row["Title"]
                }
            );
        });
        this.setState({ AdoptionActivity: row, ActivityImages: images }, () => { $("#activityModal").modal("show") })
    }
}

export default AdoptionApplication;


