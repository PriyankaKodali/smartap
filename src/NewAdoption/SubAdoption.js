import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { setUnTouched } from '../ValidateForm';
import { ApiUrl } from '../Config'
import { FinancialContributionsBlock } from './FinancialBlock'
import { MyAjax } from '../MyAjax';


class SubAdoption extends Component {

    constructor(props) {
        super(props);
        this.state = {
            PanchayatsWards: [], FinancialContributionsBlocks: [],
            MandalMunicipality: this.props.mandalMunicipality,
            PartnerType: this.props.partnerType, Representatives: this.props.representatives,
            SelectedPanchayatsWardsInSubAdoption: this.props.selectedValues, RepresentativeRequired: this.props.representativeRequired
        };
    }

    componentDidMount() {
        setUnTouched(document);

         MyAjax(
             ApiUrl + "/api/MasterData/GetPanchayatsWards?MandalMunicipalityId=" + this.state.MandalMunicipality.value + "&PartnerType=" + this.state.PartnerType,
             (data) => { this.setState({ PanchayatsWards: data["panchayatsWards"] }); this.createCheckBoxes(); },
             (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            Representatives: nextProps.representatives,
            SelectedPanchayatsWardsInSubAdoption: nextProps.selectedValues,
            RepresentativeRequired:nextProps.representativeRequired
        });
    }

    render() {
        return (
            <div className={"panel panel-primary " + this.state.MandalMunicipality.label} >
                <div className="panel-heading">{this.state.MandalMunicipality.label}</div>
                <div className="panel-body panchayatsWardPanel">
                    {this.state.checkboxes}
                </div>
                <div className="panel-footer financial-block clearfix">

                    {
                        this.state.FinancialContributionsBlocks.map((item) => {
                            return (
                                <FinancialContributionsBlock key={item.value} id={item.value} panchayatsWard={item.name} representatives={this.state.Representatives}
                                    contributionChanged={this.panchayatWardChanged.bind(this)} selectedValues={this.state.SelectedPanchayatsWardsInSubAdoption}
                                    representativeRequired={this.state.RepresentativeRequired} />
                            )
                        })
                    }
                </div>
            </div>
        );
    }

    createCheckBoxes() {
        var k = this.state.PanchayatsWards.map((e, i) => {
            return <div key={e.value} className={"myCheckbox " + (e.enabled ? '' : 'disabled')} title={e.enabled ? "" : "This panchayat/ward is not available for general partnership"}>  <label> <input type="checkbox" name={e.label} value={e.value} disabled={!e.enabled} onChange={this.checkboxChanged.bind(this)} />{e.label} </label></div>
        });
        this.setState({ checkboxes: k })
        // Select all elements with data-toggle="tooltips" in the document

    }

    checkboxChanged(e) {
        var selectedPanchayatsWards = this.state.SelectedPanchayatsWardsInSubAdoption;
        var financialContributionsBlocks = this.state.FinancialContributionsBlocks;
        if (e.target.checked) {
            e.target.closest(".myCheckbox").classList.add("panchayatWardChecked");
            financialContributionsBlocks.push(e.target);
            selectedPanchayatsWards.push({ PanchayatWardId: e.target.value, FinancialContribution: false, RepresentativeId: null, PartnerType: this.state.PartnerType });
        }
        else {
            e.target.closest(".myCheckbox").classList.remove("panchayatWardChecked");
            financialContributionsBlocks = financialContributionsBlocks.filter((item) => item.value !== e.target.value);
            selectedPanchayatsWards = selectedPanchayatsWards.filter((item) => item.PanchayatWardId !== e.target.value);
        }
        this.setState({ FinancialContributionsBlocks: financialContributionsBlocks });
        this.props.panchayatWardChanged(selectedPanchayatsWards);
    }

    panchayatWardChanged(value) {
        this.props.panchayatWardChanged(value);
    }
}



export { SubAdoption };

