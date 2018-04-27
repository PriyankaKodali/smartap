import React, { Component } from 'react';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax'
import { showErrorsForInput } from '../../ValidateForm';
import { toast } from 'react-toastify';
import { ApiUrl } from '../../Config';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import $ from 'jquery';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');


class Adoption extends Component {

    constructor(props) {
        super(props);
        this.state = {
            AdoptionId: 0, Adoption: null, IsAdoptionDataAvailable: false, Images: [],
            PartnerId: null, Partner: null, IsPartnerDataAvailable: false
        };
    }

    componentWillMount() {
        this.setState({ AdoptionId: this.props.match.params["adoptionId"], PartnerId: this.props.match.params["partnerId"] }, () => {
            if (this.state.AdoptionId === 0 && this.state.AdoptionId === undefined) {
                this.setState({ IsAdoptionDataAvailable: true });
            }
            else {
                MyAjax(
                    ApiUrl + "/api/Partner/GetAdoption?Id=" + this.state.AdoptionId,
                    (data) => {
                        this.setState({ Adoption: data["adoption"], IsAdoptionDataAvailable: true });
                    },
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
                    ApiUrl + "/api/Partner/GetPartner?PartnerId=" + this.state.PartnerId,
                    (data) => {
                        this.setState({ Partner: data["partner"], IsPartnerDataAvailable: true });
                    },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    }),
                    "GET",
                    null
                );
            }
        })
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }



    render() {
        return (
            <div>
                {
                    this.state.IsPartnerDataAvailable ?
                        <div className="partner-details-block">
                            <h4 className="col-xs-12">Partner Details</h4>
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
                        <div className="loader visible"></div>
                }
                {
                    this.state.IsAdoptionDataAvailable ?
                        <div>
                            <h4 className="col-xs-12">Partnership Details</h4>
                            
                            <BootstrapTable data={this.state.Adoption["Activities"]} striped hover>
                                <TableHeaderColumn dataField='ActivityDate' isKey={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY hh:mm")} width='130'>Date</TableHeaderColumn>
                                <TableHeaderColumn dataField='Title'>Title</TableHeaderColumn>
                                <TableHeaderColumn dataField='Description'>Description</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="text-center" dataField='Id' width="30"></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                        :
                        <div className="loader visible"></div>
                }
            </div>
        );
    }
}

export { Adoption };

