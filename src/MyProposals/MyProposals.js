import React, { Component } from 'react';
// import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../Config'
import { MyAjax } from '../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

class MyProposals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "", MyProposals: [], currentPage: 1, sizePerPage: 10, dataTotalSize: 0, IsDataAvailable: false
        };
    }

    componentWillMount() {
        this.getProposals(this.state.currentPage, this.state.sizePerPage);
    }

    getProposals(page, count) {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Partner/GetProposals?page=" + page + "&count=" + count;
        MyAjax(
            url,
            (data) => this.setState({ MyProposals: data["proposals"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }),
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
                <h2>My Proposals & Projects<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/project-proposal") }}>Add Proposal</button></span></h2>

                {
                    this.state.IsDataAvailable ?
                        <BootstrapTable data={this.state.MyProposals} striped hover remote={remote} pagination={true}
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
                            <TableHeaderColumn dataField='CreatedDate' dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='130'>Date</TableHeaderColumn>
                            <TableHeaderColumn dataField='ProjectCode' dataSort={true}>Code</TableHeaderColumn>
                            <TableHeaderColumn dataField='Name' dataSort={true}>Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='District' dataSort={true}>District</TableHeaderColumn>
                            <TableHeaderColumn dataField='MandalMunicipality' dataSort={true}>MandalMunicipality</TableHeaderColumn>
                            <TableHeaderColumn dataField='PanchayatWard' dataSort={true}>PanchayatWard</TableHeaderColumn>
                            <TableHeaderColumn dataField='PartnerContribution' dataSort={true}>Contribution</TableHeaderColumn>
                            <TableHeaderColumn dataField='Status' dataSort={true} >Status</TableHeaderColumn>
                            <TableHeaderColumn columnClassName="text-center" dataField='Id' isKey={true} dataFormat={this.editViewFormatter.bind(this)} width='35' export={false}></TableHeaderColumn>
                   </BootstrapTable>
                        :
                        <div />
                }
            </div>
        );
    }

    onPageChange(page, sizePerPage) {
        this.getProposals(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getProposals(this.state.currentPage, sizePerPage);
    }

    editViewFormatter(cell, row) {
        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/project/" + row["Id"])}></i>;
    }

}

export default MyProposals;

