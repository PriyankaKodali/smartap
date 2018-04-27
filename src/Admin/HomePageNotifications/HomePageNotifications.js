import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { ApiUrl, remote } from '../../Config';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import $ from 'jquery';
import { showErrorsForInput } from '../../ValidateForm';
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');


// import { Link } from 'react-router-dom';

class HomePageNotifications extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Images: [], IsDataAvailable: false, Notifications: null, Notification: {},
            currentPage: 1, sizePerPage: 10, dataTotalSize: 0, Mode: "New"
        };
    }

    componentWillMount() {
        this.getNotifications(this.state.currentPage, this.state.sizePerPage);
    }

    componentDidMount() {
        console.log($('.date'));
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    componentDidUpdate() {
        console.log($('.date'));
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }


    getNotifications(page, count) {
        var url = ApiUrl + "/api/HomePageNotifications/GetHomePageNotifications?page=" + page + "&count=" + count;
        MyAjax(
            url,
            (data) => this.setState({ Notifications: data["notifications"], dataTotalSize: data["totalRecords"], currentPage: page, sizePerPage: count, IsDataAvailable: true }),
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );
    }


    componentWillUnmount() {
        $(".modal").modal("hide");
    }

    render() {
        return (
            this.state.IsDataAvailable ?
                <div className="col-xs-12">
                    <h2>Home Page Notifications <span className="pull-right"> <div className="btn btn-default" onClick={this.addNewNotification.bind(this)}> Add New </div> </span> </h2>
                    <hr />

                    <BootstrapTable data={this.state.Notifications} striped hover remote={remote} pagination={true}
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
                        <TableHeaderColumn dataField='CreatedDate' columnTitle={true} dataSort={true} dataFormat={this.dateViewFormatter.bind(this)} >Date</TableHeaderColumn>
                        <TableHeaderColumn dataField='Message' columnTitle={true} dataSort={true} >Message</TableHeaderColumn>
                        <TableHeaderColumn dataField='StartDate' columnTitle={true} dataSort={true} dataFormat={this.dateViewFormatter.bind(this)}>Start Date</TableHeaderColumn>
                        <TableHeaderColumn dataField='EndDate' columnTitle={true} dataSort={true} dataFormat={this.dateViewFormatter.bind(this)}>End Date</TableHeaderColumn>
                        <TableHeaderColumn dataField='CreatedBy' columnTitle={true} dataSort={true}>Created By</TableHeaderColumn>
                        <TableHeaderColumn columnClassName="text-center" isKey={true} dataField='Id' dataFormat={this.editViewFormatter.bind(this)} width='35'></TableHeaderColumn>
                    </BootstrapTable>


                    <div id="notificationModal" className="modal fade" role="dialog" ref="notificationModal" key={this.state.Notification}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-body">

                                    <div className="col-md-6" key={this.state.Notification["StartDate"]}>
                                        <label>Start Date</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                </span>
                                                <input type="text" className="date form-control" name="startDate" ref="startDate" placeholder="Start Date" defaultValue={moment(this.state.Notification["StartDate"]).format("DD-MM-YYYY")} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6" key={moment()}>
                                        <label>End Date</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                </span>
                                                <input type="text" className="date form-control" name="endDate" ref="endDate" placeholder="End Date" defaultValue={moment(this.state.Notification["EndDate"]).format("DD-MM-YYYY")} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-12" key={this.state.Notification["Message"]}>
                                        <label>Message</label>
                                        <div className="form-group" >
                                            <textarea className="form-control" name="message" type="text" ref="message" style={{ resize: "vertical" }} placeholder="Message" defaultValue={this.state.Notification["Message"]}></textarea>
                                        </div>
                                    </div>


                                    <div className="col-xs-12 text-center">
                                        <button name="submitNotification" className="btn btn-primary" value="Submit" style={{ "marginTop": "23px" }} onClick={this.submitNotification.bind(this)}>Submit</button>
                                        <div className="loader loaderNotification" style={{ marginTop: "28px" }}></div>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="loader visible"></div>
        );
    }

    dateViewFormatter(cell, row) {
        if (moment(cell).isValid()) {
            return moment(cell).format("DD-MM-YYYY");
        }
        return "";
    }

    editViewFormatter(cell, row) {
        return <i className='fa fa-pencil-square pointer' style={{ fontSize: '18px' }} onClick={() => {
            this.setState({ Notification: row, Mode: "Edit" }, () => {
                $("#notificationModal").modal("show");
            });

        }
        }></i >;
    }

    addNewNotification() {
        this.setState({ Mode: "New", Notification: {} }, () => {
            $("#notificationModal").modal("show");
            this.refs.endDate.value = "";
            this.refs.message.value = "";
        });

    }

    submitNotification() {
        if (!this.validate()) {
            return;
        }
        $(".loaderNotification").show();
        $("button[name='submitNotification']").hide();
        var startDate = this.refs.startDate.value.trim();
        var endDate = this.refs.endDate.value.trim();
        var message = this.refs.message.value.trim();
        var formData = new FormData();
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("message", message);
        formData.append("id", this.state.Notification["Id"]);

        var url = ApiUrl;
        if (this.state.Mode === "New") {
            url += "/api/HomePageNotifications/AddNotification";
        }
        else {
            url += "/api/HomePageNotifications/EditNotification";
        }


        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Notification is added successfully!", {
                    type: toast.TYPE.SUCCESS
                });
                $(".loaderNotification").hide();
                $("button[name='submitNotification']").show();
                $("#notificationModal").modal("hide");
                this.getNotifications(this.state.currentPage, this.state.sizePerPage);
                return true;
            },
            (error) => {
                toast("An error occoured, please try again!", {
                    type: toast.TYPE.ERROR
                });
                $(".loaderNotification").hide();
                $("button[name='submitNotification']").show();
                return false;
            },
            "POST",
            formData
        )
    }

    validate() {
        var success = true;
        var startDate = this.refs.startDate.value.trim();
        var endDate = this.refs.endDate.value.trim();
        var message = this.refs.startDate.value.trim();

        if (startDate.length == 0) {
            this.refs.startDate.value = moment().format("DD-MM-YYYY");
        }

        if (endDate.length != 0) {
            if (moment(endDate, "DD-MM-YYYY").isBefore(moment(startDate, "DD-MM-YYYY"))) {
                showErrorsForInput(this.refs.endDate, ["Please enter a valid date"]);
                success = false;
            }
        }
        else {
            showErrorsForInput(this.refs.endDate, []);
        }

        if (message.length == 0) {
            showErrorsForInput(this.refs.message, ["Please enter a valid message"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.message, []);
        }
        return success;
    }

    onPageChange(page, sizePerPage) {
        this.getNotifications(page, sizePerPage);
    }

    onSizePerPageList(sizePerPage) {
        this.getNotifications(this.state.currentPage, sizePerPage);
    }
}

export default HomePageNotifications;