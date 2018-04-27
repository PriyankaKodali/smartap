import React, { Component } from 'react';
import { ValidateForm, showErrorsForInput, setUnTouched } from '../ValidateForm';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ApiUrl } from '../Config';
import './NewAdoption.css'
import { MyAjax } from '../MyAjax'
import { AddRepresentative } from './AddRepresentative'
import { SubAdoption } from './SubAdoption'
import  Select  from 'react-select';
var moment = require('moment');

class NewAdoption extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Districts: [], MandalsMunicipalities: [], PanchayatsWards: [], district: null,
            mandalMunicipality: null, PartnerType: "", checkboxes: "", Countries: [], States: [],
            Cities: [], City_Id: null, Partner: {}, Categories: [], Subcategories: [], SubAdoptions: [],
            Representatives: [], SelectedPanchayatsWards: [], RepresentativeRequired: false, IsPartnerDataAvailable: false
        };
    }

    componentDidMount() {
        setUnTouched(document);

        MyAjax(
            ApiUrl + "/api/MasterData/GetDistricts",
            (data) => { this.setState({ Districts: data["districts"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )

        MyAjax(
            ApiUrl + "/api/Partner/GetPartner?PartnerId=",
            (data) => {
                this.setState({ Partner: data["partner"], IsPartnerDataAvailable: true }, () => {
                    if (this.state.Partner["City_Id"] === null) {
                        toast("Please complete your profile before proceeding", {
                            type: toast.TYPE.INFO
                        });
                        this.props.history.push("/partner-profile");
                    }
                    else {
                        if (this.state.Partner.PartnerSubCategory_Id === null) {
                            MyAjax(
                                ApiUrl + "/api/MasterData/GetCategoriesForIndividual",
                                (data) => {
                                    this.setState({ Categories: data["categories"] });
                                    $("#categoryModal").modal({ backdrop: 'static', keyboard: false })
                                    // $("#categoryModal").modal("toggle");
                                },
                                (error) => toast(error.responseText, {
                                    type: toast.TYPE.ERROR
                                })
                            )
                        }
                        else if (this.state.Partner.PartnerCategory_Id === 3 || this.state.Partner.PartnerCategory_Id === 5) {
                            this.setState({ RepresentativeRequired: true });
                        }
                    }
                });

            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )

        this.getRepresentatives();

    }

    componentWillUnmount() {
        $(".modal").modal("hide");
    }

    render() {
        return (
            <div className="adoption-main-container">
                <div className="container">

                    {
                        this.state.IsPartnerDataAvailable ?
                            <div className="partner-details-block">
                                <h4 className="col-xs-12">Personal Details</h4>
                                <div className="col-md-4">
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td title={this.state.Partner["FullName"]}>{this.state.Partner["FullName"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td title={this.state.Partner["Email"]}>{this.state.Partner["Email"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone</th>
                                                <td title={this.state.Partner["PhoneNumber"]}>{this.state.Partner["PhoneNumber"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4">
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Category</th>
                                                <td title={this.state.Partner["PartnerCategory"]}>{this.state.Partner["PartnerCategory"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Sub Category</th>
                                                <td title={this.state.Partner["PartnerSubCategory"]}>{this.state.Partner["PartnerSubCategory"]}</td>
                                            </tr>
                                            <tr>
                                                <th>DOB</th>
                                                <td title={moment(this.state.Partner["DOB"]).format("DD-MM-YYYY")}>{moment(this.state.Partner["DOB"]).format("DD-MM-YYYY")}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4">
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>City</th>
                                                <td title={this.state.Partner["City"]}>{this.state.Partner["City"]}</td>
                                            </tr>
                                            <tr>
                                                <th>State</th>
                                                <td title={this.state.Partner["State"]}>{this.state.Partner["State"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Country</th>
                                                <td title={this.state.Partner["Country"]}>{this.state.Partner["Country"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            :
                            <div className={"loader " + (this.state.IsAdoptionDataAvailable ? "" : "hidden")}></div>
                    }

                    <form name="adaptionForm">
                        <div className="col-xs-12">
                            <label>Please select a partner type</label>
                            <div className="flex partnerTypeSelector">
                                <div className="partnerInput col-xs-12 col-sm-6">
                                    <input id="generalPartner" hidden type="radio" name="partnerType" value="general" onChange={this.partnerTypeChange.bind(this)} />
                                    <label htmlFor="generalPartner">
                                        <i className="fa fa-check-square-o partnerTypeChecked" aria-hidden="true"></i>
                                        <div className="partnerTypeBlock text-center">
                                            <h3><b>General Partner</b></h3>
                                            <div className="">
                                                <div className="col-xs-12 col-md-5"><i className="fa fa-user" aria-hidden="true"></i></div>
                                                <div className="partnerTypeDescription col-xs-12 col-md-7">
                                                    <p>General Partner is a Person who is willing to develop a Gram Panchayat or Ward in all 20 development indicators of the Smart Village Smart Ward Towards Smart Andhra Pradesh Program.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </div>



                                <div className="partnerInput col-xs-12 col-sm-6">
                                    <input id="sectorPartner" hidden type="radio" name="partnerType" value="sector" onChange={this.partnerTypeChange.bind(this)} />
                                    <label htmlFor="sectorPartner">
                                        <i className="fa fa-check-square-o partnerTypeChecked" aria-hidden="true"></i>
                                        <div className="partnerTypeBlock text-center">
                                            <h3><b>Sector Partner</b></h3>
                                            <div className="col-xs-12 col-md-5"><i className="fa fa-users" aria-hidden="true"></i></div>
                                            <div className="partnerTypeDescription col-xs-12 col-md-7">
                                                <p>Sectoral Partners are usually Organizations who are willing to develop on one or more specific sectors of the 20 development indicators of the Smart Village Smart Ward Towards Smart Andhra Pradesh Program.</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>


                            </div>
                        </div>



                        {(function () {
                            if (this.state.PartnerType !== "") {

                                return (
                                    <div>
                                        <div className="col-xs-12">
                                            <label>District</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-user" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="district form-control" name="district" options={this.state.Districts} placeholder="District" onChange={this.districtChange.bind(this)} ref="district" value={this.state.district} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xs-12">
                                            <label> <span className="Rural">Mandal</span> / <span className="Urban"> Municipality</span> </label>
                                            <div className="form-group " >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-user" aria-hidden="true"></i>
                                                    </span>
                                                    <Select valueComponent={conf => {
                                                        const {
                                                            value,
                                                            children,
                                                            onRemove
                                        } = conf;
                                                        return <div className={"Select-value " + value.type}>
                                                            <span className="Select-value-icon" aria-hidden="true" onClick={() => { onRemove(value); this.setState({ SubAdoptions: this.state.SubAdoptions.filter((item) => item.value !== value.value) }) }}>x</span>
                                                            <span className="Select-value-label">
                                                                {children}
                                                            </span>
                                                        </div>
                                                    }}
                                                        optionRenderer={(option) => {
                                                            return <span className={"Select-menu-option " + option.type}>{option.label}</span>;
                                                        }}
                                                        backspaceRemoves={false} className="mandalMunicipality form-control un-touched" name="mandalMunicipality" options={this.state.MandalsMunicipalities} placeholder="Mandal/Municipality" ref="mandalMunicipality" onChange={this.mandalMunicipalityChange.bind(this)} value={this.state.mandalMunicipality} multi={true} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        }.bind(this))()}

                    </form>
                </div>
                <div className="container">
                    {
                        this.state.SubAdoptions.map((item) => {
                            return (<SubAdoption key={item.value} id={item.value}
                                mandalMunicipality={item} partnerType={this.state.PartnerType}
                                representatives={this.state.Representatives} selectedValues={this.state.SelectedPanchayatsWards}
                                panchayatWardChanged={this.panchayatWardChanged.bind(this)} representativeRequired={this.state.RepresentativeRequired} />)
                        })
                    }
                </div>

                {(function () {   //IIFE (Immediately Invoked Function Expression) (google it)
                    if (this.state.SelectedPanchayatsWards.length > 0) {
                        return (<div className="col=xs-12 text-center">
                            <button name="submitMain" className="btn btn-primary" onClick={this._handleSubmit.bind(this)}>Submit</button>
                            <div className="loader loaderSubmit"></div>
                        </div>);
                    }
                }.bind(this))()}

                <AddRepresentative addComplete={this.getRepresentatives.bind(this)} />

                <div id="categoryModal" className="modal fade" role="dialog" ref="categoryModal">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title" style={{ display: 'inline-block' }}>Select Profile Category</h4>
                                <span className="text-danger text-right m0"> (Please select a category before continuing!)</span>
                            </div>
                            <div className="modal-body">
                                <div className="col-sm-6 col-md-4 form-group">
                                    <label htmlFor="category">Category</label>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-users" aria-hidden="true"></i>
                                        </span>
                                        <Select className="category form-control" name="category" options={this.state.Categories} placeholder="Category" onChange={this.categorySelected.bind(this)} ref="category" value={this.state.category} />
                                    </div>
                                </div>

                                <div className="col-sm-6 col-md-4 form-group">
                                    <label htmlFor="subCategory">Sub Category</label>
                                    <div className="input-group">
                                        <span className="input-group-addon">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                        </span>
                                        <Select className="subCategory form-control" name="subCategory" options={this.state.SubCategories} placeholder="Subcategory" onChange={this.subCategorySelected.bind(this)} ref="subCategory" value={this.state.subCategory} />
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-4 text-center mtop24">
                                    <button name="submitCategory" className="btn btn-primary" onClick={this._handleCategorySubmit.bind(this)}>Submit</button>
                                    <div className="loader loaderCategory"></div>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getRepresentatives() {
        MyAjax(
            ApiUrl + "/api/MasterData/GetRepresentatives",
            (data) => { this.setState({ Representatives: data["representatives"] }); },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        )
    }

    panchayatWardChanged(value) {
        this.setState({ SelectedPanchayatsWards: value });
    }

    categorySelected(val) {
        this.setState({ category: val, subCategory: null }, () => {

            if (this.state.category && this.state.category.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetSubCategories?CategoryId=" + this.state.category.value,
                    (data) => { this.setState({ SubCategories: data["subCategories"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                showErrorsForInput(this.refs.category.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.category.wrapper, ["Please select a valid category"]);
            }
        });
    }

    subCategorySelected(val) {
        this.setState({ subCategory: val }, () => {
            if (this.state.subCategory && this.state.subCategory.value) {
                showErrorsForInput(this.refs.subCategory.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.subCategory.wrapper, ["Please select a valid subcategory"]);
            }
        });

    }

    partnerTypeChange(val) {
        this.setState({ PartnerType: val.target.value, district: null, mandalMunicipality: [], SubAdoptions: [] });
    }

    districtChange(val) {

        this.setState({ district: val, mandalMunicipality: [] }, () => {
            this.mandalMunicipalityChange([]); //remove selected mandals and municipalities
            if (this.state.district && this.state.district.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetMandalsMunicipalities?DistrictId=" + this.state.district.value,
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
        if (val.length === 0) {
            this.setState({ SubAdoptions: [] }, () => { showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a valid mandal/municipality"]); });
        }
        if ((!this.state.mandalMunicipality && val.length > 0) || this.state.mandalMunicipality.length < val.length) {
            this.setState({ mandalMunicipality: val }, () => {

                var newMandalMunicipality = this.state.mandalMunicipality[this.state.mandalMunicipality.length - 1];

                var subAdoptions = this.state.SubAdoptions;
                subAdoptions.push(newMandalMunicipality);
                this.setState({ SubAdoptions: subAdoptions });

                showErrorsForInput(this.refs.mandalMunicipality.wrapper, null);
            });
        }
        else {
            this.setState({ mandalMunicipality: val });
            if (val.length === 0) {
                showErrorsForInput(this.refs.mandalMunicipality.wrapper, ["Please select a valid mandal/municipality"]);
            }

        }
    }

    _handleSubmit(e) {

        e.preventDefault();
        toast.dismiss();
        $(".loaderSubmit").show();
        $("button[name='submitMain']").hide();

        var partnershipData = JSON.stringify(this.state.SelectedPanchayatsWards);

        var data = { PartnershipData: partnershipData };
        var url = ApiUrl + "/api/Partner/AddPartnerShip";

        MyAjax(url,
            (data) => {
                toast("The application is succesfully received!", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.history.push("/partner-dashboard");
            },
            (error) => {
                $(".loaderSubmit").hide();
                $("button[name='submitMain']").show();
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
            }, "POST", data)
    }

    _handleCategorySubmit() {
        $(".loaderCategory").css("display", "inline-block");
        $("button[name='submitCategory']").hide();

        showErrorsForInput(this.refs.category.wrapper, null);
        showErrorsForInput(this.refs.subCategory.wrapper, null);

        $("#categoryModal .form-control").removeClass("un-touched");

        var category = this.state.category;
        var subCategory = this.state.subCategory;
        if (!category) {
            $(".loaderCategory").hide();
            $("button[name='submitCategory']").show();
            showErrorsForInput(this.refs.category.wrapper, ["Please select a valid category"]);
            return;
        }
        if (!subCategory) {
            $(".loaderCategory").hide();
            $("button[name='submitCategory']").show();
            showErrorsForInput(this.refs.subCategory.wrapper, ["Please select a valid subcategory"]);
            return;
        }

        var data = { SubCategoryId: subCategory.value };

        var url = ApiUrl + "/api/Partner/AddCategory";
        MyAjax(url, (data) => {
            var partner = this.state.Partner;
            partner.PartnerCategory_Id = data["PartnerCategory_Id"];
            partner.PartnerSubCategory_Id = data["PartnerSubCategory_Id"];
            partner.SubCategoryType = data["SubCategoryType"];
            this.setState({ Partner: data["partner"] }, () => {
                if (partner.PartnerCategory_Id === 3 || partner.PartnerCategory_Id === 5) {
                    this.setState({ RepresentativeRequired: true });
                }
            });
            $("#categoryModal").modal("toggle");
        },
            (error) => {
                $(".loaderCategory").hide();
                $("button[name='submitCategory']").show();
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
            }, "POST", data)
    }

    validateForm(e) {
        return ValidateForm(e);
    }
}

export default NewAdoption;

