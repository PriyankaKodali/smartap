import React, { Component } from 'react';
// import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl } from '../../Config';
import { MyAjax } from '../../MyAjax';
var moment = require('moment');

class WowTracker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            DailyData: [], IsDataAvailable: false
        };
    }

    componentWillMount() {
        this.getDailyDetails();
    }

    getDailyDetails() {
        this.setState({ IsDataAvailable: false });
        var url = ApiUrl + "/api/Wow/GetDailyActivityStats";
        MyAjax(
            url,
            (data) => { this.setState({ DailyData: data["dailyData"], IsDataAvailable: true }) },
            (error) => toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            }), "GET", null
        );
    }



    render() {
        return (
            <div className="col-xs-12">
                <h2>Wow Tracker<div className="btn btn-default pull-right" onClick={() => this.props.history.push("/admin/daily-wow-tracker")}>Add New</div> </h2>
                {
                    this.state.IsDataAvailable ?
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th rowSpan="2" className="text-center" width="80px">Date</th>
                                        <th rowSpan="2" className="text-center" width="200px">District</th>
                                        <th rowSpan="2" className="text-center" width="200px">Mandal</th>
                                        <th rowSpan="2" className="text-center" width="200px">Panchayat</th>
                                        <th colSpan="3" className="text-center" width="200px">School</th>
                                        <th colSpan="3" className="text-center" width="200px">Youth</th>
                                        <th colSpan="3" className="text-center" width="200px">Community</th>
                                        <th rowSpan="2"></th>
                                    </tr>
                                    <tr>
                                        <th className="text-center">Male</th>
                                        <th className="text-center">Female</th>
                                        <th className="text-center">Total</th>
                                        <th className="text-center">Male</th>
                                        <th className="text-center">Female</th>
                                        <th className="text-center">Total</th>
                                        <th className="text-center">Male</th>
                                        <th className="text-center">Female</th>
                                        <th className="text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.DailyData.map((item) => {
                                            var row = <tr>
                                                <td>{moment(item.Date).format("DD-MM-YY")}</td>
                                                <td>{item.District}</td>
                                                <td>{item.Mandal}</td>
                                                <td>{item.Panchayat}</td>
                                                <td>{item.SchoolChildrenMale}</td>
                                                <td>{item.SchoolChildrenFemale}</td>
                                                <td>{item.SchoolTotal}</td>
                                                <td>{item.YouthMale}</td>
                                                <td>{item.YouthFemale}</td>
                                                <td>{item.YouthTotal}</td>
                                                <td>{item.CommunityMembersMale}</td>
                                                <td>{item.CommunityMembersFemale}</td>
                                                <td>{item.CommunityTotal}</td>
                                                <td> <a onClick={() => this.props.history.push("/admin/wow-tracker-info/" + item.Id)}> <span className="fa fa-eye pointer"></span> </a> </td>
                                            </tr>;
                                            return row;
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        :
                        <div className="loader visble"></div>
                }
            </div>
        );
    }
}

export default WowTracker;


