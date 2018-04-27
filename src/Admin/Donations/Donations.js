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

class Donations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "", Donations: [], currentPage: 1, sizePerPage: 10, dataTotalSize: 0, districtId: null,
            district: "", mandalMunicipalityId: null, mandalMunicipality: "", panchayatWardId: "", panchayatWard: "",
            fromDate: null, toDate: null, status: "", type: "", area: "", partnerName: "", partnerEmail: "",
            partnerPhone: "", IsDataAvailable: false, formChanged: 0
        };
    }

    componentWillMount() {
        this.getDonations(1, 10);       
    }

    componentDidMount() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    getDonations(page, count) {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Admin/GetDonations?donationId=0&districtId=" + encodeURIComponent(this.state.districtId) +
            "&district=" + encodeURIComponent(this.state.district) +
            "&mandalMunicipalityId=" + encodeURIComponent(this.state.mandalMunicipalityId) +
            "&mandalMunicipality=" + encodeURIComponent(this.state.mandalMunicipality) +
            "&panchayatWardId=" + encodeURIComponent(this.state.panchayatWardId) +
            "&panchayatWard=" + encodeURIComponent(this.state.panchayatWard) +
            "&fromDate=" + encodeURIComponent(this.state.fromDate) +
            "&toDate=" + encodeURIComponent(this.state.toDate) +
            "&area=" + encodeURIComponent(this.state.area) +
            "&status=" + encodeURIComponent(this.state.status) +
            "&type=" + encodeURIComponent(this.state.type) +
            "&partnerName=" + encodeURIComponent(this.state.partnerName) +
            "&partnerEmail=" + encodeURIComponent(this.state.partnerEmail) +
            "&partnerPhone=" + encodeURIComponent(this.state.partnerPhone) +
            "&page=" + page +
            "&count=" + count

        MyAjax(
            url,
            (data) => { this.setState({ Donations: data["donations"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }), "GET", null
        );
    }


    render() {
        return (
            <div className="col-xs-12"> <div>
                <h3>Donations</h3>
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
                            <label>Type</label>
                            <select className="form-control" name="type" ref="type" autoComplete="off">
                                <option value="">All</option>
                                <option>Online</option>
                                <option>Cheque</option>
                            </select>
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Status</label>
                            <select className="form-control" name="status" ref="status" autoComplete="off">
                                <option value="">All</option>
                                <option value="TXN_SUCCESS">Success</option>
                                <option value="TXN_PENDING">Pending</option>
                                <option value="TXN_FAILURE">Fail</option>
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
                        <div className="col-sm-2 form-group">
                            <label>District</label>
                            <input className="form-control" type="text" name="district" ref="district" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Mandal/Municipality</label>
                            <input className="form-control" type="text" name="mandalMunicipality" ref="mandalMunicipality" autoComplete="off" />
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
                        <BootstrapTable data={this.state.Donations} striped hover remote={remote} pagination={true}
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
                            }}   >
                            <TableHeaderColumn dataField='CreatedTime' dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='130'>Date</TableHeaderColumn>
                            <TableHeaderColumn dataField='PartnerName' dataSort={true} >Partner</TableHeaderColumn>
                            <TableHeaderColumn dataField='Amount' dataSort={true} width='150' dataFormat={this.currencyViewFormatter.bind(this)}>Amount</TableHeaderColumn>
                            <TableHeaderColumn dataField='DonationType' dataSort={true}>Type</TableHeaderColumn>
                            <TableHeaderColumn dataField='ProjectName' dataSort={true}>Project</TableHeaderColumn>
                            <TableHeaderColumn dataField='District' dataSort={true}>District</TableHeaderColumn>
                            <TableHeaderColumn dataField='MandalMunicipality' dataSort={true}>Mandal/Municipality</TableHeaderColumn>
                            <TableHeaderColumn dataField='PanchayatWard' dataSort={true}>Panchayat/Ward</TableHeaderColumn>
                            <TableHeaderColumn dataField='Status' dataSort={true} dataFormat={(val) => val.toUpperCase()}>Status</TableHeaderColumn>
                            <TableHeaderColumn columnClassName="text-center" dataField='Status' dataFormat={this.editViewFormatter.bind(this)} width='35'></TableHeaderColumn>
                            <TableHeaderColumn dataField='Id' isKey={true} dataSort={true} dataFormat={this.viewTransactionFormatter.bind(this)} width='40'></TableHeaderColumn>
                        </BootstrapTable>
                }
            </div >
        );
    }

    onPageChange(page, sizePerPage) {
        this.getDonations(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getDonations(this.state.currentPage, sizePerPage);
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
            district: this.refs.district.value,
            mandalMunicipality: this.refs.mandalMunicipality.value,
            panchayatWard: this.refs.panchayatWard.value,
            area: this.refs.area.value,
            type: this.refs.type.value,
            status: this.refs.status.value,
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getDonations(1, this.state.sizePerPage);
        });
    }

    clear() {
        $("#searchForm").find("input[type=text]").val("");
        $("#searchForm").find("input[type=date]").val("");
        $("#searchForm").find("select").val("");
        this.setState({
            formChanged: 1,
            partnerName: this.refs.partnerName.value,
            partnerEmail: this.refs.partnerEmail.value,
            district: this.refs.district.value,
            mandalMunicipality: this.refs.mandalMunicipality.value,
            panchayatWard: this.refs.panchayatWard.value,
            area: this.refs.area.value,
            type: this.refs.type.value,
            status: this.refs.status.value,
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getDonations(1, this.state.sizePerPage);
        });
    }

    editViewFormatter(cell, row) {
        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/donation/" + row["Id"])}></i >;
    }

    currencyViewFormatter(cell, row) {
        return cell.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
    }

    viewTransactionFormatter(cell, row) {
        console.log(row);
        if (row["Project_Id"] !== null) {
            return <i className='fa fa-eye pointer' style={{ fontSize: '18px' }} title="View Financial Transactions" onClick={() => this.props.history.push("/project-funds/" + row["Project_Id"])}></i >;
        }
        else if (row["PanchayatWard_Id"] !== null) {
            return <i className='fa fa-eye pointer' style={{ fontSize: '18px' }} title="View Financial Transactions" onClick={() => this.props.history.push("/panchayat-funds/" + row["PanchayatWard_Id"])}></i >;
        }
        else {
            return <i className='fa fa-eye pointer' style={{ fontSize: '18px' }} title="View Financial Transactions" onClick={() => this.props.history.push("/pool-funds")}></i >;
        }
    }


}

export default Donations;


