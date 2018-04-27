import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { ApiUrl,remote } from '../Config';
import { MyAjax } from '../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');


// import { Link } from 'react-router-dom';

class MyAdoptions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Applications: [], Application_Id: [], currentPage: 1, sizePerPage: 10, dataTotalSize: 0, IsCPO: false,
            IsDataAvailable: false
        };
    }

    componentWillMount() {
        this.getAdoptions(1, 10)
    }

    getAdoptions(page, count) {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Partner/GetAdoptions?page=" + page + "&count=" + count;
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
                    <h3>My Partnership Applications</h3>
                </div>
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
                                }}
                            >
                                <TableHeaderColumn dataField='Date' columnTitle={true} dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='100'>Date</TableHeaderColumn>
                                <TableHeaderColumn dataField='Type' columnTitle={true} dataSort={true}  >Type</TableHeaderColumn>
                                <TableHeaderColumn dataField='District' columnTitle={true} dataSort={true}>District</TableHeaderColumn>
                                <TableHeaderColumn dataField='MandalMunicipality' columnTitle={true} dataSort={true}>Mandal/Municipality</TableHeaderColumn>
                                <TableHeaderColumn dataField='PanchayatWard' columnTitle={true} dataSort={true}>Panchayat/Ward</TableHeaderColumn>
                                <TableHeaderColumn dataField='Status' width="120" columnTitle={true} dataSort={true} >Status</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="text-center" isKey={true} dataField='Id' dataFormat={this.editViewFormatter.bind(this)} width='35'></TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                }
            </div>
        );
    }


    editViewFormatter(cell, row) {
        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/adoption/" + row["Id"])}></i>;
    }


    onPageChange(page, sizePerPage) {
        this.getApplications(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getApplications(this.state.currentPage, sizePerPage);
    }
}

export default MyAdoptions;