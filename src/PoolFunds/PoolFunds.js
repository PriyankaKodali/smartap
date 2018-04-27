import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../Config'
import { MyAjax } from '../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');


class PoolFunds extends Component {

    constructor(props) {
        super(props);
        this.state = {
            FundsList: [], IsDataAvailable: false
        };
    }

    componentWillMount() {
            this.getFundDetails();
    }

    getFundDetails() {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Funds/GetPoolFunds"

        MyAjax(
            url,
            (data) => { this.setState({ FundsList: data["FundsList"], IsDataAvailable: true }) },
            (error) => toast( "An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            }), "GET", null
        );
    }



    render() {
        return (
            <div className="col-xs-12">
                <h2>Financial Transactions</h2>
                {
                    this.state.IsDataAvailable ?
                        <BootstrapTable data={this.state.FundsList} striped hover>
                            <TableHeaderColumn dataField='Date' dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='130'>Date</TableHeaderColumn>
                            <TableHeaderColumn dataField='FullName' dataSort={true}>Donor/Supplier</TableHeaderColumn>
                            <TableHeaderColumn dataField='Description' dataSort={true}>Description</TableHeaderColumn>
                            <TableHeaderColumn dataField='Towards' dataSort={true}>Credited To/Debited From</TableHeaderColumn>
                            <TableHeaderColumn dataField='Amount' dataSort={true} width='120' dataFormat={this.currencyViewFormatter.bind(this)}>Amount</TableHeaderColumn>
                            <TableHeaderColumn dataField='Balance' dataSort={true} width='120' dataFormat={this.currencyViewFormatter.bind(this)}>Balance</TableHeaderColumn>
                            <TableHeaderColumn dataField='Id' isKey={true} dataSort={true} hidden>Id</TableHeaderColumn>
                        </BootstrapTable>
                        :
                        <div className="loader visble"></div>
                }
            </div>
        );
    }

    
    currencyViewFormatter(cell, row) {
        return cell.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
        });
    }

}

export default PoolFunds;


