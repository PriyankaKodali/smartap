import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { toast } from 'react-toastify';
import { MyAjax } from '../../MyAjax';
import { ApiUrl } from '../../Config'
import { showErrorsForInput } from '../../ValidateForm';
import './Donation.css'
import Select from 'react-select';
var moment = require('moment');

class Donation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "", Donation: null, DonationId: 0, Status: null, IsDataAvailable: false,
            Statuses: [{ label: "Success", value: "TXN_SUCCESS" }, { label: "Failure", value: "TXN_FAILURE" }]
        };
    }

    componentWillMount() {
        this.setState({ DonationId: this.props.match.params["id"] }, () => {
            MyAjax(
                ApiUrl + "/api/Donation/GetDonation?donationId=" + this.state.DonationId,
                (data) => { this.setState({ Donation: data["donation"], IsDataAvailable: true }) },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            )
        });
    }

    componentDidMount() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }

    componentDidUpdate() {
        $('.date').datepicker({ dateFormat: 'dd-mm-yy' });
    }


    render() {
        if (this.state.IsDataAvailable) {
            return (
                <div className="container donation-container">
                    <h1>Donation for Smart AP <div className="pull-right btn btn-default" onClick={() => this.props.history.push("/admin/donations")}>Back</div> </h1>

                    <div className="col-md-6 col-xs-12 ">
                        <table className="table table-condensed table-bordered">
                            <tbody>
                                <tr>
                                    <th>Partner</th>
                                    <td><a className="pointer" onClick={() => this.props.history.push("/admin/partner-details/" + this.state.Donation["Partner_Id"])}>{this.state.Donation["PartnerName"]}</a></td>
                                </tr>
                                <tr>
                                    <th>PAN</th>
                                    <td>{this.state.Donation["PAN"]}</td>
                                </tr>
                                <tr>
                                    <th>Panchayat / Ward</th>
                                    <td>{this.state.Donation["PanchayatWard"]}</td>
                                </tr>
                                <tr>
                                    <th>Mandal / Municipality</th>
                                    <td>{this.state.Donation["MandalMunicipality"]}</td>
                                </tr>
                                <tr>
                                    <th>District</th>
                                    <td>{this.state.Donation["District"]}</td>
                                </tr>
                                <tr>
                                    <th>Amount</th>
                                    <td>{this.state.Donation["Amount"].toLocaleString('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                    })}</td>
                                </tr>
                                <tr>
                                    <th>Donated Date</th>
                                    <td>{moment(this.state.Donation["CreatedTime"]).format("DD-MM-YYYY  HH:MM")}</td>
                                </tr>
                                {
                                    this.state.Donation["Status"] === "TXN_SUCCESS" ?
                                        <tr>
                                            <th>Quickbooks Synced</th>
                                            <td>{this.state.Donation["QB_Deposit_Id"] === null ? <span>NO (<a className="pointer" onClick={this.syncQuickBooks.bind(this)}>Sync Now</a>)</span> : "YES"}</td>
                                        </tr> :
                                        <div />
                                }

                            </tbody>
                        </table>
                    </div>

                    <div className="col-md-6 col-xs-12 ">
                        <table className="table table-condensed table-bordered">
                            <tbody>
                                <tr>
                                    <th>Type</th>
                                    <td>{this.state.Donation["DonationType"]}</td>
                                </tr>
                                {
                                    this.state.Donation["DonationType"] === "Online" ?
                                        <tr>
                                            <th>Txn Id</th>
                                            <td>{this.state.Donation["TxnId"]}</td>
                                        </tr> :
                                        <tr>
                                            <th>Cheque No</th>
                                            <td>{this.state.Donation["ChequeNumber"]}</td>
                                        </tr>
                                }
                                <tr>
                                    <th>Received Date</th>
                                    {this.state.Donation["ReceivedDate"] ?
                                        <td>{moment(this.state.Donation["ReceivedDate"]).format("DD-MM-YYYY HH:MM")}</td> : <td></td>}
                                </tr>
                                <tr>
                                    <th>Bank Ref No</th>
                                    <td>{this.state.Donation["BankRefNumber"]}</td>
                                </tr>
                                <tr>
                                    <th>Bank Name</th>
                                    <td>{this.state.Donation["BankName"]}</td>
                                </tr>
                                <tr>
                                    <th>Bank Branch</th>
                                    <td>{this.state.Donation["BankBranch"]}</td>
                                </tr>
                                <tr>
                                    <th>Response</th>
                                    <td>{this.state.Donation["ResponseMessage"]}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td className={"" + this.state.Donation["Status"] === "TXN_SUCCESS" ? "green" : this.state.Donation["Status"] === "TXN_FAILURE" ? "red" : "orange"}>{this.state.Donation["Status"]}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    <div className="col-xs-12">
                        <table className="table table-condensed table-bordered">
                            <tbody>
                                <tr>
                                    <th>Description</th>
                                    <td>{this.state.Donation["Description"]}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {this.state.Donation["DonationType"] !== "Online" && this.state.Donation["Status"] === "TXN_PENDING" ?
                        <form onSubmit={this._handleSubmit.bind(this)}>

                            <div className="col-md-4">
                                <label>Cleared Date</label>
                                <div className="form-group" >
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-calendar" aria-hidden="true"></i>
                                        </span>
                                        <input className="date form-control" type="text" name="clearedDate" ref="clearedDate" placeholder="Cleared Date" autoComplete="off" />
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-4">
                                <label>Status</label>
                                <div className="form-group" >
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-map-marker" aria-hidden="true"></i>
                                        </span>
                                        <Select className="status form-control" name="status" options={this.state.Statuses} placeholder="Status" onChange={this.statusChange.bind(this)} ref="status" value={this.state.Status} />
                                    </div>
                                </div>
                            </div>

                            {
                                this.state.Status && this.state.Status.value !== "TXN_SUCCESS" ?
                                    <div className="col-md-4">
                                        <label>Error</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" name="error" ref="error" placeholder="Error Message" maxLength="100" autoComplete="off" />
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div />
                            }


                            <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center form-group">
                                <button type="submit" name="submit" className="btn btn-primary">Submit</button>
                                <div className="loader"></div>
                            </div>

                        </form>
                        :
                        <div />}
                </div >
            );
        }
        else {
            return (<div className="loader visible"></div>)
        }
    }

    statusChange(val) {
        this.setState({ Status: val });
        if (val) {
            showErrorsForInput(this.refs.status.wrapper, null);
        }
        else {
            showErrorsForInput(this.refs.status.wrapper, ["Please select a valid Status"]);
        }
    }

    _handleSubmit(e) {
        e.preventDefault();
        toast.dismiss();

        if (!this.validate()) {
            return;
        }


        $(".loader").show();
        $("button[name='submit']").hide();

        var data = {
            donationId: this.state.Donation["Id"],
            clearedDate: this.refs.clearedDate.value,
            status: this.state.Status.value,
        };
        if (this.state.Status.value !== "TXN_SUCCESS") {
            data["error"] = this.refs.error.value.trim();
        }
        else {
            data["error"] = "No Error";
        }

        var url = ApiUrl + "api/Donation/ReviewOfflinePayment";
        try {
            MyAjax(
                url,
                (data) => {
                    toast("Donation details updated!", {
                        type: toast.TYPE.SUCCESS
                    });
                    this.setState({ Donation: data["donation"] });
                },
                (error) => {
                    toast("An error occoured, please try again!", {
                        type: toast.TYPE.ERROR
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    return false;
                },
                "POST",
                data
            )
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
            $(".loader").hide();
            $("button[name='submit']").show();
            return false;
        }
    }

    validate() {
        var success = true;

        //clearedDate
        if (this.refs.clearedDate.value.trim() === "") {
            showErrorsForInput(this.refs.clearedDate, ["Please enter a valid Date"]);
            success = false;
        }
        else if (moment(this.refs.clearedDate.value, "DD/MM/YYYY").isAfter(moment())) {
            showErrorsForInput(this.refs.clearedDate, ["Cleared date should not be a future date"]);
            success = false;
        }
        // else if (moment(this.refs.clearedDate.value).isBefore(moment(this.state.Donation["CreatedTime"]).add(-1, "day"))) {
        //     showErrorsForInput(this.refs.clearedDate, ["Cleared date should be a less than Donation Date"]);
        //     success = false;
        // }
        else {
            showErrorsForInput(this.refs.clearedDate, []);
        }


        //status
        if (!this.state.Status) {
            showErrorsForInput(this.refs.status.wrapper, ["Please select a valid Status"]);
        }

        //error message
        if (this.state.Status && this.state.Status.value !== "success") {
            if (this.refs.error.value.trim() === "") {
                showErrorsForInput(this.refs.error["Please enter a valid description"]);
                success = false;
            }
            else {
                showErrorsForInput(this.refs.error, []);
            }
        }

        return success;
    }

    syncQuickBooks() {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Quickbooks/SyncQuickbooks";
        MyAjax(
            url,
            (data, status, e) => {
                if (data["url"] !== undefined) {
                    var msg = <div>Please click<u className="pointer" onClick={() => window.open(data["url"], "_blank")}> here to login</u> to quickbooks </div>
                    toast(msg, {
                        type: toast.TYPE.INFO,
                        autoClose: false
                    })
                    this.setState({ IsDataAvailable: true });
                }
                else if (e.status == 203) {
                    toast(data, {
                        type: toast.TYPE.ERROR
                    })
                    this.setState({ IsDataAvailable: true });
                }
                else {
                    MyAjax(
                        ApiUrl + "/api/Donation/GetDonation?donationId=" + this.state.DonationId,
                        (data) => { this.setState({ Donation: data["donation"], IsDataAvailable: true }) },
                        (error) => toast(error.responseText, {
                            type: toast.TYPE.ERROR
                        })
                    )
                }
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            }
        )
    }

}

export default Donation;


