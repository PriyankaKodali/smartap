import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { MyAjax, MyAjaxForAttachments } from '../MyAjax';
import { ApiUrl } from '../Config'
import { showErrorsForInput, setUnTouched } from '../ValidateForm';
import validate from 'validate.js';
import RichTextEditor from 'react-rte';
import './ProjectProposal.css'
import  Select  from 'react-select';

class ProjectProposal extends Component {

    constructor(props) {
        super(props);
        var descriptionHelp = "Please explain the project in detail. (Eg: Number of classrooms " +
            "for school, capacity of RO plant &amp; its type, number of " +
            "community toilets etc.)"
        var justificatilHelp = "<div> " +
            "<b>Please mention the following:</b>" +
            "<ul>" +
            " <li>Population of the Village/ward</li>" +
            "  <li>Socio-economic scenario of the village/ward" +
            "       (mention income levels, caste composition etc.)</li>" +
            "    <li>Situation of any existing facilities</li>" +
            "     <li>Distance from Mandal headquarters</li>" +
            "      <li>Why is the Project necessary?</li>" +
            "   </ul>" +
            "</div>";

        var beneficiariesTypes = [
            { value: "Girls", label: "Girls" },
            { value: "Girls", label: "Households" },
            { value: "Girls", label: "Students" },
            { value: "Girls", label: "Women" },
            { value: "Girls", label: "Youth" }
        ];

        this.state = {
            ProjectMasters: [], ProjectMaster: null, ProposalScope: null, ProjectDescription: RichTextEditor.createEmptyValue(),
            SelectedProject: {}, Phases: [], Districts: [], District: null, MandalsMunicipalities: [], ProjectSectors: [], ProjectSector: null,
            MandalMunicipality: null, PanchayatsWards: [], PanchayatWard: null, PropsalDescription: RichTextEditor.createEmptyValue(),
            PropsalDescriptionHtml: "", ProposalJustification: RichTextEditor.createEmptyValue(), ProposalJustificationHtml: "",
            JustificatilHelp: justificatilHelp, DescriptionHelp: descriptionHelp, BeneficiariesTypes: beneficiariesTypes,
            BeneficiariesType: null
        };
    }

