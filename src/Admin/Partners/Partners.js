import React, { Component } from 'react';
import AdoptionApplication from '../AdoptionApplications/AdoptionApplications';


// import { Link } from 'react-router-dom';

class Partners extends Component {

    constructor(props) {
        super(props);
        this.state = { location: {} };
    }
    componentWillMount() {
        var location = {
            state: {
                area: "",
                districtId: "",
                district: "",
                mandalMunicipalityId: "",
                mandalMunicipality: "",
                panchayatWardId: "",
                panchayatWard: "",
                status: "Approved",
                type: "",
                fromDate: "",
                toDate: ""
            }
        }
        this.setState({ location: location });
    }
    render() {
        return (<AdoptionApplication location={this.state.location} history={this.props.history} match={this.props.match}></AdoptionApplication>)
    }
}

export default Partners;

