import React, { Component } from 'react';
import NewOfficialContact from './NewOfficialContact'
import ViewOfficialContact from './ViewOfficialContact'
import EditOfficialContact from './EditOfficialContact'


class OfficialContact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            OfficialContact_Id: undefined, EditMode: false
        };
    }

    componentWillMount() {
        this.setState({ OfficialContact_Id: this.props.match.params["id"] });
    }




    render() {
        if (this.state.EditMode) {
            return (<EditOfficialContact officialContactId={this.state.OfficialContact_Id} history={this.props.history} toggleEditMode={this.toggleEditMode.bind(this)} />)
        }
        if (this.state.OfficialContact_Id) {
            return (<ViewOfficialContact officialContactId={this.state.OfficialContact_Id} toggleEditMode={this.toggleEditMode.bind(this)} history={this.props.history}/>)
        }
        else {
            return (<NewOfficialContact  history={this.props.history}  toggleEditMode={this.toggleEditMode.bind(this)}/>)
        }
    }

    toggleEditMode() {
        this.setState({ EditMode: !this.state.EditMode });
    }







}



export default OfficialContact;