    componentWillMount() {
        var roles = sessionStorage.getItem("smart_ap_roles");
        if (roles.indexOf('Partner') !== -1) {
            MyAjax( // check if the user completed his profile
                ApiUrl + "/api/Partner/GetPartner?PartnerId=",
                (data) => {
                    if (data["partner"]["City_Id"] === null) {
                        toast("Please complete your profile before proceeding", {
                            type: toast.TYPE.INFO
                        });
                        this.props.history.push("/partner-profile");
                    }
                }
            )
        }
        MyAjax(
            ApiUrl + "/api/Projects/GetProjectSectors",
            (data) => { this.setState({ ProjectSectors: data["projectSectors"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        );
        MyAjax(
            ApiUrl + "/api/MasterData/GetDistricts",
            (data) => { this.setState({ Districts: data["districts"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        );

    }

    componentDidMount() {
        setUnTouched(document);
        $('[data-toggle="popover"]').popover();
    }

    render() {
        return (
            <div className="container">
                <h2>New Project Proposal</h2>
                <hr />
                <form onSubmit={this._handleSubmit.bind(this)} onChange={this.validate.bind(this)}>

                    <div className="col-md-6">
                        <label>Sector</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-info" aria-hidden="true"></i>
                                </span>
                                <Select className="form-control" name="projectSector" options={this.state.ProjectSectors} placeholder="Sector" onChange={this.projectSectorChange.bind(this)} ref="projectSector" value={this.state.ProjectSector} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label>Project</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-info" aria-hidden="true"></i>
                                </span>
                                <Select className="projectMaster form-control" name="projectMaster" options={this.state.ProjectMasters} placeholder="Project" onChange={this.projectMasterChange.bind(this)} ref="projectMaster" value={this.state.ProjectMaster} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label>Proposal Name</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-info" aria-hidden="true"></i>
                                </span>
                                <input className="form-control" name="proposalName" ref="proposalName" placeholder="Proposal Name" autoComplete="off" />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label>District</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                </span>
                                <Select className="district form-control" name="district" options={this.state.Districts} placeholder="District" onChange={this.districtChange.bind(this)} ref="district" value={this.state.District} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label><span className="Select-menu-option Rural">Mandal</span>/<span className="Select-menu-option Urban">Municipality</span></label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                </span>
                                <Select
                                    optionRenderer={(option) => {
                                        return <span className={"Select-menu-option " + option.type}>{option.label}</span>;
                                    }}
                                    backspaceRemoves={false} className="mandalMunicipality form-control" name="mandalMunicipality" options={this.state.MandalsMunicipalities} placeholder="Mandal/Municipality" ref="mandalMunicipality" onChange={this.mandalMunicipalityChange.bind(this)} value={this.state.MandalMunicipality} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label>Panchayat/Ward</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                </span>
                                <Select className="panchayatWard form-control" name="panchayatWard" options={this.state.PanchayatsWards} placeholder="Panchayat/Ward" onChange={this.panchayatWardChange.bind(this)} ref="panchayatWard" value={this.state.PanchayatWard} />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <label>Address</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                </span>
                                <input className="form-control" name="address" ref="address" placeholder="Address" autoComplete="off" />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label>Scope</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                </span>
                                <Select className="proposalScope form-control" name="proposalScope" options={this.state.Scopes} placeholder="Project Scope" onChange={this.scopeChange.bind(this)} ref="proposalScope" value={this.state.ProposalScope} />
                            </div>
                        </div>
                    </div>

                    <div className={"col-md-6 " + (this.state.ProposalScope && this.state.ProposalScope.value === 0 ? "" : "hidden")}>
                        <label>Custom Scope</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-money" aria-hidden="true"></i>
                                </span>
                                <input className="form-control" name="customScope" ref="customScope" placeholder="Scope" autoComplete="off" />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <label>Your Contribution</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-money" aria-hidden="true"></i>
                                </span>
                                <input type="number" min={0} className="form-control" name="partnerContribution" ref="partnerContribution" placeholder="Contribution" autoComplete="off" />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <label>No. of Beneficiaries</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-users" aria-hidden="true"></i>
                                </span>
                                <input type="number" min={0} className="form-control" name="beneficiaries" ref="beneficiaries" placeholder="Beneficiaries" autoComplete="off" />
                            </div>
                        </div>
                    </div>


                    <div className="col-md-2">
                        <label>Beneficiaries Type</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-users" aria-hidden="true"></i>
                                </span>
                                <Select className="form-control" name="beneficiariesType" options={this.state.BeneficiariesTypes} placeholder="Beneficiaries Type" onChange={this.beneficiariesTypeChange.bind(this)} ref="beneficiariesType" value={this.state.BeneficiariesType} />
                            </div>
                        </div>
                    </div>


                    <div className="col-xs-12 about-project">
                        <label>About the project</label>
                        <div className="col-xs-12 communication-block mbot20">
                            <div className="col-md-2">
                                <label>SOP</label>
                                <div>
                                    {
                                        this.state.SelectedProject["SopURL"] ? <a className="btn btn-default" href={this.state.SelectedProject["SopURL"]} download disabled={this.state.SelectedProject["SopURL"] === null}>Download</a>
                                            :
                                            <span>Not Available</span>
                                    }

                                </div>
                            </div>

                            <div className="col-md-2">
                                <label>Information Material</label>
                                <div>
                                    {
                                        this.state.SelectedProject["InfoURL"] ? <a className="btn btn-default" href={this.state.SelectedProject["InfoURL"]} download disabled={this.state.SelectedProject["InfoURL"] === null}>Download</a>
                                            :
                                            <span>Not Available</span>
                                    }

                                </div>
                            </div>
                            {/* 
                            <div className="col-md-4">
                                <label>Sector</label>
                                <div className="form-group" >
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-paperclip " aria-hidden="true"></i>
                                        </span>
                                        <input className="form-control" disabled name="sector" ref="sector" placeholder="Sector" value={this.state.SelectedProject["Sector"]} autoComplete="off" />
                                    </div>
                                </div>
                            </div> */}

                            <div className="col-xs-12">
                                <label>Project Description</label>
                                <RichTextEditor className="readOnly no-border" readOnly={true} value={this.state.ProjectDescription} />
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 mbot20">
                        <label>Phases</label>
                        <div className="communication-block col-xs-12">
                            <table className="table phases-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "85px" }}>Completed</th>
                                        <th>Name</th>
                                        <th>Expected Duration(days)</th>
                                        <th>Expected Cost(₹)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.Phases.map((ele, i) => {
                                            var rows = [];
                                            var row1 = <tr key={ele + "" + i}>
                                                <td className="text-center"><input type="checkbox" value="completed" onChange={this.phaseCompleteChanged.bind(this, i)} /></td>
                                                <td><input type="text" className="form-control un-touched" disabled value={ele.Name} name="name" placeholder="Phase Name" /></td>
                                                <td className="col-xs-2 form-group"><input type="number" min={0} className="form-control un-touched" onChange={this.expectedDurationInDaysChange.bind(this, i)} value={ele.ExpectedDurationInDays} name="expectedDurationInDays" placeholder="Estimated Duration" autoComplete="off" /></td>
                                                <td className="col-xs-2 form-group"><input type="number" min={0} className="form-control un-touched" onChange={this.expectedCostInRupeesChange.bind(this, i)} value={ele.ExpectedCostInRupees} name="expectedCostInRupees" placeholder="Estimated Cost" autoComplete="off" /></td>
                                            </tr>
                                            var row2 = <tr><td></td><td colSpan={3}><textarea type="text" className="form-control un-touched" disabled value={ele.Description} name="description" placeholder="Description" ></textarea></td></tr>
                                            rows.push(row1);
                                            rows.push(row2);
                                            return rows;
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <label>Proposal Description
                              <a data-toggle="popover" data-trigger="hover" className="mleft5"
                                data-html="true" data-content={this.state.DescriptionHelp}>
                                <span className="fa fa-info-circle pointer" ></span>
                            </a>
                        </label>

                        <div className="form-group" style={{ height: "auto" }}>
                            <RichTextEditor name="proposalDescription" className="proposalDescriptionRTE" value={this.state.PropsalDescription} onChange={this.propsalDescriptionChange.bind(this)} />
                            <input className="form-control hidden" ref="proposalDescription" name="forErrorShowing" />
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <label>Proposal Justification
                              <a data-toggle="popover" data-trigger="hover" className="mleft5"
                                data-html="true" data-content={this.state.JustificatilHelp}>
                                <span className="fa fa-info-circle pointer" ></span>
                            </a>
                        </label>
                        <div className="form-group" style={{ height: "auto" }}>
                            <RichTextEditor name="proposalJustification" className="proposalJustificationRTE" value={this.state.ProposalJustification} onChange={this.proposalJustificationChange.bind(this)} />
                            <input className="form-control hidden" ref="proposalJustification" name="forErrorShowing" />
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-4">
                        <label>Detailed Estimate</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-paperclip" aria-hidden="true"></i>
                                </span>
                                <input type="file" className="form-control" name="detailedEstimate" ref="detailedEstimate" />
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-4">
                        <label>Other Documents</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-paperclip" aria-hidden="true"></i>
                                </span>
                                <input type="file" multiple className="form-control" name="otherDocuments" ref="otherDocuments" />
                            </div>
                        </div>
                    </div>


                    <div className="col-xs-12 text-center form-group">
                        <button type="submit" name="submit" className="btn btn-primary">Submit</button>
                        <div className="loader"></div>
                    </div>
                </form>
            </div >
        );
    }

    projectSectorChange(val) {
        this.setState({ ProjectSector: val });
        if (!val) {
            this.projectMasterChange(null);
            showErrorsForInput(this.refs.projectSector.wrapper, ["Please select a valid sector"]);
        }
        else {
            MyAjax(
                ApiUrl + "/api/Projects/GetAllProjectMasters?SectorId=" + val.value,
                (data) => { this.setState({ ProjectMasters: data["projectMasters"] }) },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            );
            showErrorsForInput(this.refs.projectSector.wrapper, null);
        }
    }

    projectMasterChange(val) {
        this.setState({ ProjectMaster: val });
        if (!val) {
            this.setState({ ProjectMasters: [], SelectedProject: {}, Phases: [], Scopes: [], ProposalScope: null });
            showErrorsForInput(this.refs.projectMaster.wrapper, ["Please select a valid project"]);
        }
        else {
            MyAjax(
                ApiUrl + "/api/Projects/GetMasterProjectDataForProposal?Id=" + val.value,
                (data) => {
                    this.setState({
                        SelectedProject: data["project"],
                        Phases: data["project"]["Phases"],
                        Scopes: data["project"]["Scopes"],
                        ProjectDescription: RichTextEditor.createValueFromString(data["project"]["Description"], 'html')
                    });
                },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            )
            showErrorsForInput(this.refs.projectMaster.wrapper, null);
        }
    }

    districtChange(val) {
        this.setState({ District: val, MandalMunicipality: null, PanchayatWard: null }, () => {
            if (this.state.District && this.state.District.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetMandalsMunicipalities?DistrictId=" + this.state.District.value,
                    (data) => { this.setState({ MandalsMunicipalities: data["mandalsMunicipalities"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                showErrorsForInput(this.refs.district.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.district.wrapper, ["Please select a valid district"]);
            }
        });
    }

    mandalMunicipalityChange(val) {
        this.setState({ MandalMunicipality: val, PanchayatWard: null }, () => {
            this.panchayatWardChange(null); //remove selected mandals and municipalities
            if (this.state.MandalMunicipality && this.state.MandalMunicipality.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetPanchayatsWards?MandalMunicipalityId=" + this.state.MandalMunicipality.value + "&PartnerType=",
                    (data) => { this.setState({ PanchayatsWards: data["panchayatsWards"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                showErrorsForInput(this.refs.mandalMunicipality.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a valid Mandal/Municipality"]);
            }
        });
    }

    panchayatWardChange(val) {
        this.setState({ PanchayatWard: val });
        if (val) {
            showErrorsForInput(this.refs.panchayatWard.wrapper, null);
        }
        else {
            showErrorsForInput(this.refs.panchayatWard.wrapper, ["Please select a valid Panchayat/Ward"]);
        }
    }
    
    beneficiariesTypeChange(val) {
        this.setState({ BeneficiariesType: val });
        if (val) {
            showErrorsForInput(this.refs.beneficiariesType.wrapper, []);
        }
        else {
            showErrorsForInput(this.refs.beneficiariesType.wrapper, ["Please select valid beneficiary type"]);
        }
    }

    phaseCompleteChanged(e, event) {
        if (this.state.Phases.length - 1 === e) {
            alert("Proposal cant be submitted for a completed project");
            event.target.checked = false;
            return;
        }
        var phases = this.state.Phases;
        phases[e]["Completed"] = event.target.checked;
        this.setState({ Phases: phases });
    }

    propsalDescriptionChange(val) {
        this.setState({ PropsalDescription: val, PropsalDescriptionHtml: val.toString('html') });
    }

    proposalJustificationChange(val) {
        this.setState({ ProposalJustification: val, ProposalJustificationHtml: val.toString('html') });
    }

    scopeChange(val) {
        this.setState({ ProposalScope: val });
        if (!val) {
            showErrorsForInput(this.refs.proposalScope.wrapper, ["Please select a valid scope"]);
        }
        else {
            showErrorsForInput(this.refs.proposalScope.wrapper, null);
        }
    }

    expectedDurationInDaysChange(e, ele) {
        var phases = this.state.Phases;
        phases[e]["ExpectedDurationInDays"] = ele.target.value;
        this.setState({ Phases: phases });
    }

    expectedCostInRupeesChange(e, ele) {
        var phases = this.state.Phases;
        phases[e]["ExpectedCostInRupees"] = ele.target.value;
        this.setState({ Phases: phases });
    }

    _handleSubmit(e) {
        e.preventDefault();
        toast.dismiss();

        $(e.target).find('.un-touched').map((i, ele) => {
            ele.classList.remove("un-touched");
        })

        if (!this.validate(e)) {
            return;
        }

        $(".loader").css("display", "inline-block");
        $("button[name='submit']").hide();

        var data = new FormData();
        data.append("ProjectId", this.state.ProjectMaster.value);
        data.append("ProposalName", this.refs.proposalName.value.trim());
        data.append("PanchayatWardId", this.state.PanchayatWard.value);
        data.append("Address", this.refs.address.value.trim());
        data.append("ScopeId", this.state.ProposalScope.value);
        if (this.state.ProposalScope.value === 0) {
            data.append("CustomScope", this.refs.customScope.value.trim());
        }
        data.append("PartnerContribution", this.refs.partnerContribution.value.trim());
        data.append("Beneficiaries", this.refs.beneficiaries.value.trim());
        data.append("BeneficiariesType", this.state.BeneficiariesType.value);
        data.append("Phases", JSON.stringify(this.state.Phases));
        data.append("ProposalDescription", this.state.PropsalDescriptionHtml);
        data.append("ProposalJustification", this.state.ProposalJustificationHtml);
        data.append("DetailedEstimate", this.refs.detailedEstimate.files[0]);
        for (var i = 0; i < this.refs.otherDocuments.files.length; i++) {
            data.append("OtherDocuments" + i, this.refs.otherDocuments.files[i]);
        }



        var url = ApiUrl + "api/Projects/AddNewProjectProposal";
        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Project propsal submitted successfully", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();

                    var roles = sessionStorage.getItem("smart_ap_roles");
                    if (roles.indexOf("Partner") !== -1) {
                        this.props.history.push("/partner-dashboard");
                    }
                    if (roles.indexOf("Admin") !== -1) {
                        this.props.history.push("/admin/project-proposals");
                    };

                    return true;
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

    validate(e) {

        var isSubmit = e.type === "submit";
        var success = true;
        var projectSector = this.state.ProjectSector;
        var projectMaster = this.state.ProjectMaster;
        var proposalName = this.refs.proposalName.value.trim();
        var district = this.state.District;
        var mandalMunicipality = this.state.MandalMunicipality;
        var panchayatWard = this.state.PanchayatWard;
        var address = this.refs.address.value.trim();
        var proposalScope = this.state.ProposalScope;
        var partnerContribution = this.refs.partnerContribution.value.trim();
        var beneficiaries = this.refs.beneficiaries.value.trim();
        var beneficiariesType = this.state.beneficiariesType;
        var detailedEstimateFile = this.refs.detailedEstimate.files;
        var otherDocuments = this.refs.otherDocuments.files;


        //project sector
        if (projectSector) {
            showErrorsForInput(this.refs.projectSector.wrapper, [])
        }
        else {
            if (isSubmit) {
                $(this.refs.projectSector.wrapper).find("input")[0].focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.projectSector.wrapper, ["Please select a valid sector"]);
            success = false;
        }


        //master project

        if (projectMaster) {
            showErrorsForInput(this.refs.projectMaster.wrapper, [])
        }
        else {
            if (isSubmit) {
                $(this.refs.projectMaster.wrapper).find("input")[0].focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.projectMaster.wrapper, ["Please select a valid project"]);
            success = false;
        }


        //proposal name

        if (validate.single(proposalName, { presence: true }) !== undefined) {
            if (isSubmit) {
                this.refs.proposalName.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.proposalName, ["Please enter a valid proposal name"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.proposalName, []);
        }


        //district

        if (district) {
            showErrorsForInput(this.refs.district.wrapper, [])
        }
        else {
            if (isSubmit) {
                $(this.refs.district.wrapper).find("input")[0].focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.district.wrapper, ["Please select a valid district"]);
            success = false;
        }

        //mandalMunicipality

        if (mandalMunicipality) {
            showErrorsForInput(this.refs.mandalMunicipality.wrapper, []);
        }
        else {
            if (isSubmit) {
                $(this.refs.mandalMunicipality.wrapper).find("input")[0].focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a valid mandal / municipality"]);
            success = false;
        }


        //panchayatWard

        if (panchayatWard) {
            showErrorsForInput(this.refs.panchayatWard.wrapper, [])
        }
        else {
            if (isSubmit) {
                $(this.refs.panchayatWard.wrapper).find("input")[0].focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.panchayatWard.wrapper, ["Please select a valid panchayat / ward"]);
            success = false;
        }


        //address

        if (validate.single(address, { presence: true }) !== undefined) {
            if (isSubmit) {
                this.refs.address.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.address, ["Please enter a valid address"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.address, []);
        }


        //scope

        if (proposalScope) {
            showErrorsForInput(this.refs.proposalScope.wrapper, []);
            if (proposalScope.value === 0) {
                //custom scope
                var customScope = this.refs.customScope.value.trim();
                if (validate.single(customScope, { presence: true }) !== undefined) {
                    if (isSubmit) {
                        this.refs.customScope.focus();
                        isSubmit = false;
                    }
                    showErrorsForInput(this.refs.customScope, ["Please enter a valid customScope"]);
                    success = false;
                }
                else {
                    showErrorsForInput(this.refs.customScope, []);
                }

            }
        }
        else {
            if (isSubmit) {
                $(this.refs.proposalScope.wrapper).find("input")[0].focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.proposalScope.wrapper, ["Please select a valid scope"]);
            success = false;
        }

        //partner contibution

        if (validate.single(partnerContribution, { presence: true }) !== undefined) {
            if (isSubmit) {
                this.refs.partnerContribution.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.partnerContribution, ["Please enter a valid partnerContribution"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.partnerContribution, []);
        }


        //Beneficiary

        if (validate.single(beneficiaries, { presence: true }) !== undefined) {
            if (isSubmit) {
                this.refs.beneficiaries.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.beneficiaries, ["Please enter beneficiaries"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.beneficiaries, []);
        }


        //BeneficiariesType

        if (beneficiariesType) {
            if (isSubmit) {
                $(this.refs.beneficiariesType).find("input")[0].focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.beneficiariesType.wrapper, ["Please select a beneficiaries type"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.beneficiariesType.wrapper, []);
        }

        //phases
        $(".phases-table").find(".form-control").map((i, ele) => {
            if ($(ele).attr("disabled")) {
                return;
            }
            var value = ele.value;
            if (validate.single(value.trim(), { presence: true }) !== undefined) {
                if (isSubmit) { ele.focus(); isSubmit = false; }
                showErrorsForInput(ele, ["Invalid " + ele.getAttribute("placeholder")]);
                success = false;
            }
            else {
                showErrorsForInput(ele, []);
            }
        })

        //proposal description

        if (!this.state.PropsalDescription.getEditorState().getCurrentContent().hasText() && !this.refs.proposalDescription.classList.contains("un-touched")) {
            if (isSubmit) { $(".proposalDescriptionRTE .public-DraftEditor-content").focus(); isSubmit = false; }
            $(".proposalDescriptionRTE").css({ border: "1pt solid #a94442" });
            showErrorsForInput(this.refs.proposalDescription, ["Please enter a description"]);
            success = false;
        }
        else {
            $(".proposalDescriptionRTE").css({ border: "1pt solid #ddd" })
            showErrorsForInput(this.refs.proposalDescription, []);
        }


        //proposal justification

        if (!this.state.ProposalJustification.getEditorState().getCurrentContent().hasText() && !this.refs.proposalJustification.classList.contains("un-touched")) {
            if (isSubmit) { $(".proposalJustificationRTE .public-DraftEditor-content").focus(); isSubmit = false; }
            $(".proposalJustificationRTE").css({ border: "1pt solid #a94442" });
            showErrorsForInput(this.refs.proposalJustification, ["Please enter a justification"]);
            success = false;
        }
        else {
            $(".proposalJustificationRTE").css({ border: "1pt solid #ddd" })
            showErrorsForInput(this.refs.proposalJustification, []);
        }


        //detailed estimate

        if (detailedEstimateFile.length === 1) {
            if ($.inArray(this.refs.detailedEstimate.value.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png", "gif", "doc", "docx", "pdf", "txt", "xls", "xlsx"]) === -1) {
                showErrorsForInput(this.refs.detailedEstimate, ["Supported formats : jpg | jpeg | png | gif | doc | docx | xls | xlsx | pdf | txt"]);
                success = false;
            }
            else {
                showErrorsForInput(this.refs.detailedEstimate, null);
            }
        }
        else {
            showErrorsForInput(this.refs.detailedEstimate, ["Please select a file"]);
            success = false;
        }


        //other documents

        if (otherDocuments.length > 0) {
            for (var i = 0; i < otherDocuments.length; i++) {
                if ($.inArray(otherDocuments[i].name.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png", "gif", "doc", "docx", "pdf", "txt", "xls", "xlsx"]) === -1) {
                    showErrorsForInput(this.refs.otherDocuments, ["Supported formats : jpg | jpeg | png | gif | doc | docx | xls | xlsx | pdf | txt"]);
                    success = false;
                    break;
                }
                else {
                    showErrorsForInput(this.refs.otherDocuments, []);
                }
            }

        }
        else {
            showErrorsForInput(this.refs.otherDocuments, []);
        }

        return success;
    }
}



export default ProjectProposal;


