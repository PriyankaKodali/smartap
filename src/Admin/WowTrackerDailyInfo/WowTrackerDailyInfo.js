import React, { Component } from 'react';
// import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl } from '../../Config';
import { MyAjax } from '../../MyAjax';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
var moment = require('moment');

class WowTrackerDailyInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ActivityId: null, DailyData: null, IsDataAvailable: false, SchoolImages: [], YouthImages: [], CommunityImages: []
        };
    }

    componentWillMount() {
        this.setState({ ActivityId: this.props.match.params["id"] }, () => {
            this.getDailyDetails();
        });
    }

    getDailyDetails() {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Wow/GetDailyActivityStats?Id=" + this.state.ActivityId;
        MyAjax(
            url,
            (data) => {
                this.setState({ DailyData: data["dailyData"], IsDataAvailable: true }, () => {
                    var schoolImages = [];
                    var youthImages = [];
                    var communityImages = [];
                    this.state.DailyData["SchoolAttachments"].forEach(image => {
                        schoolImages.push(
                            {
                                original: image,
                                thumbnail: image
                            }
                        );
                    });
                    this.state.DailyData["YouthAttachments"].forEach(image => {
                        youthImages.push(
                            {
                                original: image,
                                thumbnail: image
                            }
                        );
                    });
                    this.state.DailyData["CommunityAttachments"].forEach(image => {
                        communityImages.push(
                            {
                                original: image,
                                thumbnail: image
                            }
                        );
                    });
                    this.setState({ SchoolImages: schoolImages, YouthImages: youthImages, CommunityImages: communityImages });
                })
            },
            (error) => toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            }), "GET", null
        );
    }



    render() {
        return (
            this.state.IsDataAvailable ?
                <div className="col-xs-12 partner-details-block">
                    <h2>WoW Daily Info <div className="btn btn-default pull-right" onClick={() => this.props.history.push("/admin/wow-tracker")}>Back</div> </h2>
                    <div className="col-xs-6">
                        <table className="table table-condensed table-bordered">
                            <tbody>
                                <tr>
                                    <th>Date</th>
                                    <td title={moment(this.state.DailyData["Date"]).format("DD-MM-YY")}>{moment(this.state.DailyData["Date"]).format("DD-MM-YY")}</td>
                                </tr>
                                <tr>
                                    <th>Panchayat</th>
                                    <td title={this.state.DailyData["Panchayat"]}>{this.state.DailyData["Panchayat"]}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-xs-6">
                        <table className="table table-condensed table-bordered">
                            <tbody>
                                <tr>
                                    <th>District</th>
                                    <td title={this.state.DailyData["District"]}>{this.state.DailyData["District"]}</td>
                                </tr>
                                <tr>
                                    <th>Mandal</th>
                                    <td title={this.state.DailyData["Mandal"]}>{this.state.DailyData["Mandal"]}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-xs-12">
                        <table className="table table-condensed table-bordered">
                            <tbody>
                                <tr>
                                    <th>Overall Glance</th>
                                    <td >{this.state.DailyData["Comments"]}</td>
                                </tr>
                                <tr>
                                    <th>Other Attachments</th>
                                    <td> <a className="pointer" onClick={this.downloadAttachments.bind(this)}>Download</a> </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-xs-4">
                        <h3>School Module</h3>
                        <table className="table table-condensed table-bordered">
                            <tbody>
                                <tr>
                                    <th>Male</th>
                                    <td>{this.state.DailyData["SchoolChildrenMale"]}</td>
                                </tr>
                                <tr>
                                    <th>Female</th>
                                    <td>{this.state.DailyData["SchoolChildrenFemale"]}</td>
                                </tr>
                                <tr>
                                    <th>Total</th>
                                    <td>{this.state.DailyData["SchoolTotal"]}</td>
                                </tr>
                                <tr>
                                    <th>Images</th>
                                    <td> <a className="pointer" data-toggle="modal" data-target="#schoolModal">View</a> </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-xs-4">
                        <h3>Youth Module</h3>
                        <table className="table table-condensed table-bordered">
                            <tbody>
                                <tr>
                                    <th>Male</th>
                                    <td>{this.state.DailyData["YouthMale"]}</td>
                                </tr>
                                <tr>
                                    <th>Female</th>
                                    <td>{this.state.DailyData["YouthFemale"]}</td>
                                </tr>
                                <tr>
                                    <th>Total</th>
                                    <td>{this.state.DailyData["YouthTotal"]}</td>
                                </tr>
                                <tr>
                                    <th>Images</th>
                                    <td> <a className="pointer" data-toggle="modal" data-target="#youthModal">View</a> </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="col-xs-4">
                        <h3>Community Module</h3>
                        <table className="table table-condensed table-bordered">
                            <tbody>
                                <tr>
                                    <th>Male</th>
                                    <td>{this.state.DailyData["CommunityMembersMale"]}</td>
                                </tr>
                                <tr>
                                    <th>Female</th>
                                    <td>{this.state.DailyData["CommunityMembersFemale"]}</td>
                                </tr>
                                <tr>
                                    <th>Total</th>
                                    <td>{this.state.DailyData["CommunityTotal"]}</td>
                                </tr>
                                <tr>
                                    <th>Images</th>
                                    <td> <a className="pointer" data-toggle="modal" data-target="#communityModal">View</a> </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div id="schoolModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <h4 className="modal-title">School Module</h4>
                                </div>
                                <div className="modal-body">
                                    {this.state.SchoolImages.length > 0 ?
                                        <ImageGallery
                                            items={this.state.SchoolImages}
                                            slideInterval={2000}
                                            showFullscreenButton={false}
                                            autoPlay={true} />
                                        :
                                        <div />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="youthModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <h4 className="modal-title">Youth Module</h4>
                                </div>
                                <div className="modal-body">
                                    {this.state.YouthImages.length > 0 ?
                                        <ImageGallery
                                            items={this.state.YouthImages}
                                            slideInterval={2000}
                                            showFullscreenButton={false}
                                            autoPlay={true} />
                                        :
                                        <div />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="communityModal" className="modal fade" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                    <h4 className="modal-title">Community Module</h4>
                                </div>
                                <div className="modal-body">
                                    {this.state.CommunityImages.length > 0 ?
                                        <ImageGallery
                                            items={this.state.CommunityImages}
                                            slideInterval={2000}
                                            showFullscreenButton={false}
                                            autoPlay={true} />
                                        :
                                        <div />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                :
                <div className="loader visible"></div>
        );
    }

    downloadAttachments() {
        var url = ApiUrl + "/api/Wow/GetAllAttachmentsAsZip?Id=" + this.state.ActivityId
        window.open(url);
    }

}

export default WowTrackerDailyInfo;


