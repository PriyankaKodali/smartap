import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { ApiUrl } from '../../Config';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import $ from 'jquery';
import { showErrorsForInput } from '../../ValidateForm';


// import { Link } from 'react-router-dom';

class HomePageImages extends Component {

    constructor(props) {
        super(props);

        this.state = {
            Images: [], IsDataAvailable: false, currentImage: null, editMode: false,
            tempImage: null, newFile: null, ModalType: "New", ModalImage: {}
        };
    }

    componentWillMount() {
        var url = ApiUrl + "/api/Images/GetSliderImages";
        MyAjax(
            url,
            (data) => this.setState({ Images: data["sliderImages"], currentImage: data["sliderImages"][0], IsDataAvailable: true }),
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            }),
            "GET",
            null
        );
    }


    componentWillUnmount() {
        $(".modal").modal("hide");
    }

    render() {
        return (
            this.state.IsDataAvailable ?
                <div className="col-xs-12" key={this.state.Images}>
                    <h2>Slider Images <span className="pull-right"> <button className="btn btn-default" onClick={this.addImage.bind(this)}>Add Image</button></span> </h2>
                    <hr />
                    <div className="text-center">
                        <h3>{this.state.currentImage.Name}</h3>
                        <img src={this.state.currentImage.Url} alt="" width="70%" />
                    </div>
                    <div className="mtop10">
                        <div className="btn btn-default pull-left" onClick={this.prevClick.bind(this)}><span className="fa fa-angle-left"></span> Prev.</div>
                        <div className="btn btn-default pull-right" onClick={this.nextClick.bind(this)}>Next <span className="fa fa-angle-right"></span></div>
                        <div className="text-center submit-buttons">
                            <div className="btn btn-default" onClick={() => { this.setState({ ModalImage: this.state.currentImage, ModalType: "Edit" }, () => { $("#imageModal").modal({ backdrop: 'static', keyboard: false }) }) }}> Edit</div>
                            <div className="btn btn-danger mleft10" onClick={this.removeClick.bind(this)}>Delete</div>
                            <div className="loader"></div>
                        </div>

                    </div>


                    <div id="imageModal" className="modal fade" role="dialog" ref="imageModal">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title" style={{ display: 'inline-block' }}>
                                        {
                                            this.state.ModalImage.Name ? this.state.ModalImage.Name : "New Image"
                                        }
                                    </h4>
                                    <hr />
                                    <div className="col-xs-12">
                                        {
                                            this.state.tempImage ?
                                                <div>
                                                    <img src={this.state.tempImage} width="100%" />
                                                    {
                                                        this.state.ModalType === "New" ?
                                                            <div className="form-group" >
                                                                <label>Position</label>
                                                                <div className="input-group">
                                                                    <span className="input-group-addon">
                                                                        <i className="fa fa-info" ></i>
                                                                    </span>
                                                                    <input type="number" className="form-control" ref="position" placeholder="Position" />
                                                                </div>
                                                            </div>
                                                            :
                                                            <div />
                                                    }
                                                    <div className="text-center mtop10 submit-buttons">
                                                        <div className="btn btn-success" onClick={this.saveClick.bind(this)}>Save</div>
                                                        <div className="btn btn-danger mleft10" onClick={this.cancelClick.bind(this)}>Cancel</div>
                                                        <div className="loader"></div>
                                                    </div>
                                                </div>
                                                :
                                                <div>
                                                    <div className="form-group" >
                                                        <div className="input-group">
                                                            <span className="input-group-addon">
                                                                <i className="fa fa-paperclip" aria-hidden="true"></i>
                                                            </span>
                                                            <input type="file" className="form-control" onChange={(e) => this.handleImageChange(e)} name="tempImage" ref="tempImage" />
                                                        </div>
                                                    </div>
                                                    <div className="btn btn-danger pull-right submit-buttons" onClick={this.cancelClick.bind(this)}>Cancel</div>
                                                </div>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                :
                <div className="loader visible"></div>
        );
    }

    prevClick() {
        var current = this.state.Images.indexOf(this.state.currentImage);
        current--;
        if (current === -1) {
            current = this.state.Images.length - 1;
        }
        this.setState({ currentImage: this.state.Images[current], editMode: false });
    }

    nextClick() {
        var current = this.state.Images.indexOf(this.state.currentImage);
        current++;
        if (current === this.state.Images.length) {
            current = 0;
        }
        this.setState({ currentImage: this.state.Images[current], editMode: false });
    }

    addImage() {
        this.setState({ ModalType: "New", currentImage: {} }, () => {
            $("#imageModal").modal("show");
        })
    }

    handleImageChange(e) {
        e.preventDefault();

        var reader = new FileReader();
        var file = e.target.files[0];

        if ($.inArray(file.name.split('.').pop().toLowerCase(), ["jpg", "jpeg"]) === -1) {
            showErrorsForInput(this.refs.tempImage, ["Supported formats : jpg | jpeg"]);
            return;
        }
        else {
            showErrorsForInput(this.refs.tempImage, null);
        }

        reader.onloadend = () => {
            this.setState({
                newFile: file,
                tempImage: reader.result
            });
        }

        reader.readAsDataURL(file)
    }

    saveClick() {

        var url = ApiUrl;
        var formData = new FormData();
        var currentImageIndex = 0;
        if (this.state.ModalType == "Edit") {
            if (!window.confirm("Do you wish to change the slider image?")) {
                return;
            }
            url += "/api/Images/ReplaceSliderImage";
            currentImageIndex = this.state.Images.indexOf(this.state.currentImage);
            formData.append("imageName", this.state.currentImage.Name);
            formData.append("newImage", this.state.newFile);

        }
        else {
            url += "/api/Images/AddNewSliderImage";
            formData.append("newImage", this.state.newFile);
            formData.append("position", this.refs.position.value);
        }
        $(".loader").show();
        $(".submit-buttons").hide();

        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Slider Images updated successfully", {
                    type: toast.TYPE.SUCCESS
                });
                $(".loader").hide();
                $(".submit-buttons").show();
                $("#imageModal").modal("hide");
                this.setState({
                    editMode: false, tempImage: null, newFile: null
                })
                this.setState({ Images: data["sliderImages"], currentImage: data["sliderImages"][currentImageIndex], IsDataAvailable: true });
                return true;
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".loader").hide();
                $(".submit-buttons").show();
                return false;
            },
            "POST",
            formData
        )
    }

    cancelClick() {
        $("#imageModal").modal("hide");
        this.setState({
            editMode: false, tempImage: null, newFile: null
        })
    }

    removeClick() {
        $(".loader").show();
        $(".submit-buttons").hide();
        var position = this.state.Images.indexOf(this.state.currentImage) + 1;
        var url = ApiUrl + "/api/Images/RemoveSliderImage?position=" + position;
        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Slider Images updated successfully", {
                    type: toast.TYPE.SUCCESS
                });
                $(".loader").hide();
                $(".submit-buttons").show();
                this.setState({ Images: data["sliderImages"], currentImage: data["sliderImages"][position], IsDataAvailable: true });
                return true;
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".loader").hide();
                $(".submit-buttons").show();
                return false;
            },
            "GET",
            null
        )
    }
}

export default HomePageImages;