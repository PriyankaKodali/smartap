import React, { Component } from 'react';
import './ProjectProposal.css'
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';
import AdminProjectProposal from './AdminProjectProposal'
import OfficalProjectProposal from './OfficialProjectProposal'

class ProjectProposal extends Component {

    render() {
        var roles = sessionStorage.getItem("smart_ap_roles");
        if (roles.indexOf('Admin')  !== -1) {
            return <AdminProjectProposal  match={this.props.match} history={this.props.history}/>
        }
        if (roles.indexOf('CPO')  !== -1||roles.indexOf('MPDO')  !== -1||roles.indexOf('MO')  !== -1) {
            return <OfficalProjectProposal  match={this.props.match}  history={this.props.history}/>
        }
    }


}

export { ProjectProposal };
