import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../Config'
import { MyAjax } from '../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');


class MyDonations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1, sizePerPage: 10, dataTotalSize: 0, MyDonations: []
        };
    }

    componentWillMount() {
        this.getDonations(1, 10);
    }

    getDonations(page, count) {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Partner/GetMyDonations?page=" + page + "&count=" + count

        MyAjax(
            url,
            (data) => { this.setState({ Donations: data["myDonations"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }), "GET", null
        );
    }



    render() {
        return (
            <div className="col-xs-12">
                <h2>My Contributions</h2>
                {
                    this.state.IsDataAvailable ?
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
                            <TableHeaderColumn dataField='Amount' dataSort={true} width='100'>Amount</TableHeaderColumn>
                            <TableHeaderColumn dataField='DonationType' dataSort={true}>Type</TableHeaderColumn>
                            <TableHeaderColumn dataField='Description' dataSort={true}>Description</TableHeaderColumn>
                            <TableHeaderColumn dataField='District' dataSort={true}>District</TableHeaderColumn>
                            <TableHeaderColumn dataField='MandalMunicipality' dataSort={true}>Mandal/Municipality</TableHeaderColumn>
                            <TableHeaderColumn dataField='PanchayatWard' dataSort={true}>Panchayat/Ward</TableHeaderColumn>
                            <TableHeaderColumn dataField='ProjectName' dataSort={true}>Project</TableHeaderColumn>
                            <TableHeaderColumn dataField='Status' dataSort={true} dataFormat={(val) => val.toUpperCase()}>Status</TableHeaderColumn>
                            <TableHeaderColumn dataField='Id' isKey={true} dataSort={true} dataFormat={this.viewTransactionFormatter.bind(this)} width='40'></TableHeaderColumn>
                        </BootstrapTable>
                        :
                        <div className="loader visble"></div>
                }
            </div>
        );
    }

    onPageChange(page, sizePerPage) {
        this.getDonations(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getDonations(this.state.currentPage, sizePerPage);
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

export default MyDonations;


