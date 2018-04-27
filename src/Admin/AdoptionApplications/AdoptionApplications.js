import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../../Config';
import { MyAjax } from '../../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import './AdoptionApplications.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');


// import { Link } from 'react-router-dom';

class AdoptionApplications extends Component {

    constructor(props) {
        super(props);

        var roles = sessionStorage.getItem("smart_ap_roles");
        var officalLocation = sessionStorage.getItem("smart_ap_officialLocation");
        var IsCPO = false, IsMPDO = false, Status = "";
        if (roles.indexOf("CPO") !== -1) {
            IsCPO = true;
            Status = "CPO";
        }

        if (roles.indexOf("MPDO") !== -1 || roles.indexOf("MO") !== -1) {
            IsMPDO = true;
            Status = "MPDO";
        }

        this.state = {
            Applications: [], Application_Id: [], currentPage: 1, sizePerPage: 10, dataTotalSize: 0, IsCPO: IsCPO,
            IsMPDO: IsMPDO, area: "",
            districtId: null, district: "", mandalMunicipalityId: null, mandalMunicipality: "", panchayatWard: "",
            panchayatWardId: null, fromDate: null, toDate: null, status: Status, type: "", partnerName: "",
            partnerEmail: "", partnerPhone: "", partnerCategoryId: null, partnerSubCategoryId: null, IsDataAvailable: false, OfficialLocationDistrict: "",
            OfficialLocationMandalMunicipality: "", formChanged: 0, PartnerCategories: [], PartnerSubCategories: []
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
                type: this.props.location.state["type"],
                status: this.props.location.state["status"],
                fromDate: fromDate,
                toDate: toDate
            });
        }
    }

    componentDidMount() {
        this.refs.district.value = this.state.district;
        this.refs.mandalMunicipality.value = this.state.mandalMunicipality;
        this.refs.panchayatWard.value = this.state.panchayatWard;
        this.refs.area.value = this.state.area;
        this.refs.type.value = this.state.type;
        this.refs.status.value = this.state.status;
        this.refs.fromDate.value = this.state.fromDate;
        this.refs.toDate.value = this.state.toDate;


        var roles = sessionStorage.getItem("smart_ap_roles");
        var officalLocation = sessionStorage.getItem("smart_ap_officialLocation");
        if (roles.indexOf("CPO") !== -1) {
            this.refs.district.value = officalLocation;
            this.setState({ OfficialLocationDistrict: officalLocation });
        }
        if (roles.indexOf("MPDO") !== -1 || roles.indexOf("MO") !== -1) {
            this.refs.district.value = officalLocation.split(',')[0];
            this.refs.mandalMunicipality.value = officalLocation.split(',')[1];
            this.setState({
                OfficialLocationDistrict: officalLocation.split(',')[0],
                OfficialLocationMandalMunicipality: officalLocation.split(',')[1]
            });
        }
        this.getApplications(1, 10);
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    getApplications(page, count) {
        this.setState({ IsDataAvailable: false });
        var district = this.state.district ? this.state.district.trim() : this.state.district;
        var mandalMunicipality = this.state.mandalMunicipality ? this.state.mandalMunicipality.trim() : this.state.mandalMunicipality;
        var panchayatWard = this.state.panchayatWard ? this.state.panchayatWard.trim() : this.state.panchayatWard;
        var partnerName = this.state.partnerName ? this.state.partnerName.trim() : this.state.partnerName;
        var partnerEmail = this.state.partnerEmail ? this.state.partnerEmail.trim() : this.state.partnerEmail;
        var partnerPhone = this.state.partnerPhone ? this.state.partnerPhone.trim() : this.state.partnerPhone;
        var url = ApiUrl + "/api/Official/GetMyAllotedApplications?districtId=" + encodeURIComponent(this.state.districtId) +
            "&district=" + encodeURIComponent(district) +
            "&mandalMunicipalityId=" + encodeURIComponent(this.state.mandalMunicipalityId) +
            "&mandalMunicipality=" + encodeURIComponent(mandalMunicipality) +
            "&panchayatWardId=" + encodeURIComponent(this.state.panchayatWardId) +
            "&panchayatWard=" + encodeURIComponent(panchayatWard) +
            "&fromDate=" + encodeURIComponent(this.state.fromDate) +
            "&toDate=" + encodeURIComponent(this.state.toDate) +
            "&status=" + encodeURIComponent(this.state.status) +
            "&area=" + encodeURIComponent(this.state.area) +
            "&type=" + encodeURIComponent(this.state.type) +
            "&partnerName=" + encodeURIComponent(partnerName) +
            "&partnerEmail=" + encodeURIComponent(partnerEmail) +
            "&partnerPhone=" + encodeURIComponent(partnerPhone) +
            "&partnerCategoryId=" + encodeURIComponent(this.state.partnerCategoryId) +
            "&partnerSubCategoryId=" + encodeURIComponent(this.state.partnerSubCategoryId) +
            "&page=" + page +
            "&count=" + count;

        MyAjax(
            url,
            (data) => this.setState({ Applications: data["applications"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }),
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
                <div>
                    <h3>Partnership Applications</h3>
                </div>
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
                            <label>Type</label>
                            <select className="form-control" name="type" ref="type" autoComplete="off">
                                <option value="">All</option>
                                <option>General</option>
                                <option>Sector</option>
                            </select>
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Status</label>
                            <select className="form-control" name="status" ref="status" autoComplete="off">
                                <option value="">All</option>
                                <option>Application Submitted</option>
                                <option>CPO</option>
                                <option>MPDO</option>
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
                <div className="clearfix"></div>
                {
                    !this.state.IsDataAvailable ? < div className="loader visible" ></div >
                        :
                        <div>
                            <BootstrapTable data={this.state.Applications} striped hover remote={remote} pagination={true}
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
                                }} exportCSV={ true } csvFileName="AdoptionApplications.csv"
                            >
                                <TableHeaderColumn dataField='Date' columnTitle={true} dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} csvFormat={(val) => moment(val).format("DD-MM-YYYY")} width='100'>Date</TableHeaderColumn>
                                <TableHeaderColumn dataField='Type' columnTitle={true} dataSort={true} width='40' dataFormat={this.adoptionTypeView.bind(this)}>Type</TableHeaderColumn>
                                <TableHeaderColumn dataField='PartnerName' columnTitle={true} dataSort={true} csvHeader="Partner Name">Partner Name</TableHeaderColumn>
                                <TableHeaderColumn dataField='Email' columnTitle={true} dataSort={true}>Email</TableHeaderColumn>
                                <TableHeaderColumn dataField='PhoneNumber' columnTitle={true} width="120" dataSort={true}>Phone</TableHeaderColumn>
                                <TableHeaderColumn dataField='District' columnTitle={true} dataSort={true}>District</TableHeaderColumn>
                                <TableHeaderColumn dataField='MandalMunicipality' columnTitle={true} dataSort={true} csvHeader="Mandal/Municipality">Mandal/Municipality</TableHeaderColumn>
                                <TableHeaderColumn dataField='PanchayatWard' columnTitle={true} dataSort={true} csvHeader="Panchayat/Ward">Panchayat/Ward</TableHeaderColumn>
                                <TableHeaderColumn dataField='Status' width="120" columnTitle={true} dataSort={true} dataFormat={this.statusView.bind(this)} >Status</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="text-center" isKey={true} dataField='Id' dataFormat={this.editViewFormatter.bind(this)}  export={false} width='35'></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
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
            district: this.refs.district.value,
            mandalMunicipality: this.refs.mandalMunicipality.value,
            panchayatWard: this.refs.panchayatWard.value,
            area: this.refs.area.value,
            type: this.refs.type.value,
            status: this.refs.status.value,
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getApplications(1, this.state.sizePerPage);
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
            district: this.refs.district.value,
            mandalMunicipality: this.refs.mandalMunicipality.value,
            panchayatWard: this.refs.panchayatWard.value,
            area: this.refs.area.value,
            type: this.refs.type.value,
            status: this.refs.status.value,
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getApplications(1, this.state.sizePerPage);
        });
    }

    editViewFormatter(cell, row) {

        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => window.open("/portal/#/admin/adoption-application/" + row["Id"], "_blank")}></i>;
        // var roles = sessionStorage.getItem("smart_ap_roles");
        // if (roles.indexOf("Approver") !== -1) {
        //     return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => window.open("/portal/#/admin/adoption-application/" + row["Id"], "_blank")}></i>;
        // }
        // else {
        //     return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/adoption-application/" + row["Id"])}></i>;
        // }
    }

    adoptionTypeView(cell, row) {
        if (cell === "General") {
            return <span title="General">G</span>
        }
        else {
            return <span title="Sector">S</span>
        }
    }

    statusView(cell, row) {
        return cell === "Application Submitted" ? "Submitted" : cell;
    }

    onPageChange(page, sizePerPage) {
        this.getApplications(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getApplications(this.state.currentPage, sizePerPage);
    }
}

export default AdoptionApplications;