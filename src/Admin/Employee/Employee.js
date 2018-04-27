import React, { Component } from 'react';
import { showErrorsForInput, setUnTouched, ValidateForm } from '../../ValidateForm';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { validate } from 'validate.js';
import { ApiUrl } from '../../Config';
import { MyAjax } from '../../MyAjax';
import Select from 'react-select';


class Employee extends Component {

    constructor(props) {
        super(props);
        this.state = { Designations: [], Designation: null, EmployeeId: null, Employee: {} }
    }

    componentWillMount() {
        this.setState({ EmployeeId: this.props.match.params["id"] }, () => {
            if (this.props.match.params["id"]) {
                MyAjax(
                    ApiUrl + "/api/Admin/GetEmployee?EmployeeId=" + this.state.EmployeeId,
                    (data) => {
                        this.setState({
                            Employee: data["employee"], IsDataAvailable: true,
                            Designation: { value: data["employee"]["Designation"], label: data["employee"]["Designation"] }
                        })
                    },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
            }

        });

        MyAjax(
            ApiUrl + "/api/MasterData/GetEmployeeDesignations",
            (data) => { this.setState({ Designations: data["designations"] }); },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
    }

    componentDidMount() {
        setUnTouched(document);
    }

    designationChanged(val) {
        this.setState({ Designation: val });
        if (!val) {
            showErrorsForInput(this.refs.designation.wrapper, ["Please select a valid Designation"]);
        }
        else {
            showErrorsForInput(this.refs.designation.wrapper, null);
        }
    }

    render() {
        return (
            <div className="container" key={this.state.Employee["Name"]}>
                {
                    this.state.EmployeeId === undefined ? <h2>New Employee<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/employees"); }}>Back</button></span></h2>
                        :
                        <h2>Edit Employee<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/employees"); }}>Back</button></span></h2>
                }

                <form name="EmployeeForm" ref="EmployeeForm" onChange={this.validateForm.bind(this)} >
                    <div className="col-sm-12">
                        <div className="col-sm-4">
                            <label htmlFor="firstName">Name</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="text" placeholder="Name" name="name" autoComplete="off" ref="name" defaultValue={this.state.Employee["Name"]} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4" key={this.state.Designation}>
                            <label htmlFor="designation">Designation</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-briefcase" aria-hidden="true"></i>
                                    </span>
                                    <Select className="designation form-control" name="designation" options={this.state.Designations} placeholder="Designation" ref="designation" value={this.state.Designation} onChange={this.designationChanged.bind(this)} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4" key={this.state.Employee["Email"]}>
                            <label htmlFor="email">Email</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-envelope" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="text" placeholder="Email" name="email" autoComplete="off" ref="email" defaultValue={this.state.Employee["Email"]} disabled={this.state.Employee["Email"] !== undefined} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-4" key={this.state.Employee["PhoneNumber"]}>
                            <label htmlFor="phone">Phone</label>
                            <div className="form-group">
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-phone" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" type="text" placeholder="Phone" name="phone" autoComplete="off" ref="phone" defaultValue={this.state.Employee["PhoneNumber"]} />
                                </div>
                            </div>
                        </div>
                        {
                            this.state.EmployeeId === undefined ? <div className="col-sm-12 text-center">
                                <button type="submit" name="submitEmployee" className="btn btn-primary" onClick={this.handleEmployeeFormSubmit.bind(this)}>Add</button>
                                <div className="loader loaderEmployee"></div>
                            </div>
                                :
                                <div className="col-sm-12 text-center">
                                    <button type="submit" name="submitEmployee" className="btn btn-primary" onClick={this.handleEmployeeFormSubmit.bind(this)}>Edit</button>
                                    {
                                        this.state.Employee["Active"] ? <button type="submit" name="disableEmployee" className="btn btn-danger mleft10" onClick={this.handleEmployeeDisable.bind(this)}>Disable</button> :
                                            <button type="submit" name="enableEmployee" className="btn btn-success mleft10" onClick={this.handleEmployeeEnable.bind(this)}>Enable</button>
                                    }

                                    <div className="loader loaderEmployee"></div>
                                </div>
                        }

                    </div>
                </form>
            </div>

        )
    }

    handleEmployeeFormSubmit(e) {
        try {
            $(".loaderEmployee").show();
            $("button[type='submit']").hide();

            e.preventDefault();
            toast.dismiss();

            if (!this.validateForm(e)) {
                $(".loaderEmployee").hide();
                $("button[type='submit']").show();
                return;
            }

            var data = {
                name: this.refs.name.value, designation: this.state.Designation.label,
                email: this.refs.email.value, employeeId: this.state.EmployeeId,
                phone: this.refs.phone.value
            };

            var url = ApiUrl;
            if (this.state.EmployeeId === undefined) {
                url += "/api/Admin/AddNewEmployee";
            }
            else {
                url += "/api/Admin/EditEmployee";
            }

            MyAjax(
                url,
                (data) => {
                    toast("Employee sucessfully added!", {
                        type: toast.TYPE.SUCCESS
                    });
                    this.props.history.push("/admin/employees");
                },
                (error) => {
                    $(".loaderEmployee").hide();
                    $("button[name='submitEmployee']").show();
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    });
                },
                "POST",
                data
            )

        }
        catch (e) {
            $(".loaderEmployee").hide();
            $("button[name='submitEmployee']").show();
        }
    }

    handleEmployeeDisable(e) {
        e.preventDefault();
        var url = ApiUrl + "/api/Admin/DisableEmployee?EmployeeId=" + this.state.EmployeeId;
        MyAjax(
            url,
            (data) => {
                toast("Employee sucessfully disabled!", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/admin/employees");
            },
            (error) => {
                $(".loaderEmployee").hide();
                $("button[name='submitEmployee']").show();
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
            },
            "GET",
            null
        )
    }

    handleEmployeeEnable(e) {
        e.preventDefault();
        var url = ApiUrl + "/api/Admin/EnableEmployee?EmployeeId=" + this.state.EmployeeId;
        MyAjax(
            url,
            (data) => {
                toast("Employee sucessfully Enabled!", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/admin/employees");
            },
            (error) => {
                $(".loaderEmployee").hide();
                $("button[name='submitEmployee']").show();
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
            },
            "GET",
            null
        )
    }

    validateForm(e) {
        var success = true;
        var name = this.refs.name.value.trim();
        var email = this.refs.email.value.trim();
        var phone = this.refs.phone.value.trim();

        if (name === "") {
            success = false;
            showErrorsForInput(this.refs.name, ["Please enter a valid name"]);
        }
        else {
            showErrorsForInput(this.refs.name, []);
        }

        if (!this.state.Designation || !this.state.Designation.value) {
            success = false;
            showErrorsForInput(this.refs.designation.wrapper, ["Please select a valid Designation"]);
        }

        if (validate.single(email, { presence: true, email: true }) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.email, ["Please enter a valid email"]);
        }
        else {
            showErrorsForInput(this.refs.email, []);
        }

        var phoneConstraints = {
            presence: true,
            format: {
                pattern: "(91-[0-9]{10})",
                flags: "g"
            }
        }
        if (validate.single(phone, phoneConstraints) !== undefined) {
            success = false;
            showErrorsForInput(this.refs.phone, ["Please enter a valid phone number (eg: 91-9876543210)"]);
        }
        else {
            showErrorsForInput(this.refs.phone, []);
        }

        return success;
    }

}

export default Employee;

