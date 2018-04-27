import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import { ApiUrl } from '../../Config'
import { showErrorsForInput, setUnTouched } from '../../ValidateForm';
import './MasterProject.css'
import { validate } from 'validate.js';
import RichTextEditor from 'react-rte';
import  Select  from 'react-select';

class MasterProject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            MasterProjectId: null, ProjectSectors: [], ProjectSector: null, Scopes: [], Phases: [],
            Description: RichTextEditor.createEmptyValue(), DescriptionHtml: "", ProjectName: "", SopURL: "",
            InfoURL: "", IsDataAvailable: false
        };
    }

    componentWillMount() {
        this.setState({ MasterProjectId: this.props.match.params["id"] }, () => {

            if (this.state.MasterProjectId) {

                var url = ApiUrl + "/api/Projects/GetMasterProject?Id=" + this.state.MasterProjectId;
                MyAjax(
                    url,
                    (data) => {
                        this.setState({
                            ProjectName: data["project"]["Name"], SopURL: data["project"]["SopURL"], InfoURL: data["project"]["InfoURL"],
                            Description: RichTextEditor.createValueFromString(data["project"]["Description"], 'html'),
                            DescriptionHtml: data["project"]["Description"],
                            Scopes: data["project"]["Scopes"], Phases: data["project"]["Phases"],
                            ProjectSector: { value: data["project"]["Sector_Id"], label: data["project"]["Sector"] },
                            IsDataAvailable: true
                        })
                    },
                    (error) => {

                    },
                    "GET",
                    null
                )
            }
            else {
                var scopes = [{ Id: undefined, Description: "", Units: undefined, UnitType: "", Active: true }];
                var phases = [{ Id: undefined, Name: "", Description: "", ExpectedDurationInDays: undefined, ExpectedCostInRupees: undefined, Active: true }];

                this.setState({ Scopes: scopes, Phases: phases, IsDataAvailable: true })
            }

            MyAjax(
                ApiUrl + "/api/Projects/GetProjectSectors",
                (data) => { this.setState({ ProjectSectors: data["projectSectors"] }) },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            )
        })

    }

    componentDidMount() {
        setUnTouched(document);
    }

    render() {
        return (
            this.state.IsDataAvailable ?
                <div className="col-xs-12 master-project">
                    <h2>Master Project<span className="pull-right"> <button className="btn btn-default" onClick={() => { this.props.history.push("/admin/master-projects") }}>Back</button></span></h2>
                    <hr />
                    <form onSubmit={this._handleSubmit.bind(this)} onChange={this.validate.bind(this)}>
                        <div className="col-md-8">
                            <label>Name</label>
                            <div className="form-group" key={this.state.ProjectName}>
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-money" aria-hidden="true"></i>
                                    </span>
                                    <input className="form-control" name="projectName" ref="projectName" placeholder="Project Name" autoComplete="off" maxLength="80" defaultValue={this.state.ProjectName} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label>Sector</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                    </span>
                                    <Select className="sector form-control" name="sector" options={this.state.ProjectSectors} placeholder="Project Sector" onChange={this.projectSectorChange.bind(this)} ref="projectSector" value={this.state.ProjectSector} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <label>Description</label>
                            <div className="form-group" style={{ height: "auto" }}>
                                <RichTextEditor className="descriptionRTE" name="description" value={this.state.Description} onChange={(val) => { this.setState({ Description: val, DescriptionHtml: val.toString('html') }); this.refs.description.classList.remove("un-touched") }} />
                                <input hidden ref="description" className="form-control hidden" name="forErrorShowing" />
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <label>Scopes</label>
                            <div className="communication-block mbot10">
                                <table className="table scopes-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "30px" }}></th>
                                            <th>Description</th>
                                            <th>Units</th>
                                            <th>Units Type</th>
                                            <th style={{ width: "40px" }}><span className="text-success fa fa-plus btn btn-default" onClick={this.addScope.bind(this)}></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.Scopes.map((ele, i) => {
                                                return (<tr key={ele + "" + i}>
                                                    {/*diable checkbox if newly added element  */}
                                                    <td><input type="checkbox" value="active" defaultChecked={ele["Active"]} onChange={this.scopeActiveChanged.bind(this, i)} disabled={ele["Id"] === undefined} /></td>
                                                    <td className="form-group"><input type="text" className="form-control un-touched" onChange={this.descriptionChange.bind(this, i)} value={ele.Description} name="description" placeholder="Description" autoComplete="off" disabled={!ele["Active"]} /></td>
                                                    <td className="col-xs-2 form-group"><input type="number" className="form-control un-touched" onChange={this.unitsChange.bind(this, i)} value={ele.Units} name="units" placeholder="Units" autoComplete="off" disabled={!ele["Active"]} min={1} /></td>
                                                    <td className="col-xs-2 form-group"><input type="text" className="form-control un-touched" onChange={this.unitTypeChange.bind(this, i)} value={ele.UnitType} name="unitType" placeholder="Units Type" autoComplete="off" disabled={!ele["Active"]} /></td>
                                                    {/*Show remove button if newly added element  */}
                                                    <td style={{ width: "40px" }}><span className={"text-danger fa fa-times btn btn-danger " + (ele["Id"] === undefined ? "" : "hidden")} onClick={this.removeScope.bind(this, i)} disabled={!ele["Active"]}></span></td>
                                                </tr>);
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <label>Phases/Stage</label>
                            <div className="communication-block mbot10">
                                <table className="table phases-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "30px" }}></th>
                                            <th>Name</th>
                                            <th>Expected Duration(days)</th>
                                            <th>Expected Cost(₹)</th>
                                            <th style={{ width: "40px" }}><span className="text-success fa fa-plus btn btn-default" onClick={this.addPhase.bind(this)}></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.Phases.map((ele, i) => {
                                                var rows = [];
                                                var row1 = <tr key={ele + "" + i}>
                                                    {/*diable checkbox if newly added element  */}
                                                    <td><input type="checkbox" value="active" defaultChecked={ele["Active"]} onChange={this.phaseActiveChanged.bind(this, i)} disabled={ele["Id"] === undefined} /></td>
                                                    <td className="form-group"><input type="text" className="form-control un-touched" onChange={this.nameChange.bind(this, i)} value={ele.Name} name="name" placeholder="Phase Name" autoComplete="off" disabled={!ele["Active"]} /></td>
                                                    <td className="col-xs-2 form-group"><input type="number" min={1} className="form-control un-touched" onChange={this.expectedDurationInDaysChange.bind(this, i)} value={ele.ExpectedDurationInDays} name="expectedDurationInDays" placeholder="Duration" autoComplete="off" disabled={!ele["Active"]} /></td>
                                                    <td className="col-xs-2 form-group"><input type="number" min={1} className="form-control un-touched" onChange={this.expectedCostInRupeesChange.bind(this, i)} value={ele.ExpectedCostInRupees} name="expectedCostInRupees" placeholder="Cost" autoComplete="off" disabled={!ele["Active"]} /></td>
                                                    {/*Show remove button if newly added element  */}
                                                    <td style={{ width: "40px" }}><span className={"text-danger fa fa-times btn btn-danger " + (ele["Id"] === undefined ? "" : "hidden")} onClick={this.removePhase.bind(this, i)}></span></td>
                                                </tr>
                                                var row2 = <tr><td></td><td colSpan={3} className="form-group"><textarea rows={2} className="form-control un-touched col-xs-12" onChange={this.phaseDescriptionChange.bind(this, i)} value={ele.Description} name="description" placeholder="Description" disabled={!ele["Active"]}></textarea></td></tr>
                                                rows.push(row1);
                                                rows.push(row2);
                                                return rows;
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/*<div className="col-sm-4">
                        <label>Matching Grant % (Govt.)</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-paperclip " aria-hidden="true"></i>
                                </span>
                                <input className="form-control" type="number" name="matchingGrant" ref="matchingGrant" placeholder="Matching Grant" autoComplete="off" />
                            </div>
                        </div>
                    </div>*/}

                        <div className="col-sm-4">
                            <label>Standard Operation Procedure</label>
                            {
                                this.state.SopURL ?
                                    <div>
                                        <a className="btn btn-default" href={this.state.SopURL} download>Download</a>
                                        <span className="fa fa-times btn btn-danger btn-small mleft10" title="Remove SOP" onClick={this.removeSop.bind(this)}></span>
                                    </div>
                                    :
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-paperclip" aria-hidden="true"></i>
                                            </span>
                                            <input type="file" className="form-control" name="sop" ref="sop" />
                                        </div>
                                    </div>
                            }
                        </div>


                        <div className="col-sm-4">
                            <label>Information Material</label>
                            {
                                this.state.InfoURL ?
                                    <div>
                                        <a className="btn btn-default" href={this.state.InfoURL} download>Download</a>
                                        <span className="fa fa-times btn btn-danger btn-small mleft10" title="Remove Info material" onClick={this.removeInfo.bind(this)}></span>
                                    </div>
                                    :

                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-paperclip" aria-hidden="true"></i>
                                            </span>
                                            <input type="file" className="form-control" name="infoMaterial" ref="infoMaterial" />
                                        </div>
                                    </div>
                            }
                        </div>

                        <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center form-group">
                            <button type="submit" name="submit" className="btn btn-primary">Submit</button>
                            <div className="loader"></div>
                        </div>

                    </form>
                </div >
                :
                <div className="loader visible"></div>
        );
    }

    projectSectorChange(val) {
        this.setState({ ProjectSector: val });
        if (!val) {
            showErrorsForInput(this.refs.projectSector.wrapper, ["Please select a valid sector"]);
        }
        else {
            showErrorsForInput(this.refs.projectSector.wrapper, null);
        }
    }

    addScope() {
        var scopes = this.state.Scopes;
        scopes.push({ Id: undefined, Description: "", Units: undefined, UnitType: "", Active: true });
        this.setState({ Scopes: scopes });
    }

    removeScope(e, ele) {
        if (!window.confirm("Do you wish to remove the scope?")) {
            return;
        }
        var scopes = this.state.Scopes
        scopes.splice(e, 1);
        this.setState({ Scopes: scopes });
    }

    scopeActiveChanged(e, ele) {
        var scopes = this.state.Scopes;
        scopes[e]["Active"] = ele.target.checked;
        this.setState({ Scopes: scopes });
    }

    descriptionChange(e, ele) {
        var scopes = this.state.Scopes;
        scopes[e]["Description"] = ele.target.value;
        this.setState({ Scopes: scopes });
    }

    unitsChange(e, ele) {
        var scopes = this.state.Scopes;
        scopes[e]["Units"] = ele.target.value;
        this.setState({ Scopes: scopes });
    }

    unitTypeChange(e, ele) {
        var scopes = this.state.Scopes;
        scopes[e]["UnitType"] = ele.target.value;
        this.setState({ Scopes: scopes });
    }

    addPhase() {
        var phases = this.state.Phases;
        phases.push({ Id: undefined, Name: "", Description: "", ExpectedDurationInDays: undefined, ExpectedCostInRupees: undefined, Active: true });
        this.setState({ Phases: phases });
    }

    removePhase(e, ele) {
        if (!window.confirm("Do you wish to remove the phase?")) {
            return;
        }
        var phases = this.state.Phases;
        phases.splice(e, 1);
        this.setState({ Phases: phases });
    }

    phaseActiveChanged(e, ele) {
        var phases = this.state.Phases;
        phases[e]["Active"] = ele.target.checked;
        this.setState({ Phases: phases });
    }

    phaseDescriptionChange(e, ele) {
        var phases = this.state.Phases;
        phases[e]["Description"] = ele.target.value;
        this.setState({ Phases: phases });
    }

    nameChange(e, ele) {
        var phases = this.state.Phases;
        phases[e]["Name"] = ele.target.value;
        this.setState({ Phases: phases });
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

    removeSop() {
        if (!window.confirm("Do you wish to remove SOP?")) {
            return;
        }
        this.setState({ SopURL: "" });
    }

    removeInfo() {
        if (!window.confirm("Do you wish to remove Info Material?")) {
            return;
        }
        this.setState({ InfoURL: "" });
    }

    _handleSubmit(e) {
        e.preventDefault();
        toast.dismiss();

        $(".loader").css("display", "inline-block");
        $("button[name='submit']").hide();

        $(e.target).find('.un-touched').map((i, ele) => {
            ele.classList.remove("un-touched");
            return null;
        })

        if (!this.validate(e)) {
            $(".loader").hide();
            $("button[name='submit']").show();
            return;
        }

        var data = new FormData();
        data.append("Id", this.state.MasterProjectId);
        data.append("Name", this.refs.projectName.value.trim());
        data.append("SectorId", this.state.ProjectSector.value);
        data.append("Description", this.state.DescriptionHtml);
        // data.append("MatchingGrant", this.refs.matchingGrant.value);
        data.append("Scopes", JSON.stringify(this.state.Scopes));
        data.append("Phases", JSON.stringify(this.state.Phases));
        data.append("SOPUrl", this.state.SopURL);
        data.append("InfoMaterialUrl", this.state.InfoURL);
        if (this.refs.sop !== undefined)
            data.append("SOP", this.refs.sop.files[0]);
        if (this.refs.infoMaterial !== undefined)
            data.append("InfoMaterial", this.refs.infoMaterial.files[0]);

        var url = ApiUrl;
        if (this.state.MasterProjectId) {
            url += "/api/Projects/EditMasterProject";
        }
        else {
            url += "/api/Projects/AddNewMasterProject";
        }
        try {
            MyAjaxForAttachments(
                url,
                (data) => {
                    toast("Master Project added successfully", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
                    this.props.history.push("/admin/master-projects")
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
        var projectName = this.refs.projectName.value.trim();
        var projectSector = this.state.ProjectSector;

        // Project Name
        if (validate.single(projectName, { presence: true }) !== undefined) {
            if (isSubmit) {
                this.refs.projectName.focus();
                isSubmit = false;
            }
            showErrorsForInput(this.refs.projectName, ["Please enter a valid project name"]);
            success = false;
        }
        else if (validate.single(projectName, { length: { maximum: 80 } }) !== undefined) {
            if (isSubmit) { this.refs.projectName.focus(); isSubmit = false; }
            showErrorsForInput(this.refs.projectName, ["Project name is too long!!"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.projectName, []);
        }


        // Project Sector
        if (!projectSector) {
            if (isSubmit) { $(this.refs.projectSector.wrapper).find("input")[0].focus(); isSubmit = false; }
            showErrorsForInput(this.refs.projectSector.wrapper, ["Please select a valid project sector"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.projectSector.wrapper, []);
        }


        //Description
        if (!this.state.Description.getEditorState().getCurrentContent().hasText() && !this.refs.description.classList.contains("un-touched")) {
            if (isSubmit) { $(".descriptionRTE .public-DraftEditor-content").focus(); isSubmit = false; }
            $(".descriptionRTE").css({ border: "1pt solid #a94442" });
            showErrorsForInput(this.refs.description, ["Please enter a description"]);
            success = false;
        }
        else {
            $(".descriptionRTE").css({ border: "1pt solid #ddd" })
            showErrorsForInput(this.refs.description, []);
        }


        //scopes
        $(".scopes-table").find(".form-control").map((i, ele) => {

            var value = ele.value.trim();

            if (validate.single(value, { presence: true }) !== undefined) {
                if (isSubmit) { ele.focus(); isSubmit = false; }
                showErrorsForInput(ele, ["Invalid " + ele.getAttribute("placeholder")]);
                success = false;
            }
            else {
                showErrorsForInput(ele, []);
            }
            return null;
        });

        //phases
        $(".phases-table").find(".form-control").map((i, ele) => {
            var value = ele.value;
            if (validate.single(value.trim(), { presence: true }) !== undefined) {
                if (isSubmit) { ele.focus(); isSubmit = false; }
                showErrorsForInput(ele, ["Invalid " + ele.getAttribute("placeholder")]);
                success = false;
            }
            else {
                showErrorsForInput(ele, []);
            }
            return null;
        })

        //sop
        if (!this.state.SopURL) {
            if (this.refs.sop.files.length === 1) {
                if ($.inArray(this.refs.sop.value.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png", "gif", "doc", "docx", "pdf", "txt"]) === -1) {
                    showErrorsForInput(this.refs.sop, ["Supported formats : jpg | jpeg | png | gif | doc | docx | pdf | txt"]);
                    success = false;
                }
                else {
                    showErrorsForInput(this.refs.sop, null);
                }
            }
            // else {
            //     showErrorsForInput(this.refs.sop, ["Please select a file"]);
            //     success = false;
            // }
        }


        //info material
        if (!this.state.InfoURL) {
            if (this.refs.infoMaterial.files.length === 1) {
                if ($.inArray(this.refs.infoMaterial.value.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png", "gif", "doc", "docx", "pdf", "txt"]) === -1) {
                    showErrorsForInput(this.refs.infoMaterial, ["Supported formats : jpg | jpeg | png | gif | doc | docx | pdf | txt"]);
                    success = false;
                }
                else {
                    showErrorsForInput(this.refs.infoMaterial, null);
                }
            }
            // else {
            //     showErrorsForInput(this.refs.infoMaterial, ["Please select a file"]);
            //     success = false;
            // }
        }

        return success;

    }
}

export default MasterProject;



