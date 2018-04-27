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


// import { Link } from 'react-router-dom';

class RegisteredUsers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            RegisteredUsers: [], currentPage: 1, sizePerPage: 10, dataTotalSize: 0,
            IsDataAvailable: false, PartnerCategories: [], PartnerSubCategories: [], fromDate: null,
            toDate: null, partnerName: "", partnerEmail: "",
            partnerPhone: "", partnerCategoryId: null, partnerSubCategoryId: null, formChanged: 0
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
        this.getRegisteredUsers(this.state.currentPage, this.state.sizePerPage);
    }
    componentDidMount() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    getRegisteredUsers(page, count) {
        this.setState({ IsDataAvailable: false });
        var partnerName = this.state.partnerName ? this.state.partnerName.trim() : this.state.partnerName;
        var partnerEmail = this.state.partnerEmail ? this.state.partnerEmail.trim() : this.state.partnerEmail;
        var partnerPhone = this.state.partnerPhone ? this.state.partnerPhone.trim() : this.state.partnerPhone;
        var url = ApiUrl + "/api/Admin/GetRegisteredUsers?fromDate=" + encodeURIComponent(this.state.fromDate) +
            "&toDate=" + encodeURIComponent(this.state.toDate) +
            "&partnerName=" + encodeURIComponent(partnerName) +
            "&partnerEmail=" + encodeURIComponent(partnerEmail) +
            "&partnerPhone=" + encodeURIComponent(partnerPhone) +
            "&partnerCategoryId=" + encodeURIComponent(this.state.partnerCategoryId) +
            "&partnerSubCategoryId=" + encodeURIComponent(this.state.partnerSubCategoryId) +
            "&page=" + page +
            "&count=" + count;

        MyAjax(
            url,
            (data) => this.setState({ RegisteredUsers: data["users"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }),
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
                            <BootstrapTable data={this.state.RegisteredUsers} striped hover remote={remote} pagination={true}
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
                                <TableHeaderColumn dataField='RegisteredDate' columnTitle={true} dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='100'>Date</TableHeaderColumn>
                                <TableHeaderColumn dataField='FullName' columnTitle={true} dataSort={true} >Partner Name</TableHeaderColumn>
                                <TableHeaderColumn dataField='SubCategoryType' columnTitle={true} dataSort={true} >Category</TableHeaderColumn>
                                <TableHeaderColumn dataField='Email' columnTitle={true} dataSort={true}>Email</TableHeaderColumn>
                                <TableHeaderColumn dataField='PhoneNumber' columnTitle={true} width="140" dataSort={true}>Phone</TableHeaderColumn>
                                <TableHeaderColumn dataField='EmailConfirmed' columnTitle={true} width="120" dataSort={true} dataFormat={this.verifiedViewFormatter.bind(this)}>Verified</TableHeaderColumn>
                                <TableHeaderColumn dataField='DOB' columnTitle={true} width="120" dataSort={true} dataFormat={this.statusViewFormatter.bind(this)}>Profile Status</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="text-center" isKey={true} dataField='Id' dataFormat={this.editViewFormatter.bind(this)} width='35'></TableHeaderColumn>
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
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getRegisteredUsers(1, this.state.sizePerPage);
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
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getRegisteredUsers(1, this.state.sizePerPage);
        });
    }

    editViewFormatter(cell, row) {
        return <i className='fa fa-eye pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/partner-details/" + cell)}></i>;
    }

    verifiedViewFormatter(cell, row) {
        if (row["EmailConfirmed"] && row["PhoneNumberConfirmed"]) {
            return "Verified";
        }
        if (!row["EmailConfirmed"] && !row["PhoneNumberConfirmed"]) {
            return "Not Verified";
        }
        if (row["EmailConfirmed"] && !row["PhoneNumberConfirmed"]) {
            return "Email Verified";
        }
    }

    statusViewFormatter(cell, row) {
        if (cell) {
            return "Completed";
        }
        else {
            return "Incomplete";
        }
    }

    onPageChange(page, sizePerPage) {
        this.getRegisteredUsers(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getRegisteredUsers(this.state.currentPage, sizePerPage);
    }
}

export default RegisteredUsers;

