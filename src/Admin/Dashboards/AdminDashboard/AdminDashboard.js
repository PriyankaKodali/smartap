import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { MyAjax, DownloadFile } from '../../../MyAjax';
import { ApiUrl } from '../../../Config'
import './AdminDashboard.scss';
var fileDownload = require('js-file-download');

class AdminDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = { AdoptionsCount: {}, DistrictWiseAdoptionsDetailCount: [], IsDataAvailable: false, DistirctId: 1 };
    }

    componentWillMount() {
        MyAjax(
            ApiUrl + "/api/Admin/GetDashboardData",
            (data) => {
                this.setState({
                    AdoptionsCount: data["AdoptionsCount"], IsDataAvailable: true,
                    DistrictWiseAdoptionsDetailCount: data["DistrictWiseAdoptionsDetailCount"]
                })
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null);

    }

    render() {
        return (
            this.state.IsDataAvailable ?
                <div className="col-xs-12">

                    <div className="col-sm-3 p4">
                        <div className="panel panel-default panel-count">
                            <div className="panel-heading bg-t1 table-heading">Applications</div>
                            <div className="panel-body">

                                {/*----total,week,month adoption count (approved) starts here---*/}
                                <div className="top-count-bar">
                                    <div className="info-box">
                                        <span className="info-box-icon bg-g1">
                                            <img src="Images/group_user.png" alt="group_user" />
                                        </span>
                                        <div className="info-box-content text-center cl-g1">
                                            <div className="heading">Total Partnerships</div>
                                            <div>
                                                <div className="col-xs-6">
                                                    <div className="sub-heading">General</div>
                                                    <div className="count pointer" onClick={() => this.goToApplications("", "", "", "", "", "", "", "Approved", "General", "", "")}>{this.state.AdoptionsCount["ApprovedGeneral"]}</div>
                                                </div>
                                                <div className="col-xs-6">
                                                    <div className="sub-heading">Sector</div>
                                                    <div className="count pointer" onClick={() => this.goToApplications("", "", "", "", "", "", "", "Approved", "Sector", "", "")}>{this.state.AdoptionsCount["ApprovedSector"]}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="info-box">
                                        <span className="info-box-icon bg-a1">
                                            <img src="Images/week.png" alt="week" />
                                        </span>
                                        <div className="info-box-content text-center cl-a1">
                                            <div className="heading">Current Week</div>
                                            <div>
                                                <div className="col-xs-6">
                                                    <div className="sub-heading">General</div>
                                                    <div className="count pointer" onClick={() => {
                                                        var first = new Date().getDate() - new Date().getDay();
                                                        var firstday = new Date(new Date().setDate(first));
                                                        this.goToApplications("", "", "", "", "", "", "", "Approved", "General", firstday, new Date())
                                                    }}>{this.state.AdoptionsCount["WeekGeneral"]}</div>
                                                </div>
                                                <div className="col-xs-6">
                                                    <div className="sub-heading">Sector</div>
                                                    <div className="count pointer" onClick={() => {
                                                        var first = new Date().getDate() - new Date().getDay();
                                                        var firstday = new Date(new Date().setDate(first));
                                                        this.goToApplications("", "", "", "", "", "", "", "Approved", "General", firstday, new Date())
                                                    }}>{this.state.AdoptionsCount["WeekSector"]}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="info-box">
                                        <span className="info-box-icon bg-o1">
                                            <img src="Images/date.png" alt="date" />
                                        </span>
                                        <div className="info-box-content text-center cl-o1">
                                            <div className="heading">Current Month</div>
                                            <div>
                                                <div className="col-xs-6">
                                                    <div className="sub-heading">General</div>
                                                    <div className="count pointer" onClick={() => this.goToApplications("", "", "", "", "", "", "", "Approved", "General", new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date())}>{this.state.AdoptionsCount["MonthGeneral"]}</div>
                                                </div>
                                                <div className="col-xs-6">
                                                    <div className="sub-heading">Sector</div>
                                                    <div className="count pointer" onClick={() => this.goToApplications("", "", "", "", "", "", "", "Approved", "Sector", new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date())}>{this.state.AdoptionsCount["MonthSector"]}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/*----total,week,month adoption count (approved) ends here---*/}

                                {/*----status wise adoption count starts here---*/}

                                <div>
                                    <table className="table table-condensed table-bordered bg-white">
                                        <thead className="bg-bg1 cl-white">
                                            <tr>
                                                <th className="text-center">
                                                    Status
                                                </th>
                                                <th className="text-center" title="General">
                                                    G
                                                </th>
                                                <th className="text-center" title="Sector">
                                                    S
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    Open
                                                </td>
                                                <td className="pointer text-right" onClick={() => this.goToApplications("", "", "", "", "", "", "", "Application Submitted", "General", "", "")}>
                                                    {this.state.AdoptionsCount["OpenGeneral"]}
                                                </td>
                                                <td className="pointer text-right" onClick={() => this.goToApplications("", "", "", "", "", "", "", "Application Submitted", "Sector", "", "")}>
                                                    {this.state.AdoptionsCount["OpenSector"]}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    CPO
                                                </td>
                                                <td className="pointer text-right" onClick={() => this.goToApplications("", "", "", "", "", "", "", "CPO", "General", "", "")}>
                                                    {this.state.AdoptionsCount["CPOGeneral"]}
                                                </td>
                                                <td className="pointer text-right" onClick={() => this.goToApplications("", "", "", "", "", "", "", "CPO", "Sector", "", "")}>
                                                    {this.state.AdoptionsCount["CPOSector"]}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    MPDO
                                                </td>
                                                <td className="pointer text-right" onClick={() => this.goToApplications("", "", "", "", "", "", "", "MPDO", "General", "", "")}>
                                                    {this.state.AdoptionsCount["MPDOGeneral"]}
                                                </td>
                                                <td className="pointer text-right" onClick={() => this.goToApplications("", "", "", "", "", "", "", "MPDO", "Sector", "", "")}>
                                                    {this.state.AdoptionsCount["MPDOSector"]}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Rejected
                                                </td>
                                                <td className="pointer text-right" onClick={() => this.goToApplications("", "", "", "", "", "", "", "Reject", "General", "", "")}>
                                                    {this.state.AdoptionsCount["RejectedGeneral"]}
                                                </td>
                                                <td className="pointer text-right" onClick={() => this.goToApplications("", "", "", "", "", "", "", "Reject", "Sector", "", "")}>
                                                    {this.state.AdoptionsCount["RejectedSector"]}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Approved
                                                </td>
                                                <td className="pointer text-right" onClick={() => this.goToApplications("", "", "", "", "", "", "", "Approved", "General", "", "")}>
                                                    {this.state.AdoptionsCount["ApprovedGeneral"]}
                                                </td>
                                                <td className="pointer text-right" onClick={() => this.goToApplications("", "", "", "", "", "", "", "Approved", "Sector", "", "")}>
                                                    {this.state.AdoptionsCount["ApprovedSector"]}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Total
                                                </td>
                                                <td className="pointer text-right bold" onClick={() => this.goToApplications("", "", "", "", "", "", "", "", "General", "", "")}>
                                                    {this.state.AdoptionsCount["TotalGeneral"]}
                                                </td>
                                                <td className="pointer text-right bold q" onClick={() => this.goToApplications("", "", "", "", "", "", "", "", "General", "", "")}>
                                                    {this.state.AdoptionsCount["TotalSector"]}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*----status wise adoption count ends here---*/}

                    {/*----district adoption count starts here---*/}

                    <div className="col-sm-9 p4">
                        {/* <div className="table-heading bg-b1">Distirct Wise Applications <button className="btn btn-sm-export btn-warning pull-right" title="Export to Excel" onClick={this.exportPartnerApplicationsReportToExcel.bind(this)}><span className="fa fa fa-file-excel-o"></span></button></div> */}
                        <div className="table-heading bg-b1">Distirct Wise Applications</div>
                      <table className="table table-condensed table-bordered bg-white">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="text-center" style={{ verticalAlign: "middle" }}>District</th>
                                    <th colSpan={4} className="text-center">Open</th>
                                    <th rowSpan={2} className="text-center" style={{ verticalAlign: "middle" }}>Rejected</th>
                                    <th colSpan={3} className="text-center">Approved</th>
                                </tr>
                                <tr>
                                    <th className="text-center">@SAPF</th>
                                    <th className="text-center">@CPO</th>
                                    <th className="text-center">@MPDO</th>
                                    <th className="text-center">Total</th>
                                    <th className="text-center">General</th>
                                    <th className="text-center">Sector</th>
                                    <th className="text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.DistrictWiseAdoptionsDetailCount.map((ele, i) => {
                                        return (<tr key={i}>
                                            <td title={ele["Name"]}>
                                                {ele["Name"]}
                                            </td>
                                            <td className="pointer text-right" onClick={() => this.goToApplications("", "", ele["Name"], "", "", "", "", "Application Submitted", "", "", "")}>
                                                {ele["SAPF"]}
                                            </td>
                                            <td className="pointer text-right" onClick={() => this.goToApplications("", "", ele["Name"], "", "", "", "", "CPO", "", "", "")}>
                                                {ele["CPO"]}
                                            </td>
                                            <td className="pointer text-right" onClick={() => this.goToApplications("", "", ele["Name"], "", "", "", "", "MPDO", "", "", "")}>
                                                {ele["MPDO"]}
                                            </td>
                                            <td className="text-right">
                                                {ele["CPO"] + ele["MPDO"] + ele["SAPF"]}
                                            </td>
                                            <td className="pointer text-right" onClick={() => this.goToApplications("", "", ele["Name"], "", "", "", "", "Rejected", "", "", "")}>
                                                {ele["Rejected"]}
                                            </td>
                                            <td className="pointer text-right" onClick={() => this.goToApplications("", "", ele["Name"], "", "", "", "", "Approved", "General", "", "")}>
                                                {ele["General"]}
                                            </td>
                                            <td className="pointer text-right" onClick={() => this.goToApplications("", "", ele["Name"], "", "", "", "", "Approved", "Sector", "", "")}>
                                                {ele["Sector"]}
                                            </td>
                                            <td className="pointer text-right" onClick={() => this.goToApplications("", "", ele["Name"], "", "", "", "", "Approved", "", "", "")}>
                                                {ele["Sector"] + ele["General"]}
                                            </td>
                                        </tr>)
                                    })}
                            </tbody>
                        </table>
                    </div>

                    {/*----district adoption count ends here---*/}
                </div>
                :
                <div className="loader visible"></div>


        );
    }

    exportPartnerApplicationsReportToExcel() {

        // DownloadFile(ApiUrl + "/api/Export/ExportAdminPartnerApplicationsReport");
        // MyAjax(
        //     ApiUrl + "/api/Export/ExportAdminPartnerApplicationsReport",
        //     (data) => {DownloadFile
        //         // fileDownload(data,data["Content"]["Headers"][3]);
        //     },
        //     (error) => toast(error.responseText, {
        //         type: toast.TYPE.ERROR
        //     }),
        //     "GET",
        //     null);
    }

    goToApplications(Area, DistrictId, District, MandalMunicipalityId, MandalMunicipality, PanchayatWardId, PanchayatWard, Status, Type, fromDate, toDate) {
        if (District === "Total") District = "";
        if (MandalMunicipality === "Total") MandalMunicipality = "";
        if (PanchayatWard === "Total") PanchayatWard = "";

        this.props.history.push({
            state: {
                area: Area,
                districtId: DistrictId,
                district: District,
                mandalMunicipalityId: MandalMunicipalityId,
                mandalMunicipality: MandalMunicipality,
                panchayatWardId: PanchayatWardId,
                panchayatWard: PanchayatWard,
                status: Status,
                type: Type,
                fromDate: fromDate,
                toDate: toDate
            },
            pathname: "/admin/adoption-applications"
        })
    }
}

export default AdminDashboard;


