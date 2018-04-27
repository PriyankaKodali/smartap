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


class NewsLetterEmails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1, sizePerPage: 10, dataTotalSize: 0, formChanged: 0,
            IsDataAvailable: false, email: "", NewsLetterEmails: []
        };
    }

    componentDidMount() {
        this.getEmails(1, 10);
    }

    getEmails(page, count) {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Contact/GetNewsLetterEmails?email=" + encodeURIComponent(this.state.email) +
            "&page=" + page +
            "&count=" + count;

        MyAjax(
            url,
            (data) => this.setState({ NewsLetterEmails: data["newsLetterEmails"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }),
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
                    <h2>Newsletter Emails</h2>
                </div>
                <div className="col-xs-12 bg-grey search-container">
                    <form name="search-form" id="searchForm" onChange={() => this.setState({ formChanged: 1 })}>
                        <div className="col-sm-4 form-group">
                            <label>Email</label>
                            <input className="form-control" type="text" name="email" ref="email" autoComplete="off" />
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
                            <BootstrapTable data={this.state.NewsLetterEmails} striped hover remote={remote} pagination={true}
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
                                <TableHeaderColumn dataField='Email' columnTitle={true} dataSort={true} >Email</TableHeaderColumn>
                                <TableHeaderColumn columnClassName="text-center" isKey={true} dataField='Id' width='40' dataFormat={this.editViewFormatter.bind(this)} width='35'></TableHeaderColumn>
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
            email: this.refs.email.value
        }, () => {
            this.getEmails(1, this.state.sizePerPage);
        });
    }

    clear() {
        this.refs.email.value = "";
        this.setState({
            formChanged: 1,
            email: this.refs.email.value
        }, () => {
            this.getEmails(1, this.state.sizePerPage);
        });
    }

    editViewFormatter(cell, row) {
        if (row["Active"]) {
            return <i className='fa fa-ban pointer' style={{ fontSize: '18px' }} onClick={() => this.disableEmail.bind(this)}></i>;
        }
        else {
            return <i className='fa fa-check pointer' style={{ fontSize: '18px' }} onClick={() => this.enableEmail.bind(this)}></i>;
        }
    }

    disableEmail() {

    }

    enableEmail() {

    }

    onPageChange(page, sizePerPage) {
        this.getEmails(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getEmails(this.state.currentPage, sizePerPage);
    }
}

export default NewsLetterEmails;