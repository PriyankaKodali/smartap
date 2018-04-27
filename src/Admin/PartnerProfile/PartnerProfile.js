import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { MyAjax } from '../../MyAjax';
import { ApiUrl } from '../../Config'
import { showErrorsForInput, setUnTouched, ValidateForm } from '../../ValidateForm';
import './PartnerProfile.css'
import Select from 'react-select';

class PartnerProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Partner_Id: 0, Partner: {}, Countries: [], Country: null, States: [], State: null, Cities: [], IsOrg: false,
            City: null, Categories: [], Category: null, SubCategories: [], SubCategory: null, IsDataAvailable: false,
            LocalCountry: null, LocalStates: [], LocalState: null, LocalCities: [], LocalCity: null, IsNri: false
        };
    }

    componentWillMount() {
        this.setState({ Partner_Id: this.props.match.params["id"] });
        var url = ApiUrl + "/api/Partner/GetPartner?PartnerId=" + this.props.match.params["id"];
        MyAjax(
            url,
            (data) => {
                this.setState({
                    Partner: data["partner"], IsDataAvailable: true
                }, () => {
                    this.createObjectsForSelect();
                    // setUnTouched(document);/*because form loads after fetching data*/
                });
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );
        MyAjax(
            ApiUrl + "/api/MasterData/GetCountries",
            (data) => { this.setState({ Countries: data["countries"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
        MyAjax(
            ApiUrl + "/api/MasterData/GetCategoriesForIndividual",
            (data) => { this.setState({ Categories: data["categories"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )

    }

    createObjectsForSelect() {
        if (this.state.Partner["Country_Id"]) {
            this.countrySelected({ value: this.state.Partner["Country_Id"], label: this.state.Partner["Country"] });
            this.stateSelected({ value: this.state.Partner["State_Id"], label: this.state.Partner["State"] });
            this.citySelected({ value: this.state.Partner["City_Id"], label: this.state.Partner["City"] });
        }
        if (this.state.Partner["PartnerCategory_Id"]) {
            this.categorySelected({ value: this.state.Partner["PartnerCategory_Id"], label: this.state.Partner["PartnerCategory"] });
            this.subCategorySelected({ value: this.state.Partner["PartnerSubCategory_Id"], label: this.state.Partner["PartnerSubCategory"] });
            if (this.state.Partner["PartnerCategory_Id"] === 5) {
                this.setState({ IsNri: true });
                this.localCountrySelected({ value: this.state.Partner["LocalAddressCountry_Id"], label: this.state.Partner["LocalAddressCountry"] });
                this.localStateSelected({ value: this.state.Partner["LocalAddressState_Id"], label: this.state.Partner["LocalAddressState"] });
                this.localCitySelected({ value: this.state.Partner["LocalAddressCity_Id"], label: this.state.Partner["LocalAddressCity"] });
            }
            if (this.state.Partner["PartnerCategory_Id"] === 3) {
                this.setState({ IsOrg: true });
            }
        }
        setUnTouched(document);
    }

    componentDidMount() {
        setUnTouched(document);
    }

    render() {
        if (this.state.IsDataAvailable) {
            return (
                <div className="container profile-container">
                    <h1>Profile</h1>
                    <form onSubmit={this._handleSubmit.bind(this)} onChange={this.validate.bind(this)}>

                        {
                            this.state.IsOrg ?
                                <div className="col-md-6">
                                    <label>Organization Name</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-user" aria-hidden="true"></i>
                                            </span>
                                            <input className="form-control" name="firstName" ref="firstName" placeholder="First Name" autoComplete="off" defaultValue={this.state.Partner["FirstName"]} />
                                        </div>
                                    </div>
                                </div>
                                :
                                <div>
                                    <div className="col-md-3">
                                        <label>First Name</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" name="firstName" ref="firstName" placeholder="First Name" autoComplete="off" defaultValue={this.state.Partner["FirstName"]} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <label>Last Name</label>
                                        <div className="form-group" >
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" name="lastName" ref="lastName" placeholder="Last Name" autoComplete="off" defaultValue={this.state.Partner["LastName"]} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                        <div className="col-md-3">
                            <label>Category</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-users" aria-hidden="true"></i>
                                    </span>
                                    <Select className="category form-control" name="category" options={this.state.Categories} placeholder="Category" onChange={this.categorySelected.bind(this)} ref="category" value={this.state.Category} disabled={this.state.IsOrg} />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <label>Sub Category</label>
                            <div className="form-group" >
                                <div className="input-group">
                                    <span className="input-group-addon">
                                        <i className="fa fa-user" aria-hidden="true"></i>
                                    </span>
                                    <Select className="subCategory form-control" name="subCategory" options={this.state.SubCategories} placeholder="Sub Category" onChange={this.subCategorySelected.bind(this)} ref="subCategory" value={this.state.SubCategory} />
                                </div>
                            </div>
                        </div>

                        <div className="col-xs-12">
                            <label><h4>Communication Details</h4></label>
                            <div className="communication-block">
                                <div className="col-md-4">
                                    <label>Phone Number</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-phone" aria-hidden="true"></i>
                                            </span>
                                            <input className="form-control" type="text" placeholder="Phone Number" name="phoneNumber" autoComplete="off" defaultValue={this.state.Partner["PhoneNumber"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>Secondary Phone</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-phone" aria-hidden="true"></i>
                                            </span>
                                            <input className="form-control" type="text" placeholder="Secondary Phone" name="secondaryPhoneNumber" autoComplete="off" defaultValue={this.state.Partner["SecondaryPhoneNumber"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>Email</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-envelope" aria-hidden="true"></i>
                                            </span>
                                            <input className="form-control" type="text" placeholder="Email" name="email" autoComplete="off" defaultValue={this.state.Partner["Email"]} disabled />
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
                                            <input className="form-control" type="text" placeholder="Address" name="address" ref="address" autoComplete="off" defaultValue={this.state.Partner["Address"]} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>Country</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <Select className="country form-control" name="country" options={this.state.Countries} placeholder="Country" onChange={this.countrySelected.bind(this)} ref="country" value={this.state.Country} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>State</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <Select className="state form-control" name="state" options={this.state.States} placeholder="State" onChange={this.stateSelected.bind(this)} ref="state" value={this.state.State} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>District/City</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <Select className="city form-control" name="city" options={this.state.Cities} placeholder="City" onChange={this.citySelected.bind(this)} ref="city" value={this.state.City} />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <label>PIN/ZIP</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-map-marker" aria-hidden="true"></i>
                                            </span>
                                            <input className="form-control" type="text" placeholder="PIN/ZIP" name="pin" ref="pin" autoComplete="off" defaultValue={this.state.Partner["PIN"]} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            this.state.IsNri ?
                                <div className="col-xs-12">
                                    <label><h4>Origin Details</h4></label>
                                    <div className="communication-block">   {/*only for nris*/}
                                        <div className="col-md-8">
                                            <label>Address</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                    </span>
                                                    <input className="form-control" type="text" placeholder="Address" name="localAddress" ref="localAddress" autoComplete="off" defaultValue={this.state.Partner["LocalAddress"]} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label>Country</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="country form-control" name="localCountry" options={this.state.Countries} placeholder="Country" onChange={this.localCountrySelected.bind(this)} ref="localCountry" value={this.state.LocalCountry} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label>State</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="state form-control" name="localState" options={this.state.LocalStates} placeholder="State" onChange={this.localStateSelected.bind(this)} ref="localState" value={this.state.LocalState} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label>District/City</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="city form-control" name="localCity" options={this.state.LocalCities} placeholder="City" onChange={this.localCitySelected.bind(this)} ref="localCity" value={this.state.LocalCity} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                <div />
                        }

                        <div className="col-xs-12">
                            <label><h4>Partner Interests</h4></label>
                            <div className="partner-interests-container">
                                {
                                    this.state.Partner["PartnerInterests"].map((ele, i) => {
                                        return <div className="col-md-3" key={ele["Name"]}>
                                            <div className="checkbox-inline">
                                                <label><input type="checkbox" name={ele["Name"]} defaultChecked={ele["Checked"]} />{ele["Name"]}</label>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>



                        <div className="col-xs-12 col-sm-10 col-sm-offset-1 text-center form-group mtop24">
                            <button type="submit" name="submit" className="btn btn-primary">Submit</button>
                            <div className="loader"></div>
                        </div>

                    </form>
                </div>
            );

        }
        else {
            return (
                <div className="loader visible"></div>
            )
        }
    }

    countrySelected(val) {
        this.setState({ Country: val }, () => {
            if (this.state.Country && this.state.Country.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetStates?CountryId=" + this.state.Country.value,
                    (data) => { this.setState({ States: data["states"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                showErrorsForInput(this.refs.country.wrapper, null);
            }
            else {
                this.setState({ States: [], State: null });
                this.setState({ Cities: [], City: null });
                showErrorsForInput(this.refs.country.wrapper, ["Please select a valid country"]);
                showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            }
        });

    }

    stateSelected(val) {
        this.setState({ State: val }, () => {

            if (this.state.State && this.state.State.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetCities?StateId=" + this.state.State.value,
                    (data) => { this.setState({ Cities: data["cities"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )

                showErrorsForInput(this.refs.state.wrapper, null);
            }
            else {
                this.setState({ Cities: [], City: null });
                showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            }
        });
    }

    citySelected(val) {
        this.setState({ City: val }, () => {
            if (this.state.City && this.state.City.value) {
                showErrorsForInput(this.refs.city.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            }
        });
    }

    localCountrySelected(val) {
        this.setState({ LocalCountry: val }, () => {
            if (this.state.LocalCountry && this.state.LocalCountry.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetStates?CountryId=" + this.state.LocalCountry.value,
                    (data) => { this.setState({ LocalStates: data["states"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                showErrorsForInput(this.refs.localCountry.wrapper, null);
            }
            else {
                this.setState({ LocalStates: [], LocalState: null });
                this.setState({ LocalCities: [], LocalCity: null });
                showErrorsForInput(this.refs.localCountry.wrapper, ["Please select a valid country"]);
                showErrorsForInput(this.refs.localState.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.localCity.wrapper, ["Please select a valid city"]);
            }
        });

    }

    localStateSelected(val) {
        this.setState({ LocalState: val }, () => {

            if (this.state.LocalState && this.state.LocalState.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetCities?StateId=" + this.state.LocalState.value,
                    (data) => { this.setState({ LocalCities: data["cities"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )

                showErrorsForInput(this.refs.localState.wrapper, null);
            }
            else {
                this.setState({ LocalCities: [], LocalCity: null });
                showErrorsForInput(this.refs.localState.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.localCity.wrapper, ["Please select a valid city"]);
            }
        });
    }

    localCitySelected(val) {
        this.setState({ LocalCity: val }, () => {
            if (this.state.LocalCity && this.state.LocalCity.value) {
                showErrorsForInput(this.refs.localCity.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.localCity.wrapper, ["Please select a valid city"]);
            }
        });
    }

    categorySelected(val) {
        this.setState({ Category: val, SubCategory: null }, () => {
            if (this.state.Category && this.state.Category.value) {
                MyAjax(
                    ApiUrl + "/api/MasterData/GetSubCategories?CategoryId=" + this.state.Category.value,
                    (data) => { this.setState({ SubCategories: data["subCategories"] }) },
                    (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                if (val.value === 5) {
                    this.setState({ IsNri: true });
                }
                showErrorsForInput(this.refs.category.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.category.wrapper, ["Please select a valid category"]);
            }
        });
    }

    subCategorySelected(val) {
        this.setState({ SubCategory: val }, () => {
            if (this.state.SubCategory && this.state.SubCategory.value) {
                showErrorsForInput(this.refs.subCategory.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.subCategory.wrapper, ["Please select a valid subcategory"]);
            }
        });

    }

    _handleSubmit(e) {
        e.preventDefault();
        toast.dismiss();

        $(e.currentTarget.getElementsByClassName('form-control')).map((i, ele) => {
            ele.classList.remove("un-touched");
            return null;
        })

        if (!this.validate(e)) {
            return;
        }
        var inputs = $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
            if (el.closest(".form-group").classList.contains("hidden")) {
                return null;
            }
            else {
                return el;
            }
        });

        var data = {};
        inputs.map((i, e) => {
            data[e.name] = e.value;
            return null;
        });

        var partnerInterests = []
        $(".partner-interests-container").find("input").map((i, ele) => {
            if (ele.checked) {
                partnerInterests.push(ele.name);
            }
            return null;
        });

        data["City_Id"] = this.state.City.value;
        data["PartnerSubCategory_Id"] = this.state.SubCategory.value;
        data["CheckedPartnerInterests"] = partnerInterests;
        data["Id"] = this.state.Partner["Id"];
        if (this.state.IsOrg) {
            data["LastName"] = "";
        }

        if (this.state.IsNri) {
            data["LocalAddressCity_Id"] = this.state.LocalCity.value;
        }

        $(".loader").css("display", "inline-block");
        $("button[name='submit']").hide();

        var url = ApiUrl + "api/Partner/EditPartner";
        try {
            MyAjax(
                url,
                (data) => {
                    toast("Details updated succesfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".loader").hide();
                    $("button[name='submit']").show();
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
        var success = ValidateForm(e);

        if (!this.state.Category) {
            success = false;
            showErrorsForInput(this.refs.category.wrapper, ["Please select a valid category"]);
        }
        if (!this.state.SubCategory) {
            success = false;
            showErrorsForInput(this.refs.subCategory.wrapper, ["Please select a valid subcategory"]);
        }
        if (!this.state.Country) {
            success = false;
            showErrorsForInput(this.refs.country.wrapper, ["Please select a valid country"]);
        }
        if (!this.state.State) {
            success = false;
            showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
        }
        if (!this.state.City) {
            success = false;
            showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
        }
        if (this.state.Category.value === 5) {
            if (!this.state.LocalCountry) {
                success = false;
                showErrorsForInput(this.refs.localCountry.wrapper, ["Please select a valid country"]);
            }
            if (!this.state.LocalState) {
                success = false;
                showErrorsForInput(this.refs.localState.wrapper, ["Please select a valid state"]);
            }
            if (!this.state.LocalCity) {
                success = false;
                showErrorsForInput(this.refs.localCity.wrapper, ["Please select a valid city"]);
            }
        }

        return success;
    }

}

export { PartnerProfile };


