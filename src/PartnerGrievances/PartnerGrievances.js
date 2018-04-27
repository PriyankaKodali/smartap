import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../Config';
import { MyAjax } from '../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');


class PartnerGrievances extends Component {

    constructor(props) {
        super(props);
        var isPartner = sessionStorage.getItem("smart_ap_roles").indexOf("Partner") !== -1;
        var isAdmin = sessionStorage.getItem("smart_ap_roles").indexOf("Admin") !== -1;

        this.state = {
            Grievances: [], currentPage: 1, sizePerPage: 10, dataTotalSize: 0, fromDate: null, toDate: null,
            status: "false", partnerName: "", partnerEmail: "", partnerPhone: "", IsDataAvailable: false,
            formChanged: 0, IsPartner: isPartner, IsAdmin: isAdmin
        };
    }

    componentDidMount() {
        this.getGrievances(1, 10);
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    getGrievances(page, count) {
        this.setState({ IsDataAvailable: false });
        var partnerName = this.state.partnerName ? this.state.partnerName.trim() : this.state.partnerName;
        var partnerEmail = this.state.partnerEmail ? this.state.partnerEmail.trim() : this.state.partnerEmail;
        var partnerPhone = this.state.partnerPhone ? this.state.partnerPhone.trim() : this.state.partnerPhone;
        var url = ApiUrl + "/api/PartnerGrievance/GetPartnerGrievances?fromDate=" + encodeURIComponent(this.state.fromDate) +
            "&toDate=" + encodeURIComponent(this.state.toDate) +
            "&status=" + encodeURIComponent(this.state.status) +
            "&partnerName=" + encodeURIComponent(partnerName) +
            "&partnerEmail=" + encodeURIComponent(partnerEmail) +
            "&partnerPhone=" + encodeURIComponent(partnerPhone) +
            "&page=" + page +
            "&count=" + count;

        MyAjax(
            url,
            (data) => this.setState({ Grievances: data["grievances"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }),
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
                    {
                        this.state.IsPartner || this.state.IsAdmin ?
                            <h3>Partner Grievances <span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/partner-grievance"); }}>Add</button> </span> </h3>
                            :
                            <h3>Partner Grievances </h3>
                    }

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
                            <label>Status</label>
                            <select className="form-control" name="status" ref="status" autoComplete="off">
                                <option value="false">Open</option>
                                <option value="true">Close</option>
                                <option value="">All</option>
                            </select>
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>From Date</label>
                            <input className="date form-control" type="text" name="fromDate" ref="fromDate" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>To Date</label>
                            <input className="date form-control" type="text" name="toDate" ref="toDate" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 button-block mtop10 mbot5">
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
                            <BootstrapTable data={this.state.Grievances} striped hover remote={remote} pagination={true}
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
                                }}
                            >
                                <TableHeaderColumn dataField='CreatedDate' columnTitle={true} dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='100'>Date</TableHeaderColumn>
                                <TableHeaderColumn dataField='PartnerName' columnTitle={true} dataSort={true}>Partner Name</TableHeaderColumn>
                                <TableHeaderColumn dataField='Email' columnTitle={true} dataSort={true}>Email</TableHeaderColumn>
                                <TableHeaderColumn dataField='PhoneNumber' columnTitle={true} dataSort={true}>Phone</TableHeaderColumn>
                                <TableHeaderColumn dataField='Subject' columnTitle={true} dataSort={true}>Subject</TableHeaderColumn>
                                <TableHeaderColumn dataField='Status' width="120" columnTitle={true} dataFormat={this.statusView.bind(this)} dataSort={true} >Status</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="text-center" isKey={true} dataField='Id' dataFormat={this.editViewFormatter.bind(this)} width='35'></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                }
            </div>
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
            status: this.refs.status.value,
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getGrievances(1, this.state.sizePerPage);
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
            status: this.refs.status.value,
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getGrievances(1, this.state.sizePerPage);
        });
    }

    editViewFormatter(cell, row) {
        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/partner-grievance/" + row["Id"])}></i>;
    }

    onPageChange(page, sizePerPage) {
        this.getGrievances(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getGrievances(this.state.currentPage, sizePerPage);
    }


    statusView(cell, row) {
        return cell ? "Closed" : "Open";
    }
}

export default PartnerGrievances;