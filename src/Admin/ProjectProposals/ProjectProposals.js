import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../../Config';
import { MyAjax } from '../../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

class ProjectProposals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "", Proposals: [], currentPage: 1, sizePerPage: 10, dataTotalSize: 0, IsDataAvailable: false,
            sectorId: null, districtId: null, district: "", mandalMunicipalityId: null, mandalMunicipality: "",
            panchayatWardId: null, panchayatWard: "", area: "", status: "", partnerName: "", partnerCategoryId: null,
            partnerSubCategoryId: null, partnerEmail: "", partnerPhone: "", fromDate: "", toDate: "", ProjectSectors: [],
            IsCPO: false, IsMPDO: false, OfficialLocationDistrict: "", OfficialLocationMandalMunicipality: "",
            PartnerCategories: [], PartnerSubCategories: []
        };
    }

    componentWillMount() {

        var url = ApiUrl + "/api/MasterData/GetCategories";
        MyAjax(
            url,
            (data) => this.setState({ PartnerCategories: data["categories"] }),
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );

        if (this.props.location.state) {
            var fromDate = "";
            var toDate = "";
            if (this.props.location.state["fromDate"] !== "") {
                var myFromDate = new Date(this.props.location.state["fromDate"]);
                var dd = myFromDate.getDate();
                var mm = myFromDate.getMonth() + 1; //January is 0!
                var yyyy = myFromDate.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                fromDate = yyyy + '-' + mm + '-' + dd;
            }
            if (this.props.location.state["toDate"] !== "") {
                var myToDate = new Date(this.props.location.state["toDate"]);
                var dd = myToDate.getDate();
                var mm = myToDate.getMonth() + 1; //January is 0!
                var yyyy = myToDate.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var toDate = yyyy + '-' + mm + '-' + dd;
            }
            this.setState({
                area: this.props.location.state["area"],
                districtId: this.props.location.state["districtId"],
                district: this.props.location.state["district"],
                mandalMunicipalityId: this.props.location.state["mandalMunicipalityId"],
                mandalMunicipality: this.props.location.state["mandalMunicipality"],
                panchayatWard: this.props.location.state["panchayatWard"],
                panchayatWardId: this.props.location.state["panchayatWardId"],
                sectorId: this.props.location.state["sectorId"],
                status: this.props.location.state["status"],
                fromDate: fromDate,
                toDate: toDate
            });

            MyAjax(
                ApiUrl + "/api/Projects/GetProjectSectors",
                (data) => { this.setState({ ProjectSectors: data["projectSectors"] }) },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            );
        }
    }

    componentDidMount() {

        this.refs.district.value = this.state["district"];
        this.refs.mandalMunicipality.value = this.state["mandalMunicipality"];
        this.refs.panchayatWard.value = this.state["panchayatWard"];
        this.refs.area.value = this.state["area"];
        this.refs.sector.value = this.state["sectorId"];
        this.refs.status.value = this.state["status"];
        this.refs.fromDate.value = this.state["fromDate"];
        this.refs.toDate.value = this.state["toDate"];


        var roles = sessionStorage.getItem("smart_ap_roles");
        var officalLocation = sessionStorage.getItem("smart_ap_officialLocation");
        if (roles.indexOf("CPO") !== -1) {
            this.refs.district.value = officalLocation;
            this.setState({ IsCPO: true, OfficialLocationDistrict: officalLocation });
            if (!this.state.status) {
                this.refs.status.value = "In Progress";
                this.setState({ status: "In Progress" });
            }
        }
        if (roles.indexOf("MPDO") !== -1 || roles.indexOf("MO") !== -1) {
            this.refs.district.value = officalLocation.split(',')[0];
            this.refs.mandalMunicipality.value = officalLocation.split(',')[1];
            this.setState({
                IsMPDO: true, OfficialLocationDistrict: officalLocation.split(',')[0],
                OfficialLocationMandalMunicipality: officalLocation.split(',')[1]
            });
            if (!this.state.status) {
                this.refs.status.value = "In Progress";
                this.setState({ status: "In Progress" });
            }
        }
        this.getProposals(this.state.currentPage, this.state.sizePerPage);
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    getProposals(page, count) {
        this.setState({ IsDataAvailable: false });
        var district = this.state.district ? this.state.district.trim() : this.state.district;
        var mandalMunicipality = this.state.mandalMunicipality ? this.state.mandalMunicipality.trim() : this.state.mandalMunicipality;
        var panchayatWard = this.state.panchayatWard ? this.state.panchayatWard.trim() : this.state.panchayatWard;
        var partnerName = this.state.partnerName ? this.state.partnerName.trim() : this.state.partnerName;
        var partnerEmail = this.state.partnerEmail ? this.state.partnerEmail.trim() : this.state.partnerEmail;
        var partnerPhone = this.state.partnerPhone ? this.state.partnerPhone.trim() : this.state.partnerPhone;

        var url = ApiUrl + "/api/Projects/GetProposals?masterProjectId=" +
            "&sectorId=" + encodeURIComponent(this.state.sectorId) +
            "&districtId=&district=" + encodeURIComponent(district) +
            "&mandalMunicipalityId=&mandalMunicipality=" + encodeURIComponent(mandalMunicipality) +
            "&panchayatWardId=&panchayatWard=" + encodeURIComponent(panchayatWard) +
            "&area=" + encodeURIComponent(this.refs.area.value) +
            "&status=" + encodeURIComponent(this.refs.status.value) +
            "&donationRequired=&partnerName=" + encodeURIComponent(partnerName) +
            "&partnerEmail=" + encodeURIComponent(partnerEmail) +
            "&partnerPhone=" + encodeURIComponent(partnerPhone) +
            "&partnerCategoryId=" + encodeURIComponent(this.state.partnerCategoryId) +
            "&partnerSubCategoryId=" + encodeURIComponent(this.state.partnerSubCategoryId) +
            "&phaseId=&fromDate=" + encodeURIComponent(this.state.fromDate) +
            "&toDate=" + encodeURIComponent(this.state.toDate) +
            "&page=" + page +
            "&count=" + count;

        MyAjax(
            url,
            (data) => this.setState({ Proposals: data["proposals"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }),
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );
    }

    render() {
        return (
            <div className="col-xs-12">
                <h2>Project Proposals<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/project-proposal") }}>Add Proposal</button></span></h2>

                <div className="col-xs-12 bg-grey search-container">
                    <form name="search-form" id="searchForm" onChange={() => this.setState({ formChanged: 1 })}>
                        <div className="col-sm-2 form-group">
                            <label>Partner Name</label>
                            <input className="form-control" type="text" name="partnerName" ref="partnerName" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Partner Email</label>
                            <input className="form-control" type="text" name="partnerEmail" ref="partnerEmail" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Partner Phone</label>
                            <input className="form-control" type="text" name="partnerPhone" ref="partnerPhone" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Partner Category</label>
                            <select className="form-control" name="partnerCategory" ref="partnerCategory" autoComplete="off" onChange={this.partnerCategoryChanged.bind(this)}>
                                <option value="">All</option>
                                {
                                    this.state.PartnerCategories.map((item) => {
                                        return <option key={item.label} value={item.value}>{item.label}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Partner Sub Category</label>
                            <select className="form-control" name="partnerSubCategory" ref="partnerSubCategory" autoComplete="off">
                                <option value="">All</option> {
                                    this.state.PartnerSubCategories.map((item) => {
                                        return <option key={item.label} value={item.value}>{item.label}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Sector</label>
                            <select className="form-control" name="sector" ref="sector" autoComplete="off">
                                <option value="">All</option>
                                {
                                    this.state.ProjectSectors.map((ele) => {
                                        return <option value={ele["value"]}>{ele["label"]}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Status</label>
                            <select className="form-control" name="status" ref="status" autoComplete="off">
                                <option value="">All</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                            </select>
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Area</label>
                            <select className="form-control" name="area" ref="area" autoComplete="off">
                                <option value="">All</option>
                                <option>Rural</option>
                                <option>Urban</option>
                            </select>
                        </div>
                        <div className={"col-sm-2 form-group "}>
                            <label>District</label>
                            <input className="form-control" type="text" name="district" ref="district" autoComplete="off" disabled={this.state.IsCPO || this.state.IsMPDO} />
                        </div>
                        <div className={"col-sm-2 form-group "}>
                            <label>Mandal/Municipality</label>
                            <input className="form-control" type="text" name="mandalMunicipality" ref="mandalMunicipality" autoComplete="off" disabled={this.state.IsMPDO} />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Panchayat/Ward</label>
                            <input className="form-control" type="text" name="panchayatWard" ref="panchayatWard" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>From Date</label>
                            <input className="date form-control" type="text" name="fromDate" ref="fromDate" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>To Date</label>
                            <input className="date form-control" type="text" name="toDate" ref="toDate" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 button-block">
                            <input type="button" className="btn btn-success" value="Search" onClick={this.search.bind(this)} />
                            <input type="button" className="btn btn-default" value="Clear" onClick={this.clear.bind(this)} />
                        </div>
                    </form>
                </div>

                {this.state.IsDataAvailable ?
                    <BootstrapTable data={this.state.Proposals} key={this.state.IsDataAvailable} striped hover remote={remote} pagination={true}
                        fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}
                        options={{
                            sizePerPage: this.state.sizePerPage,
                            onPageChange: this.onPageChange.bind(this),
                            sizePerPageList: [{ text: '10', value: 10 },
                            { text: '25', value: 25 },
                            { text: 'ALL', value: this.state.dataTotalSize }],
                            page: this.state.currentPage,
                            onSizePerPageList: this.onSizePerPageList.bind(this),
                            paginationPosition: 'bottom'
                        }} exportCSV={true} csvFileName="Projects.csv"
                    >
                        <TableHeaderColumn dataField='CreatedDate' dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} csvFormat={(val) => moment(val).format("DD-MM-YYYY")} width='130'>Date</TableHeaderColumn>
                        <TableHeaderColumn dataField='ProjectCode' dataSort={true}>Code</TableHeaderColumn>
                        <TableHeaderColumn dataField='Name' dataSort={true}>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='Sector' dataSort={true}>Sector</TableHeaderColumn>
                        <TableHeaderColumn dataField='District' dataSort={true}>District</TableHeaderColumn>
                        <TableHeaderColumn dataField='MandalMunicipality' columnTitle={true} dataSort={true} csvHeader="Mandal/Municipality">Mandal/Municipality</TableHeaderColumn>
                        <TableHeaderColumn dataField='PanchayatWard' columnTitle={true} dataSort={true} csvHeader="Panchayat/Ward">Panchayat/Ward</TableHeaderColumn>
                        <TableHeaderColumn dataField='CreatedBy' dataSort={true}>Created By</TableHeaderColumn>
                        <TableHeaderColumn dataField='PartnerContribution' dataSort={true} dataFormat={this.currencyViewFormatter.bind(this)} csvFieldType='currency'>Contribution</TableHeaderColumn>
                        <TableHeaderColumn dataField='Status' dataSort={true} >Status</TableHeaderColumn>
                        <TableHeaderColumn columnClassName="text-center" dataField='Id' isKey={true} dataFormat={this.editViewFormatter.bind(this)} width='35' export={false}></TableHeaderColumn>
                    </BootstrapTable>
                    :
                    <div className="loader visible"></div>
                }
            </div>
        );
    }


    partnerCategoryChanged() {
        var partnerCategoryId = this.refs.partnerCategory.value;
        var url = ApiUrl + "/api/MasterData/GetSubCategories?CategoryId=" + partnerCategoryId;
        MyAjax(
            url,
            (data) => this.setState({ PartnerSubCategories: data["subCategories"] }),
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );
    }


    search() {
        if (this.state.formChanged === 0) {
            return;
        }
        this.setState({
            formChanged: 0,
            partnerName: this.refs.partnerName.value,
            partnerEmail: this.refs.partnerEmail.value,
            partnerPhone: this.refs.partnerPhone.value,
            partnerCategoryId: this.refs.partnerCategory.value,
            partnerSubCategoryId: this.refs.partnerSubCategory.value,
            sectorId: this.refs.sector.value,
            status: this.refs.status.value,
            area: this.refs.area.value,
            district: this.refs.district.value,
            mandalMunicipality: this.refs.mandalMunicipality.value,
            panchayatWard: this.refs.panchayatWard.value,
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getProposals(1, this.state.sizePerPage);
        });
    }

    clear() {
        $("#searchForm").find("input[type=text]:enabled").val("");
        $("#searchForm").find("input[type=date]").val("");
        $("#searchForm").find("select").val("");
        this.setState({
            formChanged: 1,
            partnerName: this.refs.partnerName.value,
            partnerEmail: this.refs.partnerEmail.value,
            partnerPhone: this.refs.partnerPhone.value,
            partnerCategoryId: this.refs.partnerCategory.value,
            partnerSubCategoryId: this.refs.partnerSubCategory.value,
            sectorId: this.refs.sector.value,
            status: this.refs.status.value,
            area: this.refs.area.value,
            district: this.refs.district.value,
            mandalMunicipality: this.refs.mandalMunicipality.value,
            panchayatWard: this.refs.panchayatWard.value,
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getProposals(1, this.state.sizePerPage);
        });
    }

    onPageChange(page, sizePerPage) {
        this.getProposals(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getProposals(this.state.currentPage, sizePerPage);
    }

    editViewFormatter(cell, row) {
        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/project-proposal/" + row["Id"])}></i>;
    }
    
    currencyViewFormatter(cell, row) {
        return cell.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
    }
}

export default ProjectProposals;
