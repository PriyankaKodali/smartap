import React, { Component } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { toast } from 'react-toastify';
import { MyAjax, MyAjaxForAttachments } from '../../MyAjax';
import { ApiUrl } from '../../Config'
import { showErrorsForInput } from '../../ValidateForm';
import RichTextEditor from 'react-rte';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from 'react-select';
var moment = require('moment');

var initialState = {};

class Emails extends Component {

    constructor(props) {
        super(props);
        var Groups = [
            { value: "1", label: "District Partners" },
            { value: "3", label: "District Officials" },
            { value: "4", label: "Mandal Partners" },
            { value: "6", label: "Mandal Officials" },
            { value: "7", label: "Municipality Partners" },
            { value: "9", label: "Municipality Officials" },
            { value: "10", label: "Panchayat Partners" },
            // {value:"1",label:"Panchayat Officails"},
            { value: "12", label: "Ward Partners" },
            // {value:"1",label:"Ward Officails"},
            { value: "14", label: "All Partners" },
            { value: "15", label: "All Members" },
            { value: "16", label: "All Members and Newsletters" },
            { value: "17", label: "All CPOs" },
            { value: "18", label: "All MPDOs" },
            { value: "19", label: "All Commissioners" },
            { value: "20", label: "All Officials" },
            { value: "21", label: "SAPF Employees" },
            { value: "22", label: "Everyone" }

        ]
        initialState = {
            Districts: [], Mandals: [], Municipalities: [], Panchayats: [], Wards: [],
            districts: [], mandals: [], municipalities: [], panchayats: [], wards: [],
            Groups: Groups, group: null, Message: EditorState.createEmpty(), MessageHtml: ""
        };
        this.state = initialState;
    }

    componentWillMount() {
    }

