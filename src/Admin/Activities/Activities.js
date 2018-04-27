import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl } from '../../Config'
import { MyAjax } from '../../MyAjax';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
var moment = require('moment');

class Activities extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Activities: [], IsDataAvailable: false
        };
    }

    componentWillMount() {

        MyAjax(
            ApiUrl + "/api/Projects/GetActivitiesPendingForVerification",
            (data) => this.setState({ Activities: data["Activities"], IsDataAvailable: true }),
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );
    }


    getProposals(page, count) {

    }

    render() {
        return (this.state.IsDataAvailable ?
            this.state.Activities.length > 0 ?
                <div className="col-xs-12">
                    <h2>Activities</h2>
                    {
                        this.state.Activities.map((ele) => {
                            return <div className={"panel " + (ele["Verified"] ? "panel-success" : "panel-default")} key={ele["Id"]}>
                                <div className="panel-heading activity-heading" style={{ display: "flex" }}>
                                    <a href={"#" + ele["Id"]} data-toggle="collapse">
                                        {ele["Title"]}
                                    </a>
                                </div>
                                <div id={ele["Id"]} className="panel-collapse collapse">
                                    <div className="panel-body">

                                        <div className="col-xs-6">
                                            <table className="table table-condensed table-bordered view-table">
                                                <tbody>
                                                    <tr>
                                                        <th>Date</th>
                                                        <td>{moment(ele["Date"]).format("DD-MM-YYYY")}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Status</th>
                                                        <td>{ele["Verified"] ? "Verified" : "Verification Pending"}</td>
                                                    </tr>
                                                    <tr className={ele["Attachments"].length > 0 ? "" : "hidden"}>
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
                                                        <td>{moment(ele["CreatedDate"]).format("DD-MM-YYYY")}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Project</th>
                                                        <td><a className="pointer" onClick={() => { this.props.history.push("/admin/project-proposal/" + ele["ProjectProposal_Id"]) }}>View Project</a></td>
                                                    </tr>
                                                    <tr className={ele["Verified"] ? "" : "hidden"}>
                                                        <th>Verified on</th>
                                                        <td>{moment(ele["VerifiedDate"]).format("DD-MM-YYYY")}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="clearfix"></div>
                                        <div>
                                            <label>Description</label>
                                            <div>{ele["Description"]}</div>
                                        </div>

                                        <div className={"mtop24 " + (ele["Verified"] ? "" : "hidden")}>
                                            <label>Verification Comments</label>
                                            <div>{ele["VerificationComments"]}</div>
                                        </div>

                                        <div className="mtop24">
                                            <div>
                                                <ImageGallery
                                                    items={ele["Images"]}
                                                    slideInterval={2000}
                                                    fullscreen={true}
                                                    showThumbnails={false}
                                                    useBrowserFullscreen={true}
                                                    autoPlay={true}
                                                />

                                            </div>
                                        </div>
                                        {
                                            ele["Verified"] ? <br /> :
                                                <form className="mtop10" onSubmit={this.verifyActivity.bind(this)}>
                                                    <input type="text" name={ele["Id"]} hidden defaultValue={ele["Id"]} />
                                                    <div className="col-xs-12">
                                                        <div className=" form-group-textarea form-group">
                                                            <textarea className="form-control" name={ele["Id"] + "Comment"} type="text" ref={ele["Id"] + "Comment"} style={{ resize: "vertical" }} placeholder="Comment"></textarea>
                                                        </div>
                                                    </div>

                                                    <div className="col-xs-12 text-center">
                                                        <div className="loader"></div>
                                                        <button type="submit" name={ele["Id"] + "comment"} className="btn btn-primary">Verify</button>
                                                    </div>
                                                </form>
                                        }
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
                :
                <h3>No activities pending for verification</h3>
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
                toast("activity verified successfully", {
                    type: toast.TYPE.SUCCESS
                });
                var activities = this.state.Activities.filter((item => item.Id  !== activityId));
                this.setState({ Activities: activities });
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

}

export default Activities;
