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


class OfficialContacts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "", OfficialContacts: [], currentPage: 1, sizePerPage: 10, dataTotalSize: 0, Designations: [],
            Name: "", Phone: "", Email: "", Active: "", Designation: "", District: "", DistrictId: null, MandalMunicipality: "",
            MandalMunicipalityId: null, PanchayatWard: "", PanchayatWardId: null, formChanged: 0, IsDataAvailable: false
        };
    }

    componentWillMount() {
        MyAjax(
            ApiUrl + "/api/MasterData/GetOfficialDesignations",
            (data) => { this.setState({ Designations: data["designations"] }); },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
        this.getOfficialContacts(1, 10);
    }

    getOfficialContacts(page, count) {
        this.setState({ IsDataAvailable: false });
        var Name = this.state.Name.trim();
        var Email = this.state.Email.trim();
        var Phone = this.state.Phone.trim();
        var District = this.state.District.trim();
        var MandalMunicipality = this.state.MandalMunicipality.trim();
        var PanchayatWard = this.state.PanchayatWard.trim();
        var url = ApiUrl + "/api/Admin/GetOfficialContacts?Name=" + encodeURIComponent(Name) +
            "&Phone=" + encodeURIComponent(Phone) +
            "&Email=" + encodeURIComponent(Email) +
            "&DistrictId=&District=" + encodeURIComponent(District) +
            "&MandalMunicipalityId=&MandalMunicipality=" + encodeURIComponent(MandalMunicipality) +
            "&PanchayatWardId=&PanchayatWard=" + encodeURIComponent(PanchayatWard) +
            "&Active=" + encodeURIComponent(this.state.Active) +
            "&Designation=" + encodeURIComponent(this.state.Designation) +
            "&page=" + page + "&count=" + count;
        MyAjax(
            url,
            (data) => {
                this.setState({
                    OfficialContacts: data["officialContacts"], dataTotalSize: data["totalRecords"],
                    currentPage: page, sizePerPage: count, IsDataAvailable: true
                })
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }), "GET", null
        );
    }


    render() {
        return (
            <div className="col-xs-12">
                <h2>Official Contacts <span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/official-contact") }}>Add</button></span></h2>

                <div className="col-xs-12 bg-grey search-container">
                    <form name="search-form" id="searchForm" onChange={() => this.setState({ formChanged: 1 })}>
                        <div className="col-sm-2 form-group">
                            <label>Name</label>
                            <input className="form-control" type="text" name="name" ref="name" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Email</label>
                            <input className="form-control" type="text" name="email" ref="email" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Phone</label>
                            <input className="form-control" type="text" name="phone" ref="phone" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Designation</label>
                            <select className="form-control" name="designation" ref="designation" autoComplete="off">
                                <option value="">All</option>
                                {
                                    this.state.Designations.map((ele) => {
                                        return <option value={ele["label"]}>{ele["label"]}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Status</label>
                            <select className="form-control" name="active" ref="active" autoComplete="off">
                                <option value="">All</option>
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </select>
                        </div>

                        <div className={"col-sm-2 form-group "}>
                            <label>District</label>
                            <input className="form-control" type="text" name="district" ref="district" autoComplete="off" disabled={this.state.IsCPO || this.state.IsMPDO} />
                        </div>
                        <div className={"col-sm-2 form-group "}>
                            <label>Mandal/Municipality</label>
                            <input className="form-control" type="text" name="mandalMunicipality" ref="mandalMunicipality" autoComplete="off" disabled={this.state.IsMPDO} />
                        </div>
                        <div className="col-sm-2 form-group">
                            <label>Panchayat/Ward</label>
                            <input className="form-control" type="text" name="panchayatWard" ref="panchayatWard" autoComplete="off" />
                        </div>
                        <div className="col-sm-2 button-block">
                            <input type="button" className="btn btn-success" value="Search" onClick={this.search.bind(this)} />
                            <input type="button" className="btn btn-default" value="Clear" onClick={this.clear.bind(this)} />
                        </div>
                    </form>
                </div>
                <div className="clearfix"></div>
                {
                    this.state.IsDataAvailable ?
                        <BootstrapTable data={this.state.OfficialContacts} striped hover remote={remote} pagination={true}
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
                            <TableHeaderColumn dataField='Name' isKey={true} dataSort={true} >Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='Designation' dataSort={true} width='110'>Designation</TableHeaderColumn>
                            <TableHeaderColumn dataField='Email' dataSort={true}>Email</TableHeaderColumn>
                            <TableHeaderColumn dataField='PrimaryPhone' dataSort={true}>Phone</TableHeaderColumn>
                            <TableHeaderColumn dataField='PanchayatWard' dataSort={true}>Panchayat/Ward</TableHeaderColumn>
                            <TableHeaderColumn dataField='MandalMunicipality' dataSort={true}>Mandal/Municipality</TableHeaderColumn>
                            <TableHeaderColumn dataField='District' dataSort={true} >District</TableHeaderColumn>
                            <TableHeaderColumn dataField='StartDate' dataSort={true} dataFormat={(val) => moment(val).format("DD-MM-YYYY")} width='100'>Start Date</TableHeaderColumn>
                            <TableHeaderColumn dataField='EndDate' dataSort={true} dataFormat={(val) => { return moment(val).isValid() ? moment(val).format("DD-MM-YYYY") : "" }} width='100'>End Date</TableHeaderColumn>
                            <TableHeaderColumn columnClassName="text-center" dataField='Id' dataFormat={this.EditViewFormatter.bind(this)} width='35'></TableHeaderColumn>
                        </BootstrapTable>
                        :
                        <div className="loader visible"></div>
                }
            </div >
        );
    }

    onPageChange(page, sizePerPage) {
        this.getOfficialContacts(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getOfficialContacts(this.state.currentPage, sizePerPage);
    }

    EditViewFormatter(cell, row) {
        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => this.props.history.push("/admin/official-contact/" + row["Id"])}></i >;
    }

    search() {
        if (this.state.formChanged === 0) {
            return;
        }
        this.setState({
            formChanged: 0,
            Name: this.refs.name.value,
            Email: this.refs.email.value,
            Phone: this.refs.phone.value,
            District: this.refs.district.value,
            MandalMunicipality: this.refs.mandalMunicipality.value,
            PanchayatWard: this.refs.panchayatWard.value,
            Designation: this.refs.designation.value,
            Active: this.refs.active.value,
            currentPage: 1
        }, () => {
            this.getOfficialContacts(1, this.state.sizePerPage);
        });
    }

    clear() {
        $("#searchForm").find("input[type=text]:enabled").val("");
        $("#searchForm").find("input[type=date]").val("");
        $("#searchForm").find("select").val("");
        this.setState({
            formChanged: 1,
            Name: this.refs.name.value,
            Email: this.refs.email.value,
            Phone: this.refs.phone.value,
            District: this.refs.district.value,
            MandalMunicipality: this.refs.mandalMunicipality.value,
            PanchayatWard: this.refs.panchayatWard.value,
            Designation: this.refs.designation.value,
            Active: this.refs.active.value,
            currentPage: 1
        }, () => {
            this.getOfficialContacts(1, this.state.sizePerPage);
        });
    }


}

export default OfficialContacts;


