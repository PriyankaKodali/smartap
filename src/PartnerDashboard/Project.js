import React, { Component } from 'react';
import '../css/progress-wizard.min.css'
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';


class Project extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Project: this.props.project
        };

    }

    render() {
        return (
            this.state.Project.Status === "In Progress" || this.state.Project.Status === "Completed" ?
                <div className="">
                    <div className="panel panel-primary">
                        <div className="panel-heading pointer" data-toggle="collapse" href={"#" + this.state.Project["Id"]}>
                            {this.state.Project["Name"]}
                            <span className="pull-right"> <a> <span className="fa fa-angle-down cl-white mleft5 f18"></span> </a> </span>
                            <span className="pull-right">
                                {
                                    this.state.Project["PartnerRepresentative"] ? "Representative : " + this.state.Project["PartnerRepresentative"] : ""
                                }
                            </span>
                        </div>
                        <div id={this.state.Project["Id"]} className="panel-collapse collapse in">
                            <div className="panel-body">
                                <div className="col-sm-8 ">{
                                    this.state.Project.ActivityImages.length > 0 ?
                                        <ImageGallery
                                            items={this.state.Project.ActivityImages}
                                            slideInterval={2000}
                                            showFullscreenButton={false}
                                            autoPlay={true} />
                                        :
                                        <div />
                                }
                                </div>
                                <div className="col-sm-4">
                                    <div className="btn btn-success pull-right" onClick={() => this.props.history.push("/Project/" + this.state.Project["Id"])}>View Project</div>
                                    <br />
                                    <h3>CPO</h3>
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td>{this.state.Project["CPO"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>{this.state.Project["CPOEmail"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone</th>
                                                <td>{this.state.Project["CPOPhone"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h3>MPDO</h3>
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td>{this.state.Project["MPDO"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>{this.state.Project["MPDOEmail"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone</th>
                                                <td>{this.state.Project["MPDOPhone"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h3>Sarpanch</h3>
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td>{this.state.Project["Sarpanch"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>{this.state.Project["SarpanchEmail"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone</th>
                                                <td>{this.state.Project["SarpanchPhone"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <div className="panel panel-primary">
                        <div className="panel-heading pointer" data-toggle="collapse" href={"#" + this.state.Project["Id"]}>
                            {this.state.Project["Name"]}
                            <span className="pull-right"> <a> <span className="fa fa-angle-down cl-white mleft5 f18"></span> </a> </span>
                            <span className="pull-right">
                                {
                                    this.state.Project["PartnerRepresentative"] ? "Representative : " + this.state.Project["PartnerRepresentative"] : ""
                                }
                            </span>
                        </div>
                        <div id={this.state.Project["Id"]} className="panel-collapse collapse in">
                            <div className="panel-body">
                                <h2>Status : {this.state.Project.Status}</h2>
                            </div>
                            <div className="panel-footer bg-transparent">
                                <div className="btn btn-default pull-right" onClick={() => this.props.history.push("/Project/" + this.state.Project["Id"])}>View</div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }

}

export { Project };

