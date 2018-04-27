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


class CaseStudies extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1, sizePerPage: 10, dataTotalSize: 0, formChanged: 0,
            fromDate: null, toDate: null, IsDataAvailable: false, title: "",
            author: "", tag: "", CaseStudies: [], Tags: []
        };
    }

    componentDidMount() {
        this.getCaseStudies(1, 10);
        MyAjax(
            ApiUrl + "/api/CaseStudy/GetAllTags",
            (data) => { this.setState({ Tags: data["tags"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        );
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }
    
    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }


    getCaseStudies(page, count) {
        this.setState({ IsDataAvailable: false });
        var title = this.state.title ? this.state.title.trim() : this.state.title;
        var author = this.state.author ? this.state.author.trim() : this.state.author;
        var url = ApiUrl + "/api/CaseStudy/GetAllCaseStudies?title=" + encodeURIComponent(title) +
            "&author=" + encodeURIComponent(author) +
            "&fromDate=" + encodeURIComponent(this.state.fromDate) +
            "&toDate=" + encodeURIComponent(this.state.toDate) +
            "&tags=" + encodeURIComponent(this.state.tag) +
            "&page=" + page +
            "&count=" + count;

        MyAjax(
            url,
            (data) => this.setState({ CaseStudies: data["caseStudies"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }),
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
                    <h2>Case Studies<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/case-study") }}>Add Case Study</button></span></h2>
                </div>
                <div className="col-xs-12 bg-grey search-container">
                    <form name="search-form" id="searchForm" onChange={() => this.setState({ formChanged: 1 })}>
                        <div className="col-sm-2 form-group">
                            <label>Title</label>
                            <input className="form-control" type="text" name="title" ref="title" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Author</label>
                            <input className="form-control" type="text" name="author" ref="author" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Tags</label>
                            <select className="form-control" name="tag" ref="tag" autoComplete="off">
                                <option value="">All</option>
                                {
                                    this.state.Tags.map((item => {
                                        return <option value={item.value}>{item.label}</option>
                                    }))
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
                            <BootstrapTable data={this.state.CaseStudies} striped hover remote={remote} pagination={true}
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
                                <TableHeaderColumn dataField='Title' columnTitle={true} dataSort={true} >Title</TableHeaderColumn>
                                <TableHeaderColumn dataField='Author' columnTitle={true} dataSort={true} >Author</TableHeaderColumn>
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
            title: this.refs.title.value,
            author: this.refs.author.value,
            tag: this.refs.tag.value,
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getCaseStudies(1, this.state.sizePerPage);
        });
    }

    clear() {
        $("#searchForm").find("input[type=text]:enabled").val("");
        $("#searchForm").find("input[type=date]").val("");
        this.setState({
            formChanged: 1,
            title: this.refs.title.value,
            author: this.refs.author.value,
            tag: this.refs.tag.value,
            fromDate: this.refs.fromDate.value,
            toDate: this.refs.toDate.value
        }, () => {
            this.getCaseStudies(1, this.state.sizePerPage);
        });
    }

    editViewFormatter(cell, row) {
        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/case-study/" + row["Id"])}></i>;
    }

    onPageChange(page, sizePerPage) {
        this.getCaseStudies(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getCaseStudies(this.state.currentPage, sizePerPage);
    }
}

export default CaseStudies;