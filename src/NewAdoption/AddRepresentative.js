import React, { Component } from 'react';
import $ from 'jquery';
import { toast } from 'react-toastify';
import { ValidateForm, showErrorsForInput, setUnTouched } from '../ValidateForm';
import { ApiUrl } from '../Config'
import { MyAjax } from '../MyAjax'
import  Select  from 'react-select';

class AddRepresentative extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        setUnTouched(document);

        MyAjax(
             ApiUrl + "/api/MasterData/GetCountries",
             (data) => { this.setState({ Countries: data["countries"] }) },
             (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
    }

    render() {
        return (

            <div id="myModal" className="modal fade" role="dialog">
                <div className="modal-dialog modal-lg">

                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Add Representative/Nominee</h4>
                        </div>
                        <div className="modal-body">

                            <form name="representativeForm" ref="representativeForm" onChange={this.validateForm.bind(this)} onSubmit={this.handleRepresentativeFormSubmit.bind(this)} >
                                <div className="col-sm-12">
                                    <div className="row">
                                        <div className="col-sm-6 form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" type="text" placeholder="Name" name="firstName" autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-envelope" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" type="text" placeholder="Email" name="email" autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-phone" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" type="text" placeholder="Phone Number" name="phoneNumber" autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-phone" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" type="text" placeholder="Secondary Phone Number" name="secondaryPhoneNumber" autoComplete="off" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 col-md-8 form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" type="text" placeholder="Address" name="address" autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                </span>
                                                <Select className="country form-control" name="country" options={this.state.Countries} placeholder="Country" onChange={this.countrySelected.bind(this)} ref="country" value={this.state.country} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                </span>
                                                <Select className="state form-control" name="state" options={this.state.States} placeholder="State" onChange={this.stateSelected.bind(this)} ref="state" value={this.state.state} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                </span>
                                                <Select className="city form-control" name="city" options={this.state.Cities} placeholder="City" onChange={this.citySelected.bind(this)} ref="city" value={this.state.city} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 form-group">
                                            <div className="input-group">
                                                <span className="input-group-addon">
                                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                                </span>
                                                <input className="form-control" type="text" placeholder="PIN/ZIP" name="pin" autoComplete="off" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-12 text-center">
                                            <button name="submitRepresentative" className="btn btn-primary">Submit</button>
                                            <div className="loader loaderRepresentative"></div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="clearfix"></div>
                        </div>
                    </div>

                </div>
            </div >

        );
    }

    countrySelected(val) {
        this.setState({ country: val }, () => {
            if (this.state.country && this.state.country.value) {
                MyAjax(
                     ApiUrl + "/api/MasterData/GetStates?CountryId=" + this.state.country.value,
                     (data) => { this.setState({ States: data["states"] }) },
                     (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )
                showErrorsForInput(this.refs.country.wrapper, null);
            }
            else {
                this.setState({ States: [], state: null });
                this.setState({ Cities: [], city: null });
                showErrorsForInput(this.refs.country.wrapper, ["Please select a valid country"]);
                showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            }
        });

    }

    stateSelected(val) {
        this.setState({ state: val }, () => {

            if (this.state.state && this.state.state.value) {
                MyAjax(
                     ApiUrl + "/api/MasterData/GetCities?StateId=" + this.state.state.value,
                     (data) => { this.setState({ Cities: data["cities"] }) },
                     (error) => toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    })
                )

                showErrorsForInput(this.refs.state.wrapper, null);
            }
            else {
                this.setState({ Cities: [], city: null });
                showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
                showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            }
        });
    }

    citySelected(val) {
        this.setState({ city: val }, () => {
            if (this.state.city && this.state.city.value) {
                showErrorsForInput(this.refs.city.wrapper, null);
            }
            else {
                showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
            }
        });
    }

    handleRepresentativeFormSubmit(e) {
        try {
            $(".loaderRepresentative").show();
            $("button[name='submitRepresentative']").hide();

            e.preventDefault();
            toast.dismiss();

            if (!this.validateForm(e)) {
                $(".loaderRepresentative").hide();
                $("button[name='submitRepresentative']").show();
                return;
            }

            //get only visible fields value
            var inputs = $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
                if (el.closest(".form-group").classList.contains("hidden")) {
                    return null;
                }
                else {
                    return el;
                }
            });

            var data = {};
            //create object with {inputName : inputValue}
            inputs.map((i, e) => {
                data[e.name] = e.value;
                return null;
            });
            data["City_Id"] = this.state.city.value;

            var url = ApiUrl + "/api/Partner/AddPartnerRepresentative";
            MyAjax(url,
                (result) => {
                    this.props.addComplete();
                    $("#myModal").modal("toggle");
                    toast("Representative added sucessfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                },
                (error) => {
                    $(".loaderRepresentative").hide();
                    $("button[name='submitRepresentative']").show();
                    this.setState({ error: error.responseText.replace(/\[|"|\]/g, '') });
                    toast(error.responseText, {
                        type: toast.TYPE.ERROR
                    });
                }, "POST", data)
        }
        catch (e) {
            toast("An error occoured, please try again!", {
                type: toast.TYPE.ERROR
            });
        }

    }

    validateForm(e) {

        var success = ValidateForm(e);

        if (!this.state.country || !this.state.country.value) {
            success = false;
            showErrorsForInput(this.refs.country.wrapper, ["Please select a valid country"]);
        }

        if (!this.state.state || !this.state.state.value) {
            success = false;
            showErrorsForInput(this.refs.state.wrapper, ["Please select a valid state"]);
        }

        if (!this.state.city || !this.state.city.value) {
            success = false;
            showErrorsForInput(this.refs.city.wrapper, ["Please select a valid city"]);
        }
        return success;
    }
}

export { AddRepresentative };

