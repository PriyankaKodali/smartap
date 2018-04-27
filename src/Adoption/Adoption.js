import React, { Component } from 'react';
import { MyAjax, MyAjaxForAttachments } from '../MyAjax'
import { showErrorsForInput } from '../ValidateForm';
import { toast } from 'react-toastify';
import { ApiUrl } from '../Config';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import  Select  from 'react-select';
import $ from 'jquery';
var moment = require('moment');


class Adoption extends Component {

    constructor(props) {
        super(props);
        this.state = {
            AdoptionId: 0, Adoption: null, IsAdoptionDataAvailable: false,
            Tags: [], SelectedTags: [], Images: []
        };
    }

    componentWillMount() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
        this.setState({ AdoptionId: this.props.match.params["id"] }, () => {
            if (this.state.AdoptionId === 0 && this.state.AdoptionId === undefined) {
                this.setState({ IsAdoptionDataAvailable: true });
            }
            else {

                MyAjax(
                    ApiUrl + "/api/MasterData/GetAllInterests",
                    (data) => { this.setState({ Tags: data["tags"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                );

                MyAjax(
                    ApiUrl + "/api/Partner/GetAdoption?Id=" + this.state.AdoptionId,
                    (data) => {
                        this.setState({ Adoption: data["adoption"], IsAdoptionDataAvailable: true }, () => {
                            var images = [];
                            this.state.Adoption["Activities"].forEach(ele => {
                                ele["Attachments"].forEach(image => {
                                    images.push(
                                        {
                                            original: image["URL"],
                                            thumbnail: image["URL"],
                                            description: ele["Title"]
                                        }
                                    );
                                })
                            });
                            this.setState({ Images: images });
                        });
                    },
                    (error) => {
                        toast(error.responseText, {
                            type: toast.TYPE.ERROR
                        });
                        this.setState({ IsAdoptionDataAvailable: true });
                    },
                    "GET",
                    null
                )
            }
        })
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }



    render() {
        return (
            this.state.IsAdoptionDataAvailable ?
                /* if api returned a response*/
                this.state.Adoption ?
                    /*if api response is valid */
                    < div className="container" >
                        <h2>
                            {this.state.Adoption["District"].toUpperCase()} <span className="fa fa-angle-right"></span> {this.state.Adoption["MandalMunicipality"].toUpperCase()} <span className="fa fa-angle-right"></span> {this.state.Adoption["PanchayatWard"].toUpperCase()}
                        </h2>
                        <div className="col-sm-8 col-sm-offset-2">
                            <div className="col-xs-12">
                                {this.state.Images.length > 0 ?
                                    <ImageGallery
                                        items={this.state.Images}
                                        slideInterval={2000}
                                        onImageLoad={this.handleImageLoad}
                                        showFullscreenButton={false}
                                        autoPlay={true} />
                                    :
                                    <div />
                                }
                            </div>
                        </div>

                        <div className="clearfix"></div>
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
                                                    <i className="fa fa-calender" aria-hidden="true"></i>
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
                    </div>
                    :
                    /*if api returned no data ot invalid request */
                    <h3>Invalid data provided</h3>
                :
                /* If waiting for api response */
                <div className="loader visible"></div>
        );
    }

    tagsChange(val) {
        this.setState({ SelectedTags: val });
    }

    _handleActivitySubmit(e) {
        e.preventDefault();
        toast.dismiss();
        if (!this.validate(e)) {
            return;
        }

        var title = this.refs.title.value.trim();
        var description = this.refs.description.value.trim();
        var activityDate = this.refs.activityDate.value.trim();
        var files = this.refs.file.files;
        var tags = this.state.SelectedTags.map((item) => { return item.label }).join('|');


        $(".loaderActivity").show();
        $("button[name='submitActivity']").hide();

        var formData = new FormData();
        formData.append("Adoption_Id", this.state.AdoptionId);
        formData.append("title", title);
        formData.append("activityDate", activityDate);
        formData.append("description", description);
        formData.append("tags", tags);
        for (var i = 0; i < files.length; i++) {
            formData.append(files[i].name, files[i]);
        }

        var url = ApiUrl + "/api/Partner/AddActivityForAdoption";
        MyAjaxForAttachments(
            url,
            (data) => {
                this.setState({ Adoption: data["adoption"] }, () => {
                    var images = [];
                    this.state.Adoption["Activities"].forEach(ele => {
                        ele["Attachments"].forEach(image => {
                            images.push(
                                {
                                    original: image["URL"],
                                    thumbnail: image["URL"],
                                    description: ele["Title"]
                                }
                            );
                        })
                    });
                    this.setState({ Images: images });

                    toast("Activity uploaded successfully", {
                        type: toast.TYPE.SUCCESS
                    });

                    $("#activityForm")[0].reset();
                    $(".loaderActivity").hide();
                    $("button[name='submitActivity']").show();
                });
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
        else if (moment(activityDate).isAfter(moment().add(1))) {
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

}

export default Adoption;

