import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { MyAjax } from '../MyAjax';
import { ApiUrl } from '../Config'
import  Select  from 'react-select';
import { showErrorsForInput, setUnTouched, removePreviousErrors } from '../ValidateForm';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import RichTextEditor from 'react-rte';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');


class Donate extends Component {

    constructor(props) {
        super(props);

        var selectRowProp = {
            mode: 'radio',
            bgColor: (row, isSelect) => {
                if (isSelect) {
                    return '#cddc39';
                }
                return null;
            },
            onSelect: (row, isSelect) => {
                this.setState({ Project: row });
            }
        };

        this.state = {
            error: "", Districts: [], District: null, MandalsMunicipalities: [], DonationFor: "",
            MandalMunicipality: null, PanchayatsWards: [], PanchayatWard: null, Status: null,
            DonationTypes: [{ label: "Online", value: "Online" }, { label: "Cheque", value: "Cheque" }, { label: "Wire Transfer", value: "Wire Transfer" }],
            DonationType: { label: "Online", value: "Online" }, Projects: [], Project: null, SelectRowProp: selectRowProp,
            ProjectSectors: [], ProjectSector: null, ProjectSelectForView: null, Banks: [], Bank: null,
            DonationOptions: [{ label: "Panchayat/Ward", value: "panchayatWard" }, { label: "Project", value: "project" }, { label: "Pool Fund", value: "poolFund" }]
        };
    }

    componentWillMount() {
        this.setState({ Status: this.props.match.params["status"] }, () => {
            if (!this.state.Status) {  // if status is null ,initiate new payment else show message

                MyAjax( // check if the user completed his profile
                    ApiUrl + "/api/Partner/GetPartner?PartnerId=",
                    (data) => {
                        if (data["partner"]["City_Id"] === null) {
                            toast("Please complete your profile before proceeding", {
                                type: toast.TYPE.INFO
                            });
                            this.props.history.push("/partner-profile");
                        }
                        else if (data["partner"]["Pan"] === null || data["partner"]["Pan"] === "") {
                            toast("Please update your PAN before donating", {
                                type: toast.TYPE.INFO
                            });
                            this.props.history.push("/partner-profile");
                        }
                        else {
                            MyAjax(
                                ApiUrl + "/api/MasterData/GetDistricts",
                                (data) => { this.setState({ Districts: data["districts"] }) },
                                (error) => toast(error.responseText, {
                                    type: toast.TYPE.ERROR
                                })
                            );
                        }

                    },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                );


            }
        });
    }

    componentDidMount() {
        setUnTouched(document);
    }

    componentWillUnmount() {
        $(".modal").modal("hide");
    }

    getProjects() {
        var districtId = this.state.District ? this.state.District.value : null;
        var mandalMunicipalityId = this.state.MandalMunicipality ? this.state.MandalMunicipality.value : null;
        var panchayatWardId = this.state.PanchayatWard ? this.state.PanchayatWard.value : null;
        var sectorId = this.state.ProjectSector ? this.state.ProjectSector.value : null;

        var url = ApiUrl + "/api/Projects/GetProposals?sectorId=" + sectorId + "&masterProjectId=" +
            "&districtId=" + districtId + "&district=&mandalMunicipalityId=" + mandalMunicipalityId + "&mandalMunicipality=&panchayatWardId=" + panchayatWardId +
            "&panchayatWard=&area=&status=&fromDate=&toDate=&donationRequired=true&partnerName=&partnerEmail=&partnerPhone=&partnerCategoryId=&partnerSubCategoryId=&phaseId=&page=1&count=1000000";

        MyAjax(
            url,
            (data) => this.setState({ Projects: data["proposals"] }),
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );

    }

