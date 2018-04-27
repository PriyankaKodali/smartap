import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import { ApiUrl } from '../../Config'
import { showErrorsForInput } from '../../ValidateForm'
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'font-awesome/css/font-awesome.css';
import  Select  from 'react-select';



class CaseStudy extends Component {

    constructor(props) {
        super(props);
        var config = {
            imageUploadURL: ApiUrl + "/api/CaseStudy/PartnerUploadImage",
            imageUploadParams: { id: 'my_editor' },
            imageUploadMethod: 'POST',
            events: {
                'froalaEditor.image.removed': function (e, editor, $img) {
                    MyAjax(
                        ApiUrl + "/api/CaseStudy/PartnerRemoveImage?url=" + $img[0].src,
                        (data) => { },
                        (error) => { },
                        "GET",
                        null
                    )
                }
            }
        };
        this.state = {
            CaseStudyId: null, HtmlContent: "", Config: config, Tags: [], SelectedTags: null, IsDataAvailable: false,
            Title: null, Author: null, ImageUrl: null, BriefDescription: null
        };
    }

    componentWillMount() {
        this.setState({ IsDataAvailable: true });
        MyAjax(
            ApiUrl + "/api/CaseStudy/GetAllTags",
            (data) => { this.setState({ Tags: data["tags"] }) },
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
                    <h2>Case Study<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/case-studies") }}>Back</button></span></h2>
                    <hr />

                    <div className="col-md-8">
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

                    <div className="col-md-4">
                        <label>Main Image</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-user" aria-hidden="true"></i>
                                </span>
                                <input type="file" accept="image/x-png,image/jpeg" className="form-control" name="mainImage" ref="mainImage" />
                            </div>
                        </div>
                    </div>


                    <div className="col-xs-12">
                        <label>Brief Description</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-user" aria-hidden="true"></i>
                                </span>
                                <input className="form-control" name="description" ref="description" placeholder="Description" autoComplete="off" defaultValue={this.state.BriefDescription} />
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <label>Content</label>
                        <FroalaEditor
                            model={this.state.HtmlContent}
                            onModelChange={this.handleModelChange.bind(this)}
                            config={this.state.Config}
                        />
                    </div>

                    <div className="col-xs-12 mtop24">
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

                    <div className="col-xs-12 text-center form-group">
                        <button type="button" name="submit" className="btn btn-primary" onClick={this.submitCaseStudy.bind(this)}>Submit</button>
                        <div className="loader"></div>
                    </div>
                </div>
                :
                <div className="loader visible"></div>
        )
    }

    tagsChange(val) {
        this.setState({ SelectedTags: val });
    }

    submitCaseStudy(e) {
        e.preventDefault();

        if (!this.validate()) {
            return;
        }

        $(".loader").show();
        $("button[name='submit']").hide();
        var title = this.refs.title.value.trim();
        var tags = "";
        this.state.SelectedTags.map((item) => { tags += item.value + "|"; return null; });
        tags = tags.slice(0, -1); // to trim last '|' 
        var htmlContent = this.state.HtmlContent;
        var description = this.refs.description.value.trim();

        var data = new FormData();
        data.append("id", this.state.CaseStudyId);
        data.append("title", title);
        data.append("tags", tags);
        data.append("htmlContent", htmlContent);
        data.append("description", description);
        if (this.refs.mainImage) {
            data.append("mainImage", this.refs.mainImage.files[0]);
        }

        var url = ApiUrl + "/api/CaseStudy/AddPartnerCaseStudy";

        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Case Study updated Successfully!", {
                    type: toast.TYPE.SUCCESS
                })
                $(".loader").hide();
                $("button[name='submit']").show();
                this.props.history.push("/partner-dashboard");
            },
            (error) => {
                $(".loader").hide();
                $("button[name='submit']").show();
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            },
            "POST",
            data

        )
    }

    validate() {
        var success = true;
        var title = this.refs.title.value.trim();
        var description = this.refs.description.value.trim();
        if (title === "") {
            showErrorsForInput(this.refs.title, ["Please enter Title"]);
            success = false;
            this.refs.title.focus();
        }
        else {
            showErrorsForInput(this.refs.title, []);
        }

        if (description === "") {
            showErrorsForInput(this.refs.description, ["Please enter description"]);
            success = false;
            this.refs.description.focus();
        }
        else {
            showErrorsForInput(this.refs.description, []);
        }

        if (this.refs.mainImage) {
            var files = this.refs.mainImage.files;
            if (files.length === 0) {
                showErrorsForInput(this.refs.mainImage, ["Please choose a main image"]);
                success = false;
                this.refs.mainImage.focus();
            }
            else {
                if ($.inArray(files[0].name.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png"]) === -1) {
                    showErrorsForInput(this.refs.mainImage, ["Supported formats : jpg | jpeg | png"]);
                    success = false;
                }
                else {
                    showErrorsForInput(this.refs.mainImage, []);
                }

            }
        }


        return success;
    }


}

export default CaseStudy;


