import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import { ApiUrl } from '../../Config';
import { showErrorsForInput } from '../../ValidateForm';
import Select from 'react-select';

class NewsItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            NewsItemId: null, Title: null, CreatedBy: null, ImageUrl: null, CreatedDate: null, IsDataAvailable: false
        };
    }

    componentWillMount() {
        this.setState({ NewsItemId: this.props.match.params["id"] }, () => {
            if (this.state.NewsItemId) {
                MyAjax(
                    ApiUrl + "/api/News/GetNewItem?Id=" + this.state.NewsItemId,
                    (data) => {
                        this.setState({
                            Id: data["newsItem"]["Id"],
                            Title: data["newsItem"]["Title"],
                            CreatedBy: data["newsItem"]["CreatedBy"],
                            ImageUrl: data["newsItem"]["ImageURL"],
                            CreatedDate: data["newsItem"]["CreatedDate"],
                            IsDataAvailable: true
                        })
                    },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                );
            }
            else {
                this.setState({ IsDataAvailable: true });
            }
        });
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
                    <h2>News Item<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/news-items") }}>Back</button></span></h2>
                    <hr />
                    {
                        this.state.CreatedBy ?
                            <div className="col-xs-12">
                                <p className="mtop0 f18"><label>Created By : </label> <span>{this.state.CreatedBy}</span> <label className="mleft5">Created Date : </label> <span>{this.state.CreatedDate}</span></p>
                            </div>
                            :
                            <div />
                    }

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
                        <label>News Item Image</label>
                        {
                            this.state.ImageUrl !== null ?
                                <div>
                                    <div className="btn btn-default" onClick={() => { $("#imageModal").modal("show") }}>View</div>
                                    <div className="btn btn-default mleft5" onClick={() => this.setState({ ImageUrl: null })}>Change</div>
                                </div>
                                :
                                <div className="form-group" >
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                        </span>
                                        <input type="file" accept="image/x-png,image/jpeg" className="form-control" name="mainImage" ref="mainImage" />
                                    </div>
                                </div>
                        }
                    </div>

                    <div className="col-xs-12 text-center form-group">
                        <button type="button" name="submit" className="btn btn-primary" onClick={this.submitNewsItem.bind(this)}>Submit</button>
                        <div className="loader"></div>
                    </div>


                    <div id="imageModal" className="modal fade" role="dialog" ref="imageModal">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <hr />
                                    <div className="col-xs-12">
                                        <img src={this.state.ImageUrl} width="100%" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                :
                <div className="loader visible"></div>
        )
    }

    submitNewsItem(e) {
        e.preventDefault();

        if (!this.validate()) {
            return;
        }

        $(".loader").show();
        $("button[name='submit']").hide();
        var title = this.refs.title.value.trim();
        var data = new FormData();
        data.append("id", this.state.NewsItemId);
        data.append("title", title);
        if (this.refs.mainImage) {
            data.append("mainImage", this.refs.mainImage.files[0]);
        }

        var url = "";
        if (this.state.NewsItemId) {
            url = ApiUrl + "/api/News/EditNewsItem"
        }
        else {
            url = ApiUrl + "/api/News/AddNewsItem"
        }

        MyAjaxForAttachments(
            url,
            (data) => {
                toast("News Item updated Successfully!", {
                    type: toast.TYPE.SUCCESS
                })
                $(".loader").hide();
                $("button[name='submit']").show();
                this.props.history.push("/admin/news-items");
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
        if (title === "") {
            showErrorsForInput(this.refs.title, ["Please enter Title"]);
            success = false;
            this.refs.title.focus();
        }
        else {
            showErrorsForInput(this.refs.title, []);
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

export default NewsItem;


