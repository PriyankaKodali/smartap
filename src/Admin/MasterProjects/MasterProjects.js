import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../../Config';
import { MyAjax } from '../../MyAjax';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

class MasterProjects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "", ProjectSectors: [], MasterProjects: [], currentPage: 1, sizePerPage: 10,
            dataTotalSize: 0, IsDataAvailable: false, formChanged: 0, projectName: "", sectorId: null
        };
    }

    componentWillMount() {
        this.getMasterProjects(1, 10);
        MyAjax(
            ApiUrl + "/api/Projects/GetProjectSectors",
            (data) => { this.setState({ ProjectSectors: data["projectSectors"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        );
    }

    getMasterProjects(page, count) {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Projects/GetAllMasterProjects?projectName=" + encodeURIComponent(this.state.projectName) +
            "&sectorId=" + encodeURIComponent(this.state.sectorId) +
            "&page=" + page +
            "&count=" + count;

        MyAjax(
            url,
            (data) => { this.setState({ MasterProjects: data["masterProjects"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }), "GET", null
        );
    }

    render() {
        return (
            <div className="col-xs-12"> <div>
                <h2>Master Projects<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/master-project") }}>Add Master Project</button></span></h2>
            </div>
                <div className="col-xs-12 bg-grey search-container">
                    <form name="search-form" id="searchForm" onChange={() => this.setState({ formChanged: 1 })}>
                        <div className="col-sm-2 form-group">
                            <label>Project Name</label>
                            <input className="form-control" type="text" name="projectName" ref="projectName" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Sector</label>
                            <select className="form-control" name="sector" ref="sector" autoComplete="off">
                                <option value="">All</option>
                                {this.state.ProjectSectors.map((ele) => {
                                    return <option key={ele["value"]} value={ele["value"]}>{ele["label"]}</option>
                                })}
                            </select>
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
                        <BootstrapTable data={this.state.MasterProjects} striped hover remote={remote} pagination={true}
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
                            <TableHeaderColumn dataField='NaStartDateme' isKey={true} dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='130'>Date</TableHeaderColumn>
                            <TableHeaderColumn dataField='Name' dataSort={true} >Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='Sector' dataSort={true} >Sector</TableHeaderColumn>
                            <TableHeaderColumn columnClassName="text-center" dataField='Status' dataFormat={this.editViewFormatter.bind(this)} width='35'></TableHeaderColumn>
                        </BootstrapTable>
                }
            </div >
        );
    }

    onPageChange(page, sizePerPage) {
        this.getMasterProjects(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getMasterProjects(this.state.currentPage, sizePerPage);
    }

    search() {
        if (this.state.formChanged === 0) {
            return;
        }
        this.setState({
            formChanged: 0,
            projectName: this.refs.projectName.value,
            sectorId: this.refs.sector.value
        }, () => {
            this.getMasterProjects(1, this.state.sizePerPage);
        });
    }

    clear() {
        $("#searchForm").find("input[type=text]").val("");
        $("#searchForm").find("input[type=date]").val("");
        $("#searchForm").find("select").val("");
        this.setState({
            formChanged: 1,
            projectName: this.refs.projectName.value,
            sectorId: this.refs.sector.value
        }, () => {
            this.getMasterProjects(1, this.state.sizePerPage);
        });
    }

    editViewFormatter(cell, row) {
        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/master-project/" + row["Id"])}></i >;
    }


}

export default MasterProjects;


