import React, { Component } from 'react';
import '../css/progress-wizard.min.css'
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import $ from 'jquery';
import { ValidateForm, showErrorsForInput, setUnTouched } from '../ValidateForm';
import { ApiUrl } from '../Config'
import { MyAjax } from '../MyAjax'
import { toast } from 'react-toastify';
import  Select  from 'react-select';


class Adoption extends Component {

    constructor(props) {
        super(props);
        var representative = this.props.adoption && this.props.adoption["PartnerRepresentative"] ? { value: this.props.adoption["PartnerRepresentativeId"], label: this.props.adoption["PartnerRepresentative"] } : null;
        this.state = {
            Adoption: this.props.adoption, Images: [], Partner: this.props.partner,
            ShowModal: false, Representatives: this.props.representatives, Representative: representative, Countries: [],
            country: null, States: [], state: null, Cities: [], city: null
        };

    }

    componentWillMount() {
        var images = [];
        this.state.Adoption["Activities"].forEach(ele => {
            ele["Attachments"].forEach(image => {
                images.push(
                    {
                        original: image["URL"],
                        thumbnail: image["URL"],
                        description: ele["Title"]
                    }
                );
            })
        });
        this.setState({ Images: images });

        if (this.state.Partner["PartnerCategory_Id"] === 3 || this.state.Partner["PartnerCategory_Id"] == 5) {

            // this.getRepresentatives();

            MyAjax(
                ApiUrl + "/api/MasterData/GetCountries",
                (data) => { this.setState({ Countries: data["countries"] }) },
                (error) => toast(error.responseText, {
                    type: toast.TYPE.ERROR
                })
            )
        }

    }

    componentWillReceiveProps(nextProps) {
        this.setState({ Representatives: nextProps.representatives, Adoption: nextProps.adoption });
    }

