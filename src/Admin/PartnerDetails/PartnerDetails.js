import React, { Component } from 'react';
// import $ from 'jquery';
import { MyAjax } from '../../MyAjax'
import { toast } from 'react-toastify';
import { ApiUrl } from '../../Config';
import moment from 'moment';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

class PartnerDetails extends Component {

    constructor(props) {
        super(props);
        var isAdmin = sessionStorage.getItem("smart_ap_roles").indexOf("Admin") !== -1;
        this.state = {
            error: "", Partner: {}, IsPartnerDataAvailable: false, PartnerId: null,
            IsNri: false, IsOrg: false, IsDisabled: false, IsVerified: false, IsAdmin: isAdmin,
            Adoptions: [], Projects: [], Donations: []
        };
    }


    componentDidMount() {
        this.setState({ PartnerId: this.props.match.params["id"] }, () => {
            MyAjax(
                ApiUrl + "/api/Partner/GetPartner?PartnerId=" + this.state.PartnerId,
                (data) => {
                    this.setState({ Partner: data["partner"], IsPartnerDataAvailable: true, IsDisabled: data["isDisabled"], IsVerified: data["isVerified"] }, () => {
                        if (this.state.Partner["PartnerCategory_Id"] === 3) {
                            this.setState({ IsOrg: true });
                        }
                        if (this.state.Partner["PartnerCategory_Id"] === 5) {
                            this.setState({ IsNri: true });
                        }
                    });
                },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                }),
                "GET",
                null
            );
            MyAjax(
                ApiUrl + "/api/Partner/GetAllData?UserId=" + this.state.PartnerId,
                (data) => {
                    this.setState({ Adoptions: data["adoptions"], Projects: data["projects"], Donations: data["donations"] })
                },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                }),
                "GET",
                null
            );
        });

    }

    render() {
        return (
            <div className="container">
                {
                    this.state.IsPartnerDataAvailable ?
                        <div>
                            {/* {
                                this.state.IsAdmin ?
                                    <div>
                                        {
                                            this.state.IsDisabled ?
                                                <div className="alert alert-danger mtop10">
                                                    The partner is disabled, click <a>here</a> to enable the partner
                                            </div>
                                                :
                                                <div />
                                        }
                                        {
                                            !this.state.IsVerified ?
                                                <div className="alert alert-warning mtop10">
                                                    The partner is not verified, click <a>here</a> to verify the partner
                                            </div>
                                                :
                                                <div />
                                        }
                                    </div>
                                    :
                                    <div />
                            } */}
                            <div className="">
                                <h3 className="col-xs-12">Partner Details</h3>
                                <div className="col-xs-12 partner-details-block">
                                    <h4>Personal Details</h4>
                                    <div className="col-xs-6">
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
                                                    <th>DOB</th>
                                                    <td title={this.state.Partner["DOB"]}>{moment(this.state.Partner["DOB"]).format("DD-MM-YYYY")}</td>
                                                </tr>
                                                <tr>
                                                    <th>Gender</th>
                                                    <td title={this.state.Partner["Gender"]}>{this.state.Partner["Gender"]}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-xs-6">
                                        <table className="table table-condensed table-bordered">
                                            <tbody>
                                                <tr>
                                                    <th>Phone</th>
                                                    <td title={this.state.Partner["PhoneNumber"]}>{this.state.Partner["PhoneNumber"]}</td>
                                                </tr>
                                                <tr>
                                                    <th>Secondary Phone</th>
                                                    <td title={this.state.Partner["SecondaryPhoneNumber"]}>{this.state.Partner["SecondaryPhoneNumber"]}</td>
                                                </tr>
                                                <tr>
                                                    <th>Category</th>
                                                    <td title={this.state.Partner["PartnerCategory"]}>{this.state.Partner["PartnerCategory"]}</td>
                                                </tr>
                                                <tr>
                                                    <th>Sub Category</th>
                                                    <td title={this.state.Partner["PartnerSubCategory"]}>{this.state.Partner["PartnerSubCategory"]}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="col-xs-12 partner-details-block">
                                    <div className={(this.state.IsNri ? "col-xs-6" : "col-xs-12")}>
                                        <h4>Communication Address</h4>
                                        <table className="table table-condensed table-bordered">
                                            <tbody>
                                                <tr>
                                                    <th>Address</th>
                                                    <td title={this.state.Partner["Address"]}>{this.state.Partner["Address"]}</td>
                                                </tr>
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
                                                <tr>
                                                    <th>PIN/ZIP</th>
                                                    <td title={this.state.Partner["PIN"]}>{this.state.Partner["PIN"]}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    {this.state.IsNri ?
                                        <div className="col-xs-6">
                                            <h4>Origin Address</h4>
                                            <table className="table table-condensed table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <th>Address</th>
                                                        <td title={this.state.Partner["LocalAddress"]}>{this.state.Partner["LocalAddress"]}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>City</th>
                                                        <td title={this.state.Partner["LocalAddressCity"]}>{this.state.Partner["LocalAddressCity"]}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>State</th>
                                                        <td title={this.state.Partner["LocalAddressState"]}>{this.state.Partner["LocalAddressState"]}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Country</th>
                                                        <td title={this.state.Partner["LocalAddressCountry"]}>{this.state.Partner["LocalAddressCountry"]}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>PIN/ZIP</th>
                                                        <td title={this.state.Partner["PIN"]}>{this.state.Partner["PIN"]}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div> : <div />
                                    }
                                </div>
                                <div className="col-xs-12 partner-details-block">
                                    {!this.state.IsOrg ?
                                        <div className="col-xs-6">
                                            <h4>Previous Experience</h4>
                                            <p style={{ textAlign: "justify" }}>{this.state.Partner["PreviousExperience"]}</p>
                                        </div> :
                                        <div className="col-xs-6">
                                            <h4>Organization Info</h4>
                                            <table className="table table-condensed table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <th>Annual Reports</th>
                                                        <td><a className={"btn btn-default " + (this.state.Partner["AnnualReportsAttachmentURL"] ? "" : "hidden")} href={this.state.Partner["AnnualReportsAttachmentURL"]} download>Download</a></td>
                                                    </tr>
                                                    <tr>
                                                        <th>Previous Projects</th>
                                                        <td><a className={"btn btn-default " + (this.state.Partner["PreviousProjectsAttachmentURL"] ? "" : "hidden")} href={this.state.Partner["PreviousProjectsAttachmentURL"]} download>Download</a></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    }
                                    <div className="col-xs-6">
                                        <h4>Partner Interests</h4>
                                        <ul>
                                            {
                                                this.state.Partner["PartnerInterests"].filter((item) => {
                                                    return item.Checked;
                                                }).map((item) => {
                                                    return (<li>{item["Name"]}</li>)
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>

                                <div className="clearfix"></div>
                            </div>

                            <div>
                                <h3>Partnerships</h3>
                                <BootstrapTable data={this.state.Adoptions} striped hover>
                                    <TableHeaderColumn dataField='Date' isKey={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='130'>Date</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Type'>Type</TableHeaderColumn>
                                    <TableHeaderColumn dataField='PanchayatWard'>Panchayat/Ward</TableHeaderColumn>
                                    <TableHeaderColumn dataField='MandalMunicipality'>Mandal/Municipality</TableHeaderColumn>
                                    <TableHeaderColumn dataField='District'>District</TableHeaderColumn>
                                    <TableHeaderColumn columnClassName="text-center" dataField='Id' width="40" dataFormat={this.adoptionViewFormatter.bind(this)}></TableHeaderColumn>
                                </BootstrapTable>
                            </div>

                            <div>
                                <h3>Projects</h3>
                                <BootstrapTable data={this.state.Projects} striped hover>
                                    <TableHeaderColumn dataField='CreatedDate' isKey={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='130'>Date</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Name'>Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Sector'>Sector</TableHeaderColumn>
                                    <TableHeaderColumn dataField='PanchayatWard'>Panchayat/Ward</TableHeaderColumn>
                                    <TableHeaderColumn dataField='MandalMunicipality'>Mandal/Municipality</TableHeaderColumn>
                                    <TableHeaderColumn dataField='District'>District</TableHeaderColumn>
                                    <TableHeaderColumn columnClassName="text-center" dataField='Id' width="40" dataFormat={this.projectViewFormatter.bind(this)}></TableHeaderColumn>
                                </BootstrapTable>
                            </div>

                            <div>
                                <h3>Donations</h3>
                                <BootstrapTable data={this.state.Donations} striped hover>
                                    <TableHeaderColumn dataField='CreatedTime' isKey={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='130'>Date</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Amount'>Amount</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Sector'>Sector</TableHeaderColumn>
                                    <TableHeaderColumn dataField='ProjectName'>Project</TableHeaderColumn>
                                    <TableHeaderColumn dataField='PanchayatWard'>Panchayat/Ward</TableHeaderColumn>
                                    <TableHeaderColumn dataField='MandalMunicipality'>Mandal/Municipality</TableHeaderColumn>
                                    <TableHeaderColumn dataField='District'>District</TableHeaderColumn>
                                    <TableHeaderColumn dataField='Status'>Status</TableHeaderColumn>
                                    <TableHeaderColumn columnClassName="text-center" dataField='Id' width="40" dataFormat={this.donationViewFormatter.bind(this)}></TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                        :
                        <div className="loader hidden"></div>
                }
            </div>
        );
    }


    adoptionViewFormatter(cell, row) {
        return <i className='fa fa-eye pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/adoption-application/" + cell)}></i>;
    }

    projectViewFormatter(cell, row) {
        return <i className='fa fa-eye pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/project-proposal/" + cell)}></i>;
    }

    donationViewFormatter(cell, row) {
        return <i className='fa fa-eye pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/donation/" + cell)}></i>;
    }
}



export { PartnerDetails };