    render() {

        // return <h3 className="text-center">This page is under construction, please visit us later!</h3>

        if (!this.state.Status) {
            return (
                <div className="container">
                    <h1>Contribute for <span title="Smart Village Smart Ward">SVSW</span></h1>
                    <hr />
                    <div className="col-xs-12 text-center mbot20">
                        <div className="form-group donation-for" >

                            {/* <label>I wish to contribute for a</label> */}

                            <div className="col-md-6 col-md-offset-3">
                                <label>I wish to contribute for a</label>
                                <div className="form-group" >
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-users" aria-hidden="true"></i>
                                        </span>
                                        <Select className="donationFor form-control" name="donationFor" options={this.state.DonationOptions} placeholder="I wish to Contribute for" ref="donationFor" value={this.state.DonationOption} onChange={this.donationForChange.bind(this)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.DonationFor !== "" ?
                            <form onSubmit={this._handleSubmit.bind(this)}>
                                {
                                    this.state.DonationFor !== "poolFund" ?
                                        <div>
                                            <div className={this.state.DonationFor === "project" ? "col-md-3" : "col-md-4"}>
                                                <label>District</label>
                                                <div className="form-group" >
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                        </span>
                                                        <Select className="district form-control" name="district" options={this.state.Districts} placeholder="District" onChange={this.districtChange.bind(this)} ref="district" value={this.state.District} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={this.state.DonationFor === "project" ? "col-md-3" : "col-md-4"}>
                                                <label><span className="Select-menu-option Rural">Mandal</span>/<span className="Select-menu-option Urban">Municipality</span></label>
                                                <div className="form-group" >
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                        </span>
                                                        <Select
                                                            optionRenderer={(option) => {
                                                                return <span className={"Select-menu-option " + option.type}>{option.label}</span>;
                                                            }}
                                                            backspaceRemoves={false} className="mandalMunicipality form-control" name="mandalMunicipality" options={this.state.MandalsMunicipalities} placeholder="Mandal/Municipality" ref="mandalMunicipality" onChange={this.mandalMunicipalityChange.bind(this)} value={this.state.MandalMunicipality} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={this.state.DonationFor === "project" ? "col-md-3" : "col-md-4"}>
                                                <label>Panchayat/Ward</label>
                                                <div className="form-group" >
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                        </span>
                                                        <Select className="panchayatWard form-control" name="panchayatWard" options={this.state.PanchayatsWards} placeholder="Panchayat/Ward" onChange={this.panchayatWardChange.bind(this)} ref="panchayatWard" value={this.state.PanchayatWard} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={this.state.DonationFor === "project" ? "col-md-3" : "hidden"}>
                                                <label>Sector</label>
                                                <div className="form-group" >
                                                    <div className="input-group">
                                                        <span className="input-group-addon">
                                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                        </span>
                                                        <Select className="form-control" name="sector" options={this.state.ProjectSectors} placeholder="Sector" onChange={this.sectorChange.bind(this)} ref="sector" value={this.state.ProjectSector} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        : <div />
                                }


                                {this.state.DonationFor === "project" ?
                                    <div>
                                        <div className="col-md-12 mbot10 form-group" style={{ height: "auto" }}>
                                            <label>Select a project</label>
                                            <BootstrapTable data={this.state.Projects} striped hover selectRow={this.state.SelectRowProp}>
                                                <TableHeaderColumn isKey={true} dataField='Name' dataFormat={this.projectDetailsView.bind(this)} dataSort={true}>Name</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Sector' dataSort={true}>Sector</TableHeaderColumn>
                                                <TableHeaderColumn dataField='TotalCost' dataFormat={this.currencyViewFormatter.bind(this)} dataSort={true}>Cost</TableHeaderColumn>
                                                <TableHeaderColumn dataField='CreatedBy' dataSort={true}>Partner Name</TableHeaderColumn>
                                                <TableHeaderColumn dataField='Status' dataSort={true} >Status</TableHeaderColumn>
                                            </BootstrapTable>
                                            <input className="form-control hidden" name="forShowingError" ref="project" />
                                        </div>


                                        {
                                            this.state.ProjectSelectForView ?
                                                <div id="projectViewModal" className="modal fade" role="dialog" ref="projectViewModal">
                                                    <div className="modal-dialog modal-lg">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                                                <h4 className="modal-title">{this.state.ProjectSelectForView["Name"]}</h4>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div className="col-xs-6">
                                                                    <table className="table table-condensed table-bordered view-table">
                                                                        <tbody>
                                                                            <tr>
                                                                                <th>Sector</th>
                                                                                <td>{this.state.ProjectSelectForView["Sector"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Scope</th>
                                                                                <td>{this.state.ProjectSelectForView["Scope"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Submitted On</th>
                                                                                <td>{moment(this.state.ProjectSelectForView["CreateDate"]).format("DD-MM-YYYY")}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Submitted By</th>
                                                                                <td>{this.state.ProjectSelectForView["CreatedBy"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Partner Contribution</th>
                                                                                <td>{this.state.ProjectSelectForView["PartnerContribution"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Status</th>
                                                                                <td>{this.state.ProjectSelectForView["Status"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Detailed Estimate</th>
                                                                                <td><a className="pointer" href={this.state.ProjectSelectForView["DetailedEstimateAttachmentURL"]} download>Download</a></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div >
                                                                <div className="col-xs-6">
                                                                    <table className="table table-condensed table-bordered view-table">
                                                                        <tbody>
                                                                            <tr>
                                                                                <th>District</th>
                                                                                <td>{this.state.ProjectSelectForView["District"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Mandal/Municipality</th>
                                                                                <td>{this.state.ProjectSelectForView["MandalMunicipality"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Panchayat/Ward</th>
                                                                                <td>{this.state.ProjectSelectForView["PanchayatWard"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Address</th>
                                                                                <td>{this.state.ProjectSelectForView["Address"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Beneficiaries</th>
                                                                                <td>{this.state.ProjectSelectForView["Beneficiaries"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Beneficiaries Type</th>
                                                                                <td>{this.state.ProjectSelectForView["BeneficiariesType"]}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th>Other Attachments</th>
                                                                                <td><a className={"pointer " + (this.state.ProjectSelectForView["OtherAttachments"] === null ? "hidden" : "")} onClick={this.downloadOtherAttachments.bind(this)}>Download</a></td>
                                                                            </tr>



                                                                        </tbody>
                                                                    </table>
                                                                </div >
                                                                <div className="col-xs-12 mbot20">
                                                                    <div className="communication-block col-xs-12">
                                                                        <div className="mbot20">
                                                                            <label>Proposal Description</label>
                                                                            <RichTextEditor className="readOnly" readOnly={true} value={RichTextEditor.createValueFromString(this.state.ProjectSelectForView["Description"], 'html')} />
                                                                        </div>
                                                                        <div>
                                                                            <label>Proposal Justification</label>
                                                                            <RichTextEditor className="readOnly" readOnly={true} value={RichTextEditor.createValueFromString(this.state.ProjectSelectForView["Justification"], 'html')} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="clearfix"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <div />
                                        }
                                    </div>

                                    :
                                    <div />
                                }
                                <div className="col-md-4">
                                    <label>Description</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-info-circle" aria-hidden="true"></i>
                                            </span>
                                            <input className="form-control" name="description" ref="description" placeholder="Description" maxLength="100" autoComplete="off" />
                                        </div>
                                    </div>
                                </div>


                                <div className="col-md-4">
                                    <label>Amount</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-inr" aria-hidden="true"></i>
                                            </span>
                                            <input type="number" min="1" className="form-control" name="amount" ref="amount" placeholder="Amount" autoComplete="off" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>Type</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-money" aria-hidden="true"></i>
                                            </span>
                                            <Select className="donationType form-control" name="donationType" options={this.state.DonationTypes} placeholder="Donation Type" onChange={this.donationTypeChange.bind(this)} ref="donationType" value={this.state.DonationType} />
                                        </div>
                                    </div>
                                </div>
                                <div className={" " + (this.state.DonationType.label !== "Online" ? "" : "hidden")}>

                                    <div className="col-md-4">
                                        <label>Bank Name</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                                                </span>
                                                <Select className="form-control" name="bankName" options={this.state.Banks} placeholder="Bank Name" onChange={this.bankNameChange.bind(this)} ref="bankName" value={this.state.Bank} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label>Bank Branch</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" name="bankBranch" ref="bankBranch" placeholder="Bank Branch" autoComplete="off" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"col-md-4 " + (this.state.DonationType.label === "Cheque" ? "" : "hidden")}>
                                        <label>Cheque No.</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" name="chequeNo" ref="chequeNo" placeholder="Cheque No." autoComplete="off" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={"col-md-4 " + (this.state.DonationType.label === "Wire Transfer" ? "" : "hidden")}>
                                        <label>Transaction Ref No.</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" name="refNo" ref="refNo" placeholder="Transaction Ref No." autoComplete="off" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    {
                                        this.state.DonationType.label === "Cheque" ?
                                            <div className="alert alert-info">
                                                <div>Please write a Cheque or DD for “SMART ANDHRA PRADESH FOUNDATION”, Payable at Vijayawada.</div>
                                                <div>Please mention Partner Name, Project Name &amp; Location of the Project behind the Cheque</div>
                                            </div>
                                            :
                                            <div />
                                    }
                                    {
                                        this.state.DonationType.label === "Wire Transfer" ?

                                            <div>
                                                <div className="alert alert-info">Please Transfer your Contribution via NEFT, RTGS or IMPS to the Following Account (Standard Bank Transaction charges apply)</div>
                                                <table className="table view-table table-condensed table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <th>Name</th>
                                                            <td><b>SMART ANDHRA PRADESH FOUNDATION</b></td>
                                                        </tr>
                                                        <tr>
                                                            <th>Bank</th>
                                                            <td><b>ANDHRA BANK</b></td>
                                                        </tr>
                                                        <tr>
                                                            <th>A/C No</th>
                                                            <td><b>307911100000061</b></td>
                                                        </tr>
                                                        <tr>
                                                            <th>IFSC Code</th>
                                                            <td><b>ANDB0003079</b></td>
                                                        </tr>
                                                        <tr>
                                                            <th>BMICR Code</th>
                                                            <td><b>522011592</b></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            :
                                            <div />
                                    }
                                </div>

                                <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center form-group">
                                    <button type="submit" name="submit" className="btn btn-primary">Contribute</button>
                                    <div className="loader"></div>
                                </div>
                                <div className="clearfix"></div>

                                <div className="alert alert-info alert-dismissable">
                                    <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
                                    Donations made to Smart AP Foundation qualify for exemption under sec 80G(5)(Vi) of Income Tax Act, 1961. (50% of contribution
                                    or 10% of adjusted gross total Income whichever is lower)
                                </div>

                            </form>
                            :
                            <div />
                    }
                    <div className="paytm"></div>

                </div >
            );
        }
        else {
            if (this.state.Status === "success") {
                return (
                    <div className="text-center">
                        <h1>Thank you for your valueble contribution!</h1>
                        <p>You can review your contribution and track project progress at <span className="myLink pointer" onClick={() => this.props.history.push("/my-donations")}> My Contributions </span> Page</p>
                        <div style={{ padding: "5px 10px", backgroundColor: "#cccccc", fontSize: "15px" }}>
                            <div>partner@smartap.foundation | +91- 8008944791</div>
                            <a href="https://www.smart.ap.gov.in">www.smart.ap.gov.in</a>
                        </div>
                    </div>
                )
            }
            else {
                return (<div className="text-center">
                    <h1>Payment Failed</h1>
                    <p>Retry the payment or contact support team for additional details!</p>
                    <div style={{ padding: "5px 10px", backgroundColor: "#cccccc", fontSize: "15px" }}>
                        <div>partner@smartap.foundation | +91- 8008944791</div>
                        <a href="https://www.smart.ap.gov.in">www.smart.ap.gov.in</a>
                    </div>
                </div>
                )

            }
        }

    }

    donationForChange(item) {
        if (item) {
            this.setState(
                {
                    DonationFor: item.value, DonationOption: item,
                    District: null, MandalsMunicipalities: [], MandalMunicipality: null, PanchayatsWards: [],
                    PanchayatWard: null, Projects: [], Project: null, DonationType: { label: "Online", value: "Online" }
                }, () => {
                    if (this.state.DonationFor === "project") {
                        removePreviousErrors(this.refs.district.wrapper);
                        removePreviousErrors(this.refs.mandalMunicipality.wrapper);
                        removePreviousErrors(this.refs.panchayatWard.wrapper);
                        removePreviousErrors(this.refs.donationType.wrapper);
                        removePreviousErrors(this.refs.description);
                        removePreviousErrors(this.refs.amount);
                        removePreviousErrors(this.refs.bankName.wrapper);
                        removePreviousErrors(this.refs.bankBranch);
                        removePreviousErrors(this.refs.chequeNo);
                        removePreviousErrors(this.refs.refNo);


                        this.refs.description.value = "";
                        this.refs.amount.value = "";
                        this.refs.bankName.value = "";
                        this.refs.bankBranch.value = "";
                        this.refs.chequeNo.value = "";
                        this.refs.refNo.value = "";

                        if (this.state.ProjectSectors.length === 0) {
                            MyAjax(
                                ApiUrl + "/api/Projects/GetProjectSectors",
                                (data) => { this.setState({ ProjectSectors: data["projectSectors"] }) },
                                (error) => toast(error.responseText, {
                                    type: toast.TYPE.ERROR
                                })
                            );
                            this.getProjects();

                        }
                    }
                });
        }
        else {
            this.setState({ DonationFor: "", DonationOption: item });
        }

    }

    districtChange(val) {
        this.setState({ District: val, MandalMunicipality: null, PanchayatWard: null }, () => {
            if (this.state.DonationFor === "project") {
                this.getProjects();
            }
            if (this.state.District && this.state.District.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetMandalsMunicipalities?DistrictId=" + this.state.District.value,
                    (data) => { this.setState({ MandalsMunicipalities: data["mandalsMunicipalities"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                );
                if (this.state.DonationFor === "panchayatWard") {
                    showErrorsForInput(this.refs.district.wrapper, null);
                }
            }
            else if (this.state.DonationFor === "panchayatWard") {
                showErrorsForInput(this.refs.district.wrapper, ["Please select a valid district"]);
            }
        });
    }

    mandalMunicipalityChange(val) {
        this.setState({ MandalMunicipality: val, PanchayatWard: null }, () => {
            if (this.state.DonationFor === "project") {
                this.getProjects();
            }
            if (this.state.MandalMunicipality && this.state.MandalMunicipality.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetPanchayatsWards?MandalMunicipalityId=" + this.state.MandalMunicipality.value + "&PartnerType=",
                    (data) => { this.setState({ PanchayatsWards: data["panchayatsWards"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                if (this.state.DonationFor === "project") {
                    this.getProjects();
                }
                if (this.state.DonationFor === "panchayatWard") {
                    showErrorsForInput(this.refs.mandalMunicipality.wrapper, null);
                }
            }
            else if (this.state.DonationFor === "panchayatWard") {
                showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a valid Mandal/Municipality"]);
            }
        });
    }

    panchayatWardChange(val) {
        this.setState({ PanchayatWard: val }, () => {
            if (this.state.DonationFor === "project") {
                this.getProjects();
            }
            if (this.state.PanchayatWard && this.state.DonationFor === "panchayatWard") {
                showErrorsForInput(this.refs.panchayatWard.wrapper, null);
            }
            else if (this.state.DonationFor === "panchayatWard") {
                showErrorsForInput(this.refs.panchayatWard.wrapper, ["Please select a valid Panchayat/Ward"]);
            }
        });
    }

    sectorChange(val) {
        this.setState({ ProjectSector: val }, () => {
            if (this.state.DonationFor === "project") {
                this.getProjects();
            }
        });
    }

    projectChange(val) {
        this.setState({ Project: val });
    }

    donationTypeChange(val) {
        this.setState({ DonationType: val });
        if (val) {
            showErrorsForInput(this.refs.donationType.wrapper, null);
        }
        else {
            showErrorsForInput(this.refs.donationType.wrapper, ["Please select a valid donation type"]);
        }
        if (val.label !== "online" && this.state.Banks.length === 0) {

            MyAjax(
                ApiUrl + "/api/MasterData/GetBanks",
                (data) => { this.setState({ Banks: data["banks"] }) },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            );
        }
    }

    bankNameChange(val) {
        this.setState({ Bank: val });
        if (val) {
            showErrorsForInput(this.refs.bankName.wrapper, null);
        }
        else {
            showErrorsForInput(this.refs.bankName.wrapper, ["Please select a bank"]);
        }
    }

    _handleSubmit(e) {

        e.preventDefault();
        toast.dismiss();

        $(e.currentTarget.getElementsByClassName('form-control')).map((i, ele) => {
            ele.classList.remove("un-touched");
            return null;
        })

        if (!this.validate(e)) {
            return;
        }


        $(".loader").show();
        $("button[name='submit']").hide();


        var data = {};
        if (this.state.DonationFor === "project") {
            data["projectId"] = this.state.Project.Id;
            data["panchayatWardId"] = this.state.Project.PanchayatWardId;
        }
        else if (this.state.DonationFor === "panchayatWard") {
            data["panchayatWardId"] = this.state.PanchayatWard.value;
        }
        data["description"] = this.refs.description.value.trim();
        data["amount"] = this.refs.amount.value.trim();
        data["donationType"] = this.state.DonationType.label;
        if (this.state.DonationType.value !== "Online") {
            data["bankName"] = this.state.Bank.label;
            data["bankBranch"] = this.refs.bankBranch.value.trim();
            if (this.state.DonationType.value === "Cheque") {
                data["chequeNo"] = this.refs.chequeNo.value.trim();
            }
            if (this.state.DonationType.value === "Wire Transfer") {
                data["refNo"] = this.refs.refNo.value.trim();
            }
        }


        if (this.state.DonationType.value !== "Online") {
            var url = ApiUrl + "/api/Donation/MakeOfflinePayment";
            try {
                MyAjax(
                    url,
                    (data) => {
                        this.setState({ Status: "success" });
                    },
                    (error) => {
                        this.setState({ Status: "fail" });
                    },
                    "POST",
                    data
                );
            }
            catch (e) {
                toast("An error occoured, please try again!", {
                    type: toast.TYPE.ERROR
                });
                $(".loader").hide();
                $("button[name='submit']").show();
                return false;
            }
        }
        else {
            var url = ApiUrl + "/api/Donation/MakeOnlinePayment";
            try {
                MyAjax(
                    url,
                    (data) => {
                        $(".paytm").html(data["outputHTML"]);
                        $("#paytmForm").submit();
                    },
                    (error) => {
                        toast("An error occoured, please try again!", {
                            type: toast.TYPE.ERROR
                        });
                        $(".loader").hide();
                        $("button[name='submit']").show();
                        return false;
                    }, "POST", data
                );
            }
            catch (e) {
                toast("An error occoured, please try again!", {
                    type: toast.TYPE.ERROR
                });
                $(".loader").hide();
                $("button[name='submit']").show();
                return false;
            }
        }

    }

    validate(e) {
        var isSubmit = e.type === "submit";
        var success = true;
        //district
        if (!this.state.District && this.state.DonationFor === "panchayatWard") {
            showErrorsForInput(this.refs.district.wrapper, ["Please select a valid district"]);
            success = false;
            if (isSubmit) {
                $(this.refs.district.wrapper).find("input")[0].focus();
                isSubmit = false;
            }
        }

        //mandalMunicipality
        if (!this.state.MandalMunicipality && this.state.DonationFor === "panchayatWard") {
            showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a valid Mandal/Municipality"]);
            success = false;
            if (isSubmit) {
                $(this.refs.mandalMunicipality.wrapper).find("input")[0].focus();
                isSubmit = false;
            }
        }

        //panchayatWard
        if (!this.state.PanchayatWard && this.state.DonationFor === "panchayatWard") {
            showErrorsForInput(this.refs.panchayatWard.wrapper, ["Please select a valid Panchayat/Ward"]);
            success = false;
            if (isSubmit) {
                $(this.refs.panchayatWard.wrapper).find("input")[0].focus();
                isSubmit = false;
            }
        }

        //project
        if (this.state.DonationFor === "project") {
            if (!this.state.Project) {
                showErrorsForInput(this.refs.project, ["Please select a project"]);
                success = false;
            }
            else {
                showErrorsForInput(this.refs.project, []);
            }
        }

        //description
        if (this.state.DonationFor === "panchayatWard" && this.refs.description.value.trim() === "") {
            //required if donation for panchayat ward
            showErrorsForInput(this.refs.description, ["Please enter a valid description"]);
            success = false;
            if (isSubmit) {
                this.refs.description.focus();
                isSubmit = false;
            }
        }
        else {
            showErrorsForInput(this.refs.description, []);
        }

        //amount
        if (this.refs.amount.value.trim() === "") {
            showErrorsForInput(this.refs.amount, ["Please enter a valid amount"]);
            success = false;
            if (isSubmit) {
                this.refs.amount.focus();
                isSubmit = false;
            }
        }
        // else if (this.refs.amount.value < 10000 && this.state.DonationFor !== "poolFund") {
        //     showErrorsForInput(this.refs.amount, ["Please enter a valid amount"]);
        //     success = false;
        //     if (isSubmit) {
        //         this.refs.amount.focus();
        //         isSubmit = false;
        //     }
        //     toast("Donations less than Rs.10,000 made towards a panchayats or projects will be added to the SAPF pool fund.", {
        //         type: toast.TYPE.ERROR,
        //         autoClose: false
        //     });
        // }
        else {
            showErrorsForInput(this.refs.amount, []);
        }


        //donationType
        if (!this.state.DonationType.value) {
            showErrorsForInput(this.refs.donationType.wrapper, ["Please select a valid donation type"]);
            success = false;
        }

        if (this.state.DonationType.value !== "Online") {

            //bankName
            if (!this.state.Bank) {
                showErrorsForInput(this.refs.bankName.wrapper, ["Please select a bank"]);
                success = false;
                if (isSubmit) {
                    $(this.refs.bankNamewrapper).find("input")[0].focus();
                    isSubmit = false;
                }
            }
            else {
                showErrorsForInput(this.refs.bankName.wrapper, []);
            }

            //bankBranch
            if (this.refs.bankBranch.value.trim() === "") {
                showErrorsForInput(this.refs.bankBranch, ["Please enter a bank branch"]);
                success = false;
                if (isSubmit) {
                    this.refs.bankBranch.focus();
                    isSubmit = false;
                }
            }
            else {
                showErrorsForInput(this.refs.bankBranch, []);
            }

            //chequeNo
            if (this.state.DonationType.label === "Cheque") {
                if (this.refs.chequeNo.value.trim() === "") {
                    showErrorsForInput(this.refs.chequeNo, ["Please enter a cheque number"]);
                    success = false;
                    if (isSubmit) {
                        this.refs.chequeNo.focus();
                        isSubmit = false;
                    }
                }
                else {
                    showErrorsForInput(this.refs.chequeNo, []);
                }

            }

            //refNo
            if (this.state.DonationType.label === "Wire Transfer") {
                if (this.refs.refNo.value.trim() === "") {
                    showErrorsForInput(this.refs.refNo, ["Please enter the bank tansaction reference number"]);
                    success = false;
                    if (isSubmit) {
                        this.refs.refNo.focus();
                        isSubmit = false;
                    }
                }
                else {
                    showErrorsForInput(this.refs.refNo, []);
                }

            }

        }

        return success;
    }

    projectDetailsView(cell, row) {
        return <a className="pointer" onClick={() => this.viewProjectDetails(row)}>{cell}</a>
    }

    viewProjectDetails(row) {
        this.setState({ ProjectSelectForView: row }, () => {
            $("#projectViewModal").modal("toggle");
        });
    }

    currencyViewFormatter(cell, row) {
        return cell.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
    }

    downloadOtherAttachments() {
        this.state.ProjectSelectForView["OtherAttachments"].split('|').map((x => window.open(x)));
    }

}

export default Donate;


