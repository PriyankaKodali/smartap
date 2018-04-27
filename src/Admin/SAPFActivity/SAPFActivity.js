import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import { ApiUrl } from '../../Config';
import { showErrorsForInput } from '../../ValidateForm';
import { EditSAPFActivity } from './EditSAPFActivity'
import Select from 'react-select';
var moment = require('moment');



class SAPFActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Title: null, Description: null, CreatedBy: null,
            IsDataAvailable: false, Tags: [], SelectedTags: [], ActivityId: null
        };
    }

    componentWillMount() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
        this.setState({ ActivityId: this.props.match.params["id"] }, () => {
            this.setState({ IsDataAvailable: true });
            MyAjax(
                ApiUrl + "/api/MasterData/GetAllTags",
                (data) => { this.setState({ Tags: data["tags"] }) },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            );
        });
    }


    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }




    componentWillUnmount() {
        $(".modal").modal("hide");
    }

    handleModelChange(model) {
        this.setState({ HtmlContent: model });
    }

    render() {
        return (
            this.state.IsDataAvailable ?
                this.state.ActivityId ?
                    <EditSAPFActivity history={this.props.history} ActivityId={this.state.ActivityId} update={() => this.forceUpdate()} />
                    :
                    < div className="col-xs-12" >
                        <h2>SAPF Activity<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/sapf-activities") }}>Back</button></span></h2>
                        <hr />
                        {
                            this.state.CreatedBy ?
                                <div className="col-xs-12">
                                    <p className="mtop0 f18"><label>Created By : </label> <span>{this.state.CreatedBy}</span> <label className="mleft5">Created Date : </label> <span>{this.state.CreatedDate}</span></p>
                                </div>
                                :
                                <div />
                        }

                        <div className="col-md-12">
                            <label>Title</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" name="title" ref="title" placeholder="Title" autoComplete="off" defaultValue={this.state.Title} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <label>Tags</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-tags" aria-hidden="true"></i>
                                    </span>
                                    <Select className="tags form-control" name="tags" options={this.state.Tags} placeholder="Tags" onChange={this.tagsChange.bind(this)} ref="tags" value={this.state.SelectedTags} multi={true} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label>Activity Date</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-calendar" aria-hidden="true"></i>
                                    </span>
                                    <input type="text" className="date form-control" name="activityDate" ref="activityDate" placeholder="Activity Date" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <label>Activity Images</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-paperclip" aria-hidden="true"></i>
                                    </span>
                                    <input type="file" multiple accept="image/*" className="form-control" name="file" ref="file" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <label>Description</label>
                            <div className="form-group form-group-textarea" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </span>
                                    <textarea className="form-control" name="description" type="text" ref="description" style={{ resize: "vertical" }} placeholder="Description" defaultValue={this.state.Description}></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12 text-center form-group">
                            <button type="button" name="submit" className="btn btn-primary" onClick={this.submitSAPFActivity.bind(this)}>Submit</button>
                            <div className="loader"></div>
                        </div>

                    </div >
                :
                <div className="loader visible"></div>
        )
    }

    submitSAPFActivity(e) {
        e.preventDefault();

        if (!this.validate(e)) {
            return;
        }

        $(".loader").show();
        $("button[name='submit']").hide();

        var title = this.refs.title.value.trim();
        var description = this.refs.description.value.trim();
        var activityDate = this.refs.activityDate.value.trim();
        var files = this.refs.file.files;
        var tags = this.state.SelectedTags.map((item) => { return item.label }).join('|');

        var formData = new FormData();
        formData.append("title", title);
        formData.append("activityDate", activityDate);
        formData.append("description", description);
        formData.append("tags", tags);
        for (var i = 0; i < files.length; i++) {
            formData.append(files[i].name, files[i]);
        }

        var url = ApiUrl + "/api/Images/AddNewSAPFActivity";
        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Activity uploaded successfully", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/admin/sapf-activities");
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
        var files = this.refs.file.files;

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

        if (activityDate.length === 0) {
            if (isSubmit) {
                this.refs.activityDate.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.activityDate, ["Please enter a date"]);
            success = false;
        }
        else if (moment(activityDate, "DD/MM/YYYY").isAfter(moment().add(1))) {
            showErrorsForInput(this.refs.activityDate, ["Please enter a valid date"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.activityDate, []);
        }


        if (files.length === 0) {
            showErrorsForInput(this.refs.file, ["Please select atleast one image!"]);
            success = false;
        }
        else {
            for (var i = 0; i < files.length; i++) {
                if ($.inArray(files[i].name.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png"]) === -1) {
                    showErrorsForInput(this.refs.file, ["Supported formats : jpg | jpeg | png"]);
                    success = false;
                }
            }
            showErrorsForInput(this.refs.file, []);
        }



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

    tagsChange(val) {
        this.setState({ SelectedTags: val });
    }


}

export default SAPFActivity;


