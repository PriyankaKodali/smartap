import React, { Component } from 'react';
// import $ from 'jquery';
import { MyAjax } from '../MyAjax'
import { toast } from 'react-toastify';
import { ApiUrl } from '../Config';
import { Adoption } from './Adoption';
import { Project } from './Project';
import './PartnerDashboard.css'
import moment from 'moment';

class PartnerDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = { Representatives: [], MyAdoptions: [], MyProjects: [], IsAdoptionDataAvailable: false, Partner: {}, IsPartnerDataAvailable: false };
    }


    componentDidMount() {
        MyAjax(
            ApiUrl + "/api/Partner/GetMyAdoptions",
            (data) => { this.setState({ MyAdoptions: data["MyAdoptions"], IsAdoptionDataAvailable: true }); },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                this.setState({ IsAdoptionDataAvailable: true });
            },
            "GET",
            null
        );

        MyAjax(
            ApiUrl + "/api/Partner/GetMyProjects",
            (data) => { this.setState({ MyProjects: data["MyProjects"] }); },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
            },
            "GET",
            null
        );

        MyAjax(
            ApiUrl + "/api/Partner/GetPartner?PartnerId=",
            (data) => {
                this.setState({ Partner: data["partner"], IsPartnerDataAvailable: true }, () => {
                    if (this.state.Partner["City_Id"] === null) {
                        toast("Please complete your profile before proceeding", {
                            type: toast.TYPE.INFO
                        });
                        this.props.history.push("/partner-profile");
                    }
                    if (this.state.Partner.PartnerCategory_Id === 3 || this.state.Partner.PartnerCategory_Id === 3) {
                        this.getRepresentatives();
                    }
                });
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );
    }

    getRepresentatives() {
        MyAjax(
            ApiUrl + "/api/MasterData/GetRepresentatives",
            (data) => { this.setState({ Representatives: data["representatives"] }); },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        )
    }

    representativeUpdated() {
        MyAjax(
            ApiUrl + "/api/Partner/GetMyAdoptions",
            (data) => { this.setState({ MyAdoptions: data["MyAdoptions"], IsAdoptionDataAvailable: true }); },
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

    render() {
        return (
            <div className="container">
                {
                    this.state.IsPartnerDataAvailable ?
                        this.state.Partner["City_Id"] !== null ?
                            <div className="partner-details-block">
                                <h4 className="col-xs-12">Personal Details</h4>
                                <div className="col-md-4">
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td title={this.state.Partner["FullName"]}>{this.state.Partner["FullName"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td title={this.state.Partner["Email"]}>{this.state.Partner["Email"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone</th>
                                                <td title={this.state.Partner["PhoneNumber"]}>{this.state.Partner["PhoneNumber"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4">
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Category</th>
                                                <td title={this.state.Partner["PartnerCategory"]}>{this.state.Partner["PartnerCategory"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Sub Category</th>
                                                <td title={this.state.Partner["PartnerSubCategory"]}>{this.state.Partner["PartnerSubCategory"]}</td>
                                            </tr>
                                            <tr>
                                                <th>DOB</th>
                                                <td title={moment(this.state.Partner["DOB"]).format("DD-MM-YYYY")}>{moment(this.state.Partner["DOB"]).format("DD-MM-YYYY")}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4">
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>City</th>
                                                <td title={this.state.Partner["City"]}>{this.state.Partner["City"]}</td>
                                            </tr>
                                            <tr>
                                                <th>State</th>
                                                <td title={this.state.Partner["State"]}>{this.state.Partner["State"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Country</th>
                                                <td title={this.state.Partner["Country"]}>{this.state.Partner["Country"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            :
                            <div className="alert alert-warning alert-dismissible row" role="alert">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                <p>Click <a className="alert-link pointer" onClick={() => this.props.history.push("/partner-profile")}>here</a> to update your personal details!</p>
                            </div>
                        :
                        <div className={"loader " + (this.state.IsAdoptionDataAvailable ? "" : "hidden")}></div>
                }




                {
                    this.state.IsAdoptionDataAvailable && this.state.IsPartnerDataAvailable ?
                        this.state.MyAdoptions.length === 0 && this.state.MyProjects.length === 0
                            ?
                            <div className="jumbotron text-center">
                                <h1>Welcome to Smart AP Foundation!</h1>
                                <h2 className="text-center">You have been successfully registered as a Partner</h2>
                                <p className="text-center">You are now a member of the Smart AP Partner Network, with more than 10,000 members.</p>
                                <p className="text-center">You can now partner with a village or donate for a project from the links below.</p>
                                <p>
                                    <a className="btn btn-primary btn-lg" onClick={() => this.props.history.push("/adopt")} role="button" title="Partner a gram panchayat or ward">Partner a GP/Ward</a>
                                    <a className="btn btn-primary btn-lg mleft5" onClick={() => this.props.history.push("/donate")} role="button">Contribute for a Project</a>
                                </p>
                            </div>
                            :
                            <div className="tab" role="tabpanel">
                                <div className="text-center">
                                    <ul className="nav nav-tabs text-center f18">
                                        <li className="active p0"><a className="" data-toggle="tab" href="#adoptions">Partnered GP/Ward</a></li>
                                        <li className="p0"><a className="" data-toggle="tab" href="#projects">Projects</a></li>
                                    </ul>
                                </div>
                                <div className="tab-content">
                                    <div id="adoptions" className="tab-pane fade in active">
                                        {
                                            this.state.MyAdoptions.map((adoption) => {
                                                return (<Adoption key={adoption["Id"]} adoption={adoption} history={this.props.history}
                                                    partner={this.state.Partner} representatives={this.state.Representatives} repUpdated={this.representativeUpdated.bind(this)} />)
                                            })
                                        }
                                    </div>
                                    <div id="projects" className="tab-pane fade">
                                        {
                                            this.state.MyProjects.map((project) => {
                                                return (<Project key={project["Id"]} project={project} history={this.props.history}>
                                                </Project>)
                                            })
                                        }
                                    </div>
                                </div>
                                <p className="text-center mtop10">
                                    <a className="btn btn-info btn-lg" onClick={() => this.props.history.push("/adopt")} role="button" title="Partner a gram panchayat or ward">Partner a GP/Ward</a>
                                    <a className="btn btn-info btn-lg mleft5" onClick={() => this.props.history.push("/donate")} role="button">Contribute for a Project</a>
                                </p>

                            </div>
                        :
                        <center><div className="loader visible"></div></center>
                }
            </div>
        );
    }

    goto(location) {
        this.props.history.push(location);
    }

    _handleSubmit(e) {
        e.preventDefault();
    }
}

export default PartnerDashboard;

