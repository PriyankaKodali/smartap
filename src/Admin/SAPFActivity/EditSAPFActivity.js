import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import { ApiUrl } from '../../Config';
import { showErrorsForInput } from '../../ValidateForm';
import Select from 'react-select';
var moment = require('moment');



class EditSAPFActivity extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Title: null, Description: null, CreatedBy: null, Images: [], ActivityDate: null,
            IsDataAvailable: false, Tags: [], SelectedTags: [], ActivityId: this.props.ActivityId, SelectedImage: {}
        };
    }

    componentWillMount() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
        MyAjax(
            ApiUrl + "/api/Images/GetSAPFActivity?Id=" + this.state.ActivityId,
            (data) => {
                if (data["activity"] === null) {
                    this.props.history.push("/admin/sapf-activities");
                    return;
                }
                this.setState({
                    Id: data["activity"]["Id"],
                    Title: data["activity"]["Title"],
                    CreatedBy: data["activity"]["CreatedBy"],
                    ActivityDate: moment(data["activity"]["ActivityDate"]).format("DD-MM-YY"),
                    Description: data["activity"]["Description"],
                    Images: data["activity"]["Images"],
                    IsDataAvailable: true
                }, () => {
                    var tagsArray = data["activity"]["Tags"].split('|');
                    var selectedTags = tagsArray.filter((item) => {
                        if (item != "SAPF") { return true; }
                        return false;
                    }).map((item) => {
                        return { "label": item, "value": item }
                    })
                    this.setState({ SelectedTags: selectedTags });
                })
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        );

        MyAjax(
            ApiUrl + "/api/MasterData/GetAllTags",
            (data) => { this.setState({ Tags: data["tags"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        );
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    componentWillReceiveProps(nextProps) {
        MyAjax(
            ApiUrl + "/api/Images/GetSAPFActivity?Id=" + this.state.ActivityId,
            (data) => {
                if (data["activity"] === null) {
                    this.props.history.push("/admin/sapf-activities");
                    return;
                }
                this.setState({
                    Id: data["activity"]["Id"],
                    Title: data["activity"]["Title"],
                    CreatedBy: data["activity"]["CreatedBy"],
                    ActivityDate: moment(data["activity"]["ActivityDate"]).format("DD-MM-YY"),
                    Description: data["activity"]["Description"],
                    Images: data["activity"]["Images"],
                    IsDataAvailable: true
                }, () => {
                    var tagsArray = data["activity"]["Tags"].split('|');
                    var selectedTags = tagsArray.map((item) => {
                        if (item == "SAPF") {
                            return;
                        }
                        return { "label": item, "value": item }
                    })
                    this.setState({ SelectedTags: selectedTags });
                })
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        );
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
                <div className="col-xs-12">
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
                                <input type="text" className="date form-control" name="activityDate" ref="activityDate" placeholder="Activity Date" defaultValue={this.state.ActivityDate} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label>Activity Images</label>
                        <div className="form-group" >
                            {
                                this.state.Images.map((item, i) => {
                                    return <div key={"image" + i} className="btn btn-default mleft5" onClick={() => this.imageClick(item)}>Image {i + 1}</div>
                                })
                            }
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

                    <div className="col-xs-12 text-center form-group btn-grp">
                        <button type="button" name="submit" className="btn btn-primary" onClick={this.submitActivity.bind(this)}>Submit</button>
                        <button type="button" name="delete" className="btn btn-danger mleft5" onClick={this.deleteActivity.bind(this)}>Delete</button>
                        <div className="loader"></div>
                    </div>

                    <div id="imageModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title">Activity Image</h4>
                                </div>
                                <div className="modal-body">
                                    <img src={this.state.SelectedImage.URL} width="100%" alt="" />
                                </div>
                                <div className="modal-footer">
                                    {/* <button type="button" className="btn btn-danger" onClick={this.deleteImage.bind(this)}>Delete</button>
                                    <button type="button" className="btn btn-info">Edit</button> */}
                                    <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                :
                <div className="loader visible"></div>
        )
    }

    submitActivity(e) {
        e.preventDefault();

        if (!this.validate(e)) {
            return;
        }

        $(".loader").show();
        $(".btn-grp button").hide();

        var title = this.refs.title.value.trim();
        var description = this.refs.description.value.trim();
        var activityDate = this.refs.activityDate.value.trim();
        var tags = this.state.SelectedTags.filter((item) => {
            if (item !== undefined) { return true; }
            return false;
        }).map((item) => { return item.label }).join('|');

        var formData = new FormData();
        formData.append("Id", this.state.ActivityId);
        formData.append("title", title);
        formData.append("activityDate", activityDate);
        formData.append("description", description);
        formData.append("tags", tags);
        var url = ApiUrl + "/api/Images/EditSAPFActivity";
        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Activity Edited successfully", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/admin/sapf-activities");
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".loader").hide();
                $(".btn-grp button").show();
            },
            "POST",
            formData
        );
    }

    deleteActivity(e) {
        e.preventDefault();

        $(".loader").show();
        $(".btn-grp button").hide();

        var url = ApiUrl + "/api/Images/DeleteSAPFActivity?Id=" + this.state.ActivityId;
        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Activity deleted successfully", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/admin/sapf-activities");
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".loader").hide();
                $(".btn-grp button").show();
            },
            "GET",
            null
        );
    }

    validate(e) {
        var isSubmit = e.type === "submit";
        var success = true;
        var title = this.refs.title.value.trim();
        var description = this.refs.description.value.trim();
        var activityDate = this.refs.activityDate.value.trim();

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
        else if (moment(activityDate).isAfter(moment().add(1))) {
            showErrorsForInput(this.refs.activityDate, ["Please enter a valid date"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.activityDate, []);
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

    imageClick(item) {
        this.setState({ SelectedImage: item }, () => {
            // $("#imageModal").modal({ backdrop: 'static', keyboard: false })
            $("#imageModal").modal("show");
        });
    }

    deleteImage() {
        MyAjax(
            ApiUrl + "/api/Images/DeleteActivityImage?Id=" + this.state.SelectedImage.ActivityImageId,
            (data) => {
                $("#imageModal").modal("hide");
                toast("Image deleted successfully", {
                    type: toast.TYPE.SUCCESS
                })
                this.props.update();
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );
    }


}

export { EditSAPFActivity };


