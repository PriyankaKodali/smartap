import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { MyAjax } from '../../MyAjax';
import { ApiUrl } from '../../Config';
import $ from 'jquery';

class ViewOfficialContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            OfficialContact: null, LocationName: "", UserExists: false
        };
    }

    componentWillMount() {
        MyAjax(
            ApiUrl + "/api/Admin/GetOfficialContact?Id=" + this.props.officialContactId,
            (data) => {
                data["officialContact"]["StartDate"] = data["officialContact"]["StartDate"] !== null ? data["officialContact"]["StartDate"].split('T')[0] : "";
                data["officialContact"]["EndDate"] = data["officialContact"]["EndDate"] !== null ? data["officialContact"]["EndDate"].split('T')[0] : "";

                this.setState({ OfficialContact: data["officialContact"], UserExists: data["officialContact"]["AspNetUser_Id"] !== null }, () => {
                    switch (this.state.OfficialContact["Designation"]) {
                        case "CPO": this.setState({ LocationName: this.state.OfficialContact["District"] }); break;
                        case "MPDO":
                        case "MO":
                            this.setState({ LocationName: this.state.OfficialContact["MandalMunicipality"] }); break;
                        case "Sarpanch": this.setState({ LocationName: this.state.OfficialContact["PanchayatWard"] }); break;
                        case "MLA": this.setState({ LocationName: this.state.OfficialContact["AssemblyConstituency"] }); break;
                        default: this.setState({ LocationName: this.state.OfficialContact["District"] }); break;
                    }
                });
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET", null
        );

    }


    render() {
        return (
            <div className="container">
                {(function () {
                    if (this.state.OfficialContact !== null) {
                        return (
                            <div>
                                <div className="col-sm-12 col-md-6 center-block">
                                    <table className="table table-striped table-condensed" style={{ border: '1pt solid #ddd', padding: '2px' }}>
                                        <thead style={{ fontSize: '20px' }}>
                                            <tr><th colSpan={2}>{this.state.OfficialContact["Designation"] + " - " + this.state.LocationName}</th></tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td><b>Name</b></td>
                                                <td>{this.state.OfficialContact["FirstName"]}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Email</b></td>
                                                <td>{this.state.OfficialContact["Email"]}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Primary Phone</b></td>
                                                <td>{this.state.OfficialContact["PhoneNumber"]}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Secondary Phone</b></td>
                                                <td>{this.state.OfficialContact["SecondaryPhoneNumber"]}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Address</b></td>
                                                <td>{this.state.OfficialContact["Address"]}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Start Date</b></td>
                                                <td>{this.state.OfficialContact["StartDate"]}</td>
                                            </tr>
                                            <tr>
                                                <td><b>End Date</b></td>
                                                <td>{this.state.OfficialContact["EndDate"]}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Active</b></td>
                                                <td>{this.state.OfficialContact["Active"].toString().toUpperCase()}</td>
                                            </tr>
                                            <tr>
                                                <td><b>User Exists</b></td>
                                                <td>{this.state.UserExists.toString().toUpperCase()}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="text-center btn-blk">
                                        <button className="btn btn-default" onClick={e => this.props.toggleEditMode()}>Edit</button><div style={{ width: "10px", display: "inline-block" }}></div>
                                        {this.state.UserExists ? "" : <button className="btn btn-default" onClick={this.createUser.bind(this)}>Create User</button>}
                                    </div>
                                    <div className="loader"></div>

                                </div>
                            </div>
                        );
                    }
                    else {
                        return (
                            <div className="loader visible"></div>)
                    }
                }.bind(this))()}
            </div>

        );
    }


    createUser() {
        $(".btn-blk").hide();
        $(".loader").show();
        MyAjax(
            ApiUrl + "/api/Admin/CreateUserForOfficialContact?OfficialContact_Id=" + this.props.officialContactId,
            (data) => {
                this.setState({ OfficialContact: data["officialContact"], UserExists: true })
                $(".btn-blk").show();
                $(".loader").hide();
                toast("User added successfully", {
                    type: toast.TYPE.SUCCESS
                });
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".btn-blk").show();
                $(".loader").hide();
            },
            "GET", null
        );
    }
}



export default ViewOfficialContact;

