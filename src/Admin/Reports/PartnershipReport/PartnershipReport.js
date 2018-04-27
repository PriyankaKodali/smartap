import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { ApiUrl } from '../../../Config';
import { MyAjax } from '../../../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;


// import { Link } from 'react-router-dom';

class PartnershipReport extends Component {

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
            ReportData: [], IsCPO: IsCPO,
            IsMPDO: IsMPDO, areaType: "",
            districtId: null, district: "", mandalMunicipalityId: null, mandalMunicipality: "", panchayatWard: "",
            panchayatWardId: null, fromDate: null, toDate: null, IsDataAvailable: false, OfficialLocationDistrict: "",
            OfficialLocationMandalMunicipality: "", formChanged: 0
        };
    }

    componentWillMount() {
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
                toDate = yyyy + '-' + mm + '-' + dd;
            }
            this.setState({
                areaType: this.props.location.state["areaType"],
                districtId: this.props.location.state["districtId"],
                district: this.props.location.state["district"],
                mandalMunicipalityId: this.props.location.state["mandalMunicipalityId"],
                mandalMunicipality: this.props.location.state["mandalMunicipality"],
                panchayatWard: this.props.location.state["panchayatWard"],
                panchayatWardId: this.props.location.state["panchayatWardId"],
                areaType: this.props.location.state["areaType"],
                fromDate: fromDate,
                toDate: toDate
            });
        }
    }

    componentDidMount() {

        // this.refs.district.value = this.state.district;
        // this.refs.mandalMunicipality.value = this.state.mandalMunicipality;
        // this.refs.panchayatWard.value = this.state.panchayatWard;
        // this.refs.areaType.value = this.state.areaType;
        // this.refs.type.value = this.state.type;
        // this.refs.status.value = this.state.status;
        // this.refs.fromDate.value = this.state.fromDate;
        // this.refs.toDate.value = this.state.toDate;


        // var roles = sessionStorage.getItem("smart_ap_roles");
        // var officalLocation = sessionStorage.getItem("smart_ap_officialLocation");
        // if (roles.indexOf("CPO") !== -1) {
        //     this.refs.district.value = officalLocation;
        //     this.setState({ OfficialLocationDistrict: officalLocation });
        // }
        // if (roles.indexOf("MPDO") !== -1 || roles.indexOf("MO") !== -1) {
        //     this.refs.district.value = officalLocation.split(',')[0];
        //     this.refs.mandalMunicipality.value = officalLocation.split(',')[1];
        //     this.setState({
        //         OfficialLocationDistrict: officalLocation.split(',')[0],
        //         OfficialLocationMandalMunicipality: officalLocation.split(',')[1]
        //     });
        // }
        this.getApplications(1, 10);
    }

    getApplications(page, count) {
        this.setState({ IsDataAvailable: false });

        var url = ApiUrl + "/api/Reports/GetPartnershipDetailsOfAllDistricts?AreaType=&FromDate=&ToDate=";
        MyAjax(
            url,
            (data) => this.setState({ ReportData: data["reportData"], IsDataAvailable: true }),
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
                    <h3>Partnership Applications Report</h3>
                </div>
                <div className="col-xs-12 bg-grey search-container">
                    <form name="search-form" id="searchForm" onChange={() => this.setState({ formChanged: 1 })}>
                        <div className="col-sm-2 form-group">
                            <label>Area Type</label>
                            <select className="form-control" name="areaType" ref="areaType" autoComplete="off">
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
                            {/* <input type="button" className="btn btn-success" value="Search" onClick={this.search.bind(this)} />
                            <input type="button" className="btn btn-default" value="Clear" onClick={this.clear.bind(this)} /> */}
                        </div>
                    </form>
                </div>
                <div className="clearfix"></div>
                {
                    !this.state.IsDataAvailable ? < div className="loader visible" ></div >
                        :
                        <div>
                            {/* <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th rowSpan="2">
                                            District
                                        </th>
                                        <th colSpan="4">
                                            Total
                                        </th>
                                        <th colSpan="2">
                                            Type
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>
                                            Submitted
                                        </th>
                                        <th>
                                            Approved
                                        </th>
                                        <th>
                                            Pending
                                        </th>
                                        <th>
                                            Terminated
                                        </th>
                                        <th>
                                            General
                                        </th>
                                        <th>
                                            Sector
                                        </th>
                                        <th>
                                            Total GPs
                                        </th>
                                        <th>
                                            No. of GPs Recieved
                                        </th>
                                        <th>
                                            No. of GPs Pending
                                        </th>
                                    </tr>
                                </thead>
                                {

                                }
                            </table> */}

                            <BootstrapTable
                                data={this.state.ReportData}
                                exportCSV csvFileName="DistrictLevelPartnershipReport.csv">
                                <TableHeaderColumn isKey={true} dataField='District' columnTitle={true} dataSort={true}>District</TableHeaderColumn>
                                <TableHeaderColumn dataField='Submitted' columnTitle={true} dataSort={true}>Submitted</TableHeaderColumn>
                                <TableHeaderColumn dataField='Approved' columnTitle={true} dataSort={true}>Approved</TableHeaderColumn>
                                <TableHeaderColumn dataField='Pending' columnTitle={true} dataSort={true}>Pending</TableHeaderColumn>
                                <TableHeaderColumn dataField='Rejected' columnTitle={true} dataSort={true}>Rejected</TableHeaderColumn>
                                <TableHeaderColumn dataField='Terminated' columnTitle={true} dataSort={true}>Terminated</TableHeaderColumn>
                                <TableHeaderColumn dataField='General' columnTitle={true} dataSort={true}>General</TableHeaderColumn>
                                <TableHeaderColumn dataField='Sector' columnTitle={true} dataSort={true}>Sector</TableHeaderColumn>
                                <TableHeaderColumn dataField='TotalPanchayatsWards' columnTitle={true} dataSort={true}>Total GPs/Wards</TableHeaderColumn>
                                <TableHeaderColumn dataField='PanchayatsWardsApplicationsSubmitted' columnTitle={true} dataSort={true}>GPs/Wards Received</TableHeaderColumn>
                                <TableHeaderColumn dataField='PanchayatsApplicationsWardsNotSubmitted' columnTitle={true} dataSort={true}>GPs/Wards Not Received</TableHeaderColumn>

                            </BootstrapTable>


                        </div>
                }
            </div>
        );
    }
}

export default PartnershipReport;