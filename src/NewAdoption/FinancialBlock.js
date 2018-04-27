import React, { Component } from 'react';
import { setUnTouched } from '../ValidateForm';
import  Select  from 'react-select';

class FinancialContributionsBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Representatives: this.props.representatives,
            Representative: null,
            SelectedPanchayatsWardsInSubAdoption: this.props.selectedValues,
            RepresentativeRequired: this.props.representativeRequired
        };
    }

    componentDidMount() {
        setUnTouched(document);
    }


    componentWillReceiveProps(nextProps) {
        this.setState({
            Representatives: nextProps.representatives,
            SelectedPanchayatsWardsInSubAdoption: nextProps.selectedValues,
            RepresentativeRequired: nextProps.representativeRequired
        });
    }

    render() {
        return (
            <div>
                <div className="col-md-6"><label>Financial Contribution for {this.props.panchayatsWard} :</label>
                    <label className="mleft5"><input type="checkbox" style={{ position: "relative", top: "2px", marginRight: "2px" }} value="financialContribution" name={"financialContribution" + this.props.panchayatsWard} onChange={this.checkboxChanged.bind(this)} />Yes</label>
                </div>

                {
                    (function () {
                        if (this.state.RepresentativeRequired) {
                            return (<div className="col-md-6"><label>Representative/Nominee for {this.props.panchayatsWard}</label>
                                <div className="form-group" >
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                        </span>
                                        <Select className="representative form-control" name={"representative" + this.props.panchayatsWard} options={this.state.Representatives} placeholder="Representative/Nominee" onChange={this.representativeSelected.bind(this)} ref={"representative" + this.props.panchayatsWard} value={this.state.Representative} />
                                        <span className="input-group-btn">
                                            <button className="btn btn-info" type="button" data-toggle="modal" data-target="#myModal">Add New</button>
                                        </span>
                                    </div>
                                </div>
                            </div>)
                        }
                    }.bind(this))()
                }

            </div>
        );
    }

    checkboxChanged(e) {
        var selectedPanchayatsWards = this.state.SelectedPanchayatsWardsInSubAdoption;
        var selectedPanchayatsWardIndex = this.state.SelectedPanchayatsWardsInSubAdoption.findIndex((item) => item.PanchayatWardId === this.props.id);
        if (e.target.checked) {
            selectedPanchayatsWards[0]["FinancialContribution"] = true;
        }
        else {
            selectedPanchayatsWards[selectedPanchayatsWardIndex]["FinancialContribution"] = false;
        }
        this.props.contributionChanged(selectedPanchayatsWards);
    }

    representativeSelected(val) {
        this.setState({ Representative: val });
        var selectedPanchayatsWards = this.state.SelectedPanchayatsWardsInSubAdoption;
        var selectedPanchayatsWardIndex = this.state.SelectedPanchayatsWardsInSubAdoption.findIndex((item) => item.PanchayatWardId === this.props.id);
        if (val) {
            selectedPanchayatsWards[0]["RepresentativeId"] = val["value"];
        }
        else {
            selectedPanchayatsWards[selectedPanchayatsWardIndex]["RepresentativeId"] = null;
        }
        this.props.contributionChanged(selectedPanchayatsWards);

    }

}



export { FinancialContributionsBlock };