    getDistricts() {
        MyAjax(
            ApiUrl + "/api/MasterData/GetDistricts",
            (data) => { this.setState({ Districts: data["districts"] }) },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
    }

    getMandals(districtId) {
        MyAjax(
            ApiUrl + "/api/Email/GetMandals?DistrictId=" + districtId,
            (data) => {
                var mandals = this.state.Mandals;
                mandals = mandals.concat(data["mandals"]).sort((a, b) => a.label.localeCompare(b.label));
                this.setState({ Mandals: mandals });
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
    }

    removeMandals(districtId) {
        var mandals = this.state.Mandals;
        mandals = mandals.filter(x => x.DistrictId != districtId);
        this.setState({ Mandals: mandals });
    }

    getMunicipalities(districtId) {
        MyAjax(
            ApiUrl + "/api/Email/GetMunicipalities?DistrictId=" + districtId,
            (data) => {
                var municipalities = this.state.Municipalities;
                municipalities = municipalities.concat(data["municipalities"]).sort((a, b) => a.label.localeCompare(b.label));
                this.setState({ Municipalities: municipalities })
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
    }

    removeMunicipalities(districtId) {
        var municipalities = this.state.Municipalities;
        municipalities = municipalities.filter(x => x.DistrictId != districtId);
        this.setState({ Municipalities: municipalities });
    }

    getPanchayats(mandalId) {
        MyAjax(
            ApiUrl + "/api/Email/GetPanchayats?MandalId=" + mandalId,
            (data) => {
                var panchayats = this.state.Panchayats;
                panchayats = panchayats.concat(data["panchayats"]).sort((a, b) => a.label.localeCompare(b.label));
                this.setState({ Panchayats: panchayats })
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
    }

    removePanchayats(mandalId) {
        var panchayats = this.state.Panchayats;
        panchayats = panchayats.filter(x => x.MandalId != mandalId);
        this.setState({ Panchayats: panchayats });
    }

    getWards(municipalityId) {
        MyAjax(
            ApiUrl + "/api/Email/GetWards?MunicipalityId=" + municipalityId,
            (data) => {
                var wards = this.state.Wards;
                wards = wards.concat(data["wards"]).sort((a, b) => a.label.localeCompare(b.label));
                this.setState({ Wards: wards })
            },
            (error) => toast(error.responseText, {
                type: toast.TYPE.ERROR
            })
        )
    }

    removeWards(municipalityId) {
        var wards = this.state.Wards;
        wards = wards.filter(x => x.MunicipalityId != municipalityId);
        this.setState({ Wards: wards });
    }

    render() {
        return (
            <div className="col-xs-12">
                <h3>Emails</h3>
                <div className="col-xs-12">
                    <label>Select Group</label>
                    <div className="form-group" >
                        <div className="input-group">
                            <span className="input-group-addon">
                                <i className="fa fa-user" aria-hidden="true"></i>
                            </span>
                            <Select className="group form-control" name="group" options={this.state.Groups} placeholder="Group" onChange={this.groupChange.bind(this)} ref="group" value={this.state.group} />
                        </div>
                    </div>
                </div>
                {
                    this.state.group ?
                        this.state.group.value <= 13 ?
                            <div>
                                <div className="col-xs-12">
                                    <label>Select Districts</label>
                                    <div className="form-group" >
                                        <div className="input-group">
                                            <span className="input-group-addon">
                                                <i className="fa fa-user" aria-hidden="true"></i>
                                            </span>
                                            <Select className="districts form-control" name="districts" options={this.state.Districts} placeholder="Districts" onChange={this.districtsChange.bind(this)} ref="districts" value={this.state.districts} multi={true} />
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.state.group.value == 4 || this.state.group.value == 5 || this.state.group.value == 6 || this.state.group.value == 10 || this.state.group.value == 11 ?
                                        <div className="col-xs-12">
                                            <label>Select Mandals</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-user" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="mandals form-control" name="mandals" options={this.state.Mandals} placeholder="Mandals" onChange={this.mandalsChange.bind(this)} ref="mandals" value={this.state.mandals} multi={true} />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div />
                                }
                                {
                                    this.state.group.value == 10 || this.state.group.value == 11 ?
                                        <div className="col-xs-12">
                                            <label>Select Panchayats</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-user" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="panchayats form-control" name="panchayats" options={this.state.Panchayats} placeholder="Panchayats" onChange={this.panchayatsChange.bind(this)} ref="panchayats" value={this.state.panchayats} multi={true} />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div />
                                }
                                {
                                    this.state.group.value == 7 || this.state.group.value == 8 || this.state.group.value == 9 || this.state.group.value == 12 || this.state.group.value == 13 ?
                                        <div className="col-xs-12">
                                            <label>Select Municipalities</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-user" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="municipalities form-control" name="municipalities" options={this.state.Municipalities} placeholder="Municipalities" onChange={this.municipalitiesChange.bind(this)} ref="municipalities" value={this.state.municipalities} multi={true} />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div />
                                }
                                {
                                    this.state.group.value == 12 || this.state.group.value == 13 ?
                                        <div className="col-xs-12">
                                            <label>Select Wards</label>
                                            <div className="form-group" >
                                                <div className="input-group">
                                                    <span className="input-group-addon">
                                                        <i className="fa fa-user" aria-hidden="true"></i>
                                                    </span>
                                                    <Select className="wards form-control" name="wards" options={this.state.Wards} placeholder="Wards" onChange={this.wardsChange.bind(this)} ref="wards" value={this.state.wards} multi={true} />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div />
                                }
                            </div>
                            :
                            <div />
                        :
                        <div />
                }

                <section className="message" style={{ marginTop: "20px" }}>

                    <div className="col-xs-12">
                        <label>Subject</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-info" aria-hidden="true"></i>
                                </span>
                                <input type="text" className="form-control" name="subject" ref="subject" placeholder="Subject" />
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <label>Message</label>
                        <div className="form-group" style={{ height: "auto" }}>
                            <Editor name="message" id="message" key="message" ref="editor" toolbar={{ image: { uploadCallback: this.uploadCallback.bind(this) } }} editorState={this.state.Message} toolbarClassName="toolbarClassName" wrapperClassName="draft-editor-wrapper" editorClassName="draft-editor-inner" onEditorStateChange={this.messageBoxChange.bind(this)} />
                            <input hidden ref="message" name="forErrorShowing" />
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-7">
                        <label>Attachment</label>
                        <div className="form-group" >
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-paperclip" aria-hidden="true"></i>
                                </span>
                                <input type="file" multiple className="form-control" name="file" ref="file" />
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-1 col-xs-12 text-center">
                        <button type="button" name="submitEmail" className="btn btn-primary" onClick={this._handleEmailSubmit.bind(this)} value="Send" style={{ "marginTop": "23px" }} >Submit</button>
                        <div className="loader loaderEmail" style={{ marginTop: "28px" }}></div>
                    </div>
                </section>
            </div>


        );

    }

    uploadCallback(file) {
        var formData = new FormData();
        formData.append("file", file);

        var url = ApiUrl + "/api/Email/UploadImage"
        return new Promise(
            (resolve, reject) => {
                MyAjaxForAttachments(
                    url,
                    (data1) => {
                        resolve({ data: { link: data1["link"] } });
                    },
                    (error) => {
                        toast(error.responseText, {
                            type: toast.TYPE.ERROR
                        });
                        reject(error.responseText);
                    },
                    "POST", formData
                );
            });
    }

    groupChange(val) {
        if (val) {
            this.setState({ group: val });
            showErrorsForInput(this.refs.group.wrapper, []);
            this.setState({
                districts: [], mandals: [], municipalities: [], panchayats: [], wards: [],
                Mandals: [], Municipalities: [], Panchayats: [], Wards: []
            })
            if (val.value <= 13 && this.state.Districts.length == 0) {
                this.getDistricts();
            }
        }
        else {
            showErrorsForInput(this.refs.group.wrapper, ["Please select a valid group!"]);
        }
    }

    districtsChange(val) {
        var isDeletion = val.length < this.state.districts.length;
        var changedItem = isDeletion ?
            this.state.districts.filter(x => val.indexOf(x) == -1)
            : val.filter(x => this.state.districts.indexOf(x) == -1);
        if (!isDeletion) {
            if (this.state.group.value == 4 || this.state.group.value == 5 || this.state.group.value == 6 || this.state.group.value == 10 || this.state.group.value == 11) {
                this.getMandals(changedItem[0].value);
            }
            if (this.state.group.value == 7 || this.state.group.value == 8 || this.state.group.value == 9 || this.state.group.value == 12 || this.state.group.value == 13) {
                this.getMunicipalities(changedItem[0].value);
            }
        }
        if (isDeletion) {
            if (this.state.group.value == 4 || this.state.group.value == 5 || this.state.group.value == 6 || this.state.group.value == 10 || this.state.group.value == 11) {
                this.removeMandals(changedItem[0].value);
            }
            if (this.state.group.value == 7 || this.state.group.value == 8 || this.state.group.value == 9 || this.state.group.value == 12 || this.state.group.value == 13) {
                this.removeMunicipalities(changedItem[0].value);
            }
        }

        this.setState({ districts: val });
        if (val.length > 0) {
            showErrorsForInput(this.refs.districts.wrapper, []);
        }
        else {
            showErrorsForInput(this.refs.districts.wrapper, ["Please select a valid district!"]);
        }
    }

    mandalsChange(val) {
        var isDeletion = val.length < this.state.mandals.length;
        var changedItem = isDeletion ?
            this.state.mandals.filter(x => val.indexOf(x) == -1)
            : val.filter(x => this.state.mandals.indexOf(x) == -1);
        if (!isDeletion) {
            if (this.state.group.value == 10 || this.state.group.value == 11) {
                this.getPanchayats(changedItem[0].value);
            }
        }
        if (isDeletion) {
            if (this.state.group.value == 10 || this.state.group.value == 11) {
                this.removePanchayats(changedItem[0].value);
            }
        }

        this.setState({ mandals: val });
        if (val.length > 0) {
            showErrorsForInput(this.refs.mandals.wrapper, []);
        }
        else {
            showErrorsForInput(this.refs.mandals.wrapper, ["Please select a valid mandal!"]);
        }
    }

    municipalitiesChange(val) {
        var isDeletion = val.length < this.state.municipalities.length;
        var changedItem = isDeletion ?
            this.state.municipalities.filter(x => val.indexOf(x) == -1)
            : val.filter(x => this.state.municipalities.indexOf(x) == -1);
        if (!isDeletion) {
            if (this.state.group.value == 12 || this.state.group.value == 13) {
                this.getWards(changedItem[0].value);
            }
        }
        if (isDeletion) {
            if (this.state.group.value == 12 || this.state.group.value == 13) {
                this.removeWards(changedItem[0].value);
            }
        }

        this.setState({ municipalities: val });
        if (val.length > 0) {
            showErrorsForInput(this.refs.municipalities.wrapper, []);
        }
        else {
            showErrorsForInput(this.refs.municipalities.wrapper, ["Please select a valid municipality!"]);
        }
    }

    panchayatsChange(val) {
        this.setState({ panchayats: val });
    }

    wardsChange(val) {
        this.setState({ wards: val });
    }

    messageBoxChange(val) {
        this.setState({ Message: val, MessageHtml: draftToHtml(convertToRaw(val.getCurrentContent())) });
    }

    _handleEmailSubmit() {
        if (!this.validate()) {
            return;
        }
        $(".loaderEmail").show();
        $("button[name='submitEmail']").hide();

        var subject = this.refs.subject.value.trim();
        var message = this.state.MessageHtml;
        var files = this.refs.file.files;
        var group = this.state.group.value;
        var districts = this.state.districts.map((x) => { return x.value });
        var mandals = this.state.mandals.map((x) => { return x.value });
        var municipalities = this.state.municipalities.map((x) => { return x.value });
        var panchayats = this.state.panchayats.map((x) => { return x.value });
        var wards = this.state.wards.map((x) => { return x.value });

        var formData = new FormData();
        formData.append("subject", subject);
        formData.append("message", message);
        for (var i = 0; i < files.length; i++) {
            formData.append(files[i].name, files[i]);
        }

        formData.append("group", group);
        formData.append("districts", JSON.stringify(districts));
        formData.append("mandals", JSON.stringify(mandals));
        formData.append("municipalities", JSON.stringify(municipalities));
        formData.append("panchayats", JSON.stringify(panchayats));
        formData.append("wards", JSON.stringify(wards));

        var url = ApiUrl + "/api/Email/SendBulkEmails"

        MyAjaxForAttachments(
            url,
            (data) => {
                toast("Emails Sent Successfully!", {
                    type: toast.TYPE.SUCCESS
                });
                $(".loaderEmail").hide();
                $("button[name='submitEmail']").show();
                this.props.history.push("/admin/admin-dashboard");
            },
            (error) => {
                toast(error.responseText, {
                    type: toast.TYPE.ERROR
                });
                $(".loaderEmail").hide();
                $("button[name='submitEmail']").show();
            },
            "POST", formData
        );
    }

    validate() {
        var success = true;
        if (!this.state.group) {
            showErrorsForInput(this.refs.group.wrapper, ["Please select a valid group!"]);
            this.refs.group.wrapper.focus();
            success = false;
            return success;
        }
        if (this.state.group <= 13 && !this.state.districts) {
            showErrorsForInput(this.refs.districts.wrapper, ["Please select a valid district!"]);
            success = false;
        }
        if ((this.state.group.value == 4 || this.state.group.value == 5 || this.state.group.value == 6 || this.state.group.value == 10 || this.state.group.value == 11) && !this.state.mandals) {
            showErrorsForInput(this.refs.mandals.wrapper, ["Please select a valid mandal!"]);
            success = false;
        }
        if ((this.state.group.value == 7 || this.state.group.value == 8 || this.state.group.value == 9 || this.state.group.value == 12 || this.state.group.value == 13) && !this.state.municipalities) {
            showErrorsForInput(this.refs.municipalities.wrapper, ["Please select a valid municipality!"]);
            success = false;
        }
        if ((this.state.group.value == 10 || this.state.group.value == 11) && !this.state.panchayats) {
            showErrorsForInput(this.refs.panchayats.wrapper, ["Please select a valid panchayat!"]);
            success = false;
        }
        if ((this.state.group.value == 12 || this.state.group.value == 13) && !this.state.wards) {
            showErrorsForInput(this.refs.wards.wrapper, ["Please select a valid ward!"]);
            success = false;
        }

        var subject = this.refs.subject.value.trim();
        var message = this.state.MessageHtml;
        var file = this.refs.file.files;
        if (!subject) {
            showErrorsForInput(this.refs.subject, ["Please enter a valid subject!"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.subject, []);
        }

        if (!this.state.Message.getCurrentContent().hasText()) {
            showErrorsForInput(this.refs.message, ["Please enter a message"]);
            success = false;
        }
        else {
            showErrorsForInput(this.refs.message, []);
        }

        if (file.length === 1) {
            if ($.inArray(this.refs.file.value.split('.').pop().toLowerCase(), ["jpg", "jpeg", "png", "gif", "doc", "docx", "pdf", "txt"]) === -1) {
                showErrorsForInput(this.refs.file, ["Supported formats : jpg | jpeg | png | gif | doc | docx | pdf | txt"]);
                success = false;
            }
            showErrorsForInput(this.refs.file, []);
        }

        return success;

    }
}

export default Emails;


