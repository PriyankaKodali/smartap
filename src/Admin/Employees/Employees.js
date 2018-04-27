import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { ApiUrl } from '../../Config'
import { MyAjax } from '../../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

class Employees extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "", Employees: [], NewEmployee: false
        };
    }

    componentWillMount() {
        MyAjax(
            ApiUrl + "/api/Admin/GetEmployees?page=1&count=10",
            (data) => { this.setState({ Employees: data["employees"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }), "GET", null
        );
    }


    render() {
        return (
            <div className="col-xs-12">
                <h2>Employees <span className="pull-right"> <button className="btn btn-default" onClick={() => this.props.history.push("/admin/employee")}>Add</button></span></h2>
                <BootstrapTable data={this.state.Employees} striped hover>
                    <TableHeaderColumn dataField='Name' dataSort={true}>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='Email' dataSort={true}>Email</TableHeaderColumn>
                    <TableHeaderColumn dataField='PhoneNumber' dataSort={true}>Phone</TableHeaderColumn>
                    <TableHeaderColumn dataField='Designation' dataSort={true}>Designation</TableHeaderColumn>
                    <TableHeaderColumn dataField='Active' dataSort={true} dataFormat={this.statusFormatter.bind(this)}>Status</TableHeaderColumn>
                    <TableHeaderColumn dataField='Id' isKey={true} dataSort={true} width="40" dataFormat={this.editViewFormatter.bind(this)}></TableHeaderColumn>
                </BootstrapTable>
            </div >
        );
    }

    statusFormatter(cell, row) {
        return cell ? "Active" : "Inactive";
    }

    editViewFormatter(cell, row) {
        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/employee/" + row["Id"])}></i >;
    }


}

export default Employees;