    render() {
        return (
            <div className="">
                {this.state.Adoption["Status_Id"] !== 5 ?

                    /*Code for pending adoption applications starts*/
                    <div className="panel panel-primary">
                        <div className="panel-heading" >
                            {this.state.Adoption["District"].toUpperCase()} <span className="fa fa-angle-right"></span> {this.state.Adoption["MandalMunicipality"].toUpperCase()} <span className="fa fa-angle-right"></span> {this.state.Adoption["PanchayatWard"].toUpperCase() + " (" + this.state.Adoption["Type"] + ")"}
                            <span className="pull-right">
                                {
                                    this.state.Adoption["PartnerRepresentative"] ? "Representative : " + this.state.Adoption["PartnerRepresentative"] : ""
                                }
                            </span>
                        </div>
                        <div className="panel-body " id={this.state.Adoption}>
                            <ul className="progress-indicator">
                                <li className={this.state.Adoption["Status_Id"] >= 1 ? "completed" : ""}> <span className="bubble"></span> Application Submitted </li>
                                <li className={this.state.Adoption["Status_Id"] >= 2 ? "completed" : ""}> <span className="bubble"></span> CPO Review </li>
                                <li className={this.state.Adoption["Status_Id"] >= 3 ? "completed" : ""}> <span className="bubble"></span> MPDO Review </li>
                                {this.state.Adoption["Status_Id"] <= 5 ? <li className={this.state.Adoption["Status_Id"] === 4 ? "completed" : ""}> <span className="bubble"></span> MPDO Approved </li> :
                                    this.state.Adoption["Status_Id"] === 6 ? <li className="danger"> <span className="bubble"></span> MPDO Reject </li> : <div />
                                }
                                {
                                    this.state.Adoption["Status_Id"] <= 5 ? <li className={this.state.Adoption["Status_Id"] === 5 ? "completed" : ""}> <span className="bubble"></span> Approved </li> :
                                        this.state.Adoption["Status_Id"] === 7 ? <li className="danger"> <span className="bubble"></span> CPO Reject </li> :
                                            this.state.Adoption["Status_Id"] === 8 ? <li className="danger"> <span className="bubble"></span> Terminated </li> :
                                                <div />
                                }
                            </ul>
                            {
                                this.state.Adoption["Status_Id"] > 5 ?
                                    <div className="alert alert-warning">Please <a className="link" href="/contact-us.html">Contact us </a> for more information. </div>
                                    :
                                    <div />
                            }

                        </div>
                    </div>

                    /*Code for pending adoption applications ends*/
                    :
                    /*Code for approved adoption applications starts*/
                    <div className="panel panel-primary">
                        <div className="panel-heading pointer" data-toggle="collapse" href={"#" + this.state.Adoption["Id"]}>
                            {this.state.Adoption["District"].toUpperCase()} <span className="fa fa-angle-right"></span> {this.state.Adoption["MandalMunicipality"].toUpperCase()} <span className="fa fa-angle-right"></span> {this.state.Adoption["PanchayatWard"].toUpperCase() + " (" + this.state.Adoption["Type"] + ")"}
                            <span className="pull-right"> <a> <span className="fa fa-angle-down cl-white mleft5 f18"></span> </a> </span>
                            <span className="pull-right">
                                {
                                    this.state.Adoption["PartnerRepresentative"] ? "Representative : " + this.state.Adoption["PartnerRepresentative"] : ""
                                }
                            </span>
                        </div>
                        <div id={this.state.Adoption["Id"]} className="panel-collapse collapse in">
                            <div className="panel-body">
                                <div className="col-sm-8 ">
                                    {this.state.Images.length > 0 ?
                                        <ImageGallery
                                            items={this.state.Images}
                                            slideInterval={2000}
                                            onImageLoad={this.handleImageLoad}
                                            showFullscreenButton={false}
                                            autoPlay={true} />
                                        :
                                        <div />
                                    }
                                </div>
                                <div className="col-sm-4">
                                    <div className="btn btn-success pull-right mleft10" onClick={() => this.props.history.push("/adoption/" + this.state.Adoption["Id"])}>Add Activity</div>
                                    {
                                        this.state.Partner["PartnerCategory_Id"] === 3 || this.state.Partner["PartnerCategory_Id"] == 5 ?
                                            this.state.Adoption["PartnerRepresentative"] ?
                                                <div className="btn btn-primary pull-right" data-toggle="modal" data-target={"#representativeModal" + this.state.Adoption["Id"]} title="Edit Representative">Edit Rep.</div>
                                                :
                                                <div className="btn btn-primary pull-right" data-toggle="modal" data-target={"#representativeModal" + this.state.Adoption["Id"]} title="Add Representative">Add Rep.</div>
                                            : ""
                                    }
                                    <br />
                                    <h3>CPO</h3>
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td title={this.state.Adoption["CPO"]}>{this.state.Adoption["CPO"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td title={this.state.Adoption["CPOEmail"]}>{this.state.Adoption["CPOEmail"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone</th>
                                                <td title={this.state.Adoption["CPOPhone"]}>{this.state.Adoption["CPOPhone"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h3>MPDO</h3>
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td title={this.state.Adoption["MPDO"]}>{this.state.Adoption["MPDO"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td title={this.state.Adoption["MPDOEmail"]}>{this.state.Adoption["MPDOEmail"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone</th>
                                                <td title={this.state.Adoption["MPDOPhone"]}>{this.state.Adoption["MPDOPhone"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <h3>Sarpanch</h3>
                                    <table className="table table-condensed table-bordered">
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td title={this.state.Adoption["Sarpanch"]}>{this.state.Adoption["Sarpanch"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td title={this.state.Adoption["SarpanchEmail"]}>{this.state.Adoption["SarpanchEmail"]}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone</th>
                                                <td title={this.state.Adoption["SarpanchPhone"]}>{this.state.Adoption["SarpanchPhone"]}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div id={"representativeModal" + this.state.Adoption["Id"]} className="modal fade" role="dialog">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        <h4 className="modal-title">
                                            {
                                                this.state.Adoption["PartnerRepresentative"] ? "Edit Representative" : "Add Representative"
                                            }
                                        </h4>
                                    </div>
                                    <div className="modal-body">
                                        {
                                            <div>
                                                <div className="col-xs-12"><label>Representative/Nominee for {this.state.Adoption["PanchayatWard"]}</label>
                                                    <div className="form-group" >
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-user" aria-hidden="true"></i>
                                                            </span>
                                                            <Select className="representative form-control" name={"representative" + this.state.Adoption["Id"]} options={this.state.Representatives} placeholder="Representative/Nominee" onChange={this.representativeSelected.bind(this)} ref="representative" value={this.state.Representative} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-center col-xs-12 mbot10" id="updateRepButtons">
                                                    <div className="btn btn-success" onClick={this.updateAdoptionRepresentative.bind(this)}>Add</div>
                                                    <div className="btn btn-info mleft10" data-toggle="modal" data-target={"#newRepresentativeModal" + this.state.Adoption["Id"]}>Not in list?</div>
                                                </div>
                                                <div className="loader loaderUpdateRep"></div>
                                            </div>
                                        }
                                    </div>
                                    <div className="clearfix"></div>
                                </div>

                            </div>
                        </div>


                        <div id={"newRepresentativeModal" + this.state.Adoption["Id"]} className="modal fade" role="dialog">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                                        <h4 className="modal-title">Add Representative/Nominee</h4>
                                    </div>
                                    <div className="modal-body">

                                        <form name="representativeForm" ref="representativeForm" onSubmit={this.handleRepresentativeFormSubmit.bind(this)} >
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
                        </div>

                    </div>
                    /*Code for approved adoption applications ends*/
                }
            </div>
        );
    }

    // getRepresentatives() {
    //     MyAjax(
    //         ApiUrl + "/api/MasterData/GetRepresentatives",
    //         (data) => { this.setState({ Representatives: data["representatives"] }); },
    //         (error) => toast(error.responseText, {
    //             type: toast.TYPE.ERROR
    //         }),
    //         "GET",
    //         null
    //     )
    // }

    representativeSelected(val) {
        this.setState({ Representative: val });
    }

    updateAdoptionRepresentative() {
        MyAjax(
            ApiUrl + "/api/Partner/UpdateRepresentativeToAdoption?AdoptionId=" + this.state.Adoption["Id"] + "&RepId=" + this.state.Representative.value,
            (data) => {
                $(".modal").modal("hide");
                toast("Represntative added successfully", {
                    type: toast.TYPE.SUCCESS
                });
                this.props.repUpdated();
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
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
            data["Adoption_Id"] = this.state.Adoption["Id"];

            var url = ApiUrl + "/api/Partner/AddPartnerRepresentativeAndUpdateAdoption";
            MyAjax(url,
                (result) => {
                    $("#newRepresentativeModal" + this.state.Adoption["Id"]).modal("toggle");
                    toast("Representative added sucessfully!", {
                        type: toast.TYPE.SUCCESS
                    });
                    $(".modal").modal("hide");
                    this.props.repUpdated();
                },
                (error) => {
                    $(".loaderRepresentative").hide();
                    $("button[name='submitRepresentative']").show();
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

export { Adoption };

