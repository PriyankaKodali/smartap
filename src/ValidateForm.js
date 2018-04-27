import { validate } from 'validate.js'
import $ from 'jquery';
import moment from 'moment';


validate.extend(validate.validators.datetime, {
    // The value is guaranteed not to be null or undefined but otherwise it
    // could be anything.
    parse: function (value, options) {

        return +moment.utc(new Date(value));
    },
    // Input is a unix timestamp
    format: function (value, options) {
        var format = options.dateOnly ? "YYdd-mm-yy" : "YYdd-mm-yy hh:mm:ss";
        return moment.utc(new Date(value)).format(format);
    }
});

var constraints = {
    email: {
        presence: true,
        email: true
    },

    password: {
        presence: true,
        length: { minimum: 6 }
    },

    confirmPassword: {
        presence: true,
        equality: "password"
    },

    name: {
        presence: true,
        format: {
            pattern: "[a-zA-Z ]+",
            flags: "i",
            message: "can only contain alphabets"
        },
        length: {
            minimum: 2,
            tooShort: "is too short",
        }
    },

    firstName: {
        presence: true,
        format: {
            pattern: "[a-zA-Z ]+",
            flags: "i",
            message: "can only contain alphabets"
        },
        length: {
            minimum: 2,
            tooShort: "is too short",
        }
    },

    lastName: {
        presence: true,
        format: {
            pattern: "[a-zA-Z ]+",
            flags: "i",
            message: "can only contain alphabets"
        },
        length: {
            minimum: 2,
            tooShort: "is too short",
        }
    },


    organizationName: {
        presence: true,
        length: {
            minimum: 2,
            tooShort: "is too short",
        }
    },

    phoneNumber: {
        presence: true,
        format: {
            pattern: /^^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
            flags: "g",
            message: "is not valid"
        },
        exclusion: {
            within: [
                "0000000000", "00000000000", "000000000000", "0000000000000",
                "1111111111", "11111111111", "111111111111", "1111111111111",
                "2222222222", "22222222222", "222222222222", "2222222222222",
                "3333333333", "33333333333", "333333333333", "3333333333333",
                "4444444444", "44444444444", "444444444444", "4444444444444",
                "5555555555", "55555555555", "555555555555", "5555555555555",
                "6666666666", "66666666666", "666666666666", "6666666666666",
                "7777777777", "77777777777", "777777777777", "777777777777",
                "8888888888", "88888888888", "888888888888", "8888888888888",
                "9999999999", "99999999999", "999999999999", "9999999999999",
            ],
            message: "is not valid"
        }
    },
    secondaryPhoneNumber: {
        format: {
            pattern: /^^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?|^$\s*$/,
            flags: "g",
            message: "is not valid"
        },
        exclusion: {
            within: [
                "0000000000", "00000000000", "000000000000", "0000000000000",
                "1111111111", "11111111111", "111111111111", "1111111111111",
                "2222222222", "22222222222", "222222222222", "2222222222222",
                "3333333333", "33333333333", "333333333333", "3333333333333",
                "4444444444", "44444444444", "444444444444", "4444444444444",
                "5555555555", "55555555555", "555555555555", "5555555555555",
                "6666666666", "66666666666", "666666666666", "6666666666666",
                "7777777777", "77777777777", "777777777777", "777777777777",
                "8888888888", "88888888888", "888888888888", "8888888888888",
                "9999999999", "99999999999", "999999999999", "9999999999999",
            ],
            message: "is not valid"
        }
    },
    address: {
        presence: true
    },
    localAddress: {
        presence: true
    },

    pin: {
        presence: true,
        length: { maximum: 10 }
    },
    startDate: {
        presence: true
    },
    pan: {
        format: {
            pattern: "([A-Za-z]{5}[0-9]{4}[A-Za-z]{1})?",
            flags: "i",
            message: "is not valid"
        }
    },
    aadhar: {
        format: {
            pattern: "([0-9]{12})?",
            flags: "i",
            message: "is not valid"
        }
    }

};




//----------------validation messages-----------------//

validate.validators.presence.message = "is required";





//-------------validation functions------------------//

var removePreviousErrors = (input) => {
    var formGroup = input.closest(".form-group");
    formGroup.classList.remove("has-error");
    formGroup.classList.remove("has-success");
    var k = $(formGroup.getElementsByClassName('help-block'));
    k.map((i, e) => {
        e.parentNode.removeChild(e);
        return null;
    })
    return;
}


var showErrorsForInput = (input, errors) => {
    // This is the root of the input
    if (input.classList.contains("un-touched")) {
        return;
    }
    removePreviousErrors(input);
    var formGroup = input.closest(".form-group");
    // If we have errors
    if (errors) {
        // we first mark the group has having errors
        // then we append all the errors
        if (errors.length > 0) {
            formGroup.classList.add("has-error");
            var block = document.createElement("p");
            block.classList.add("help-block");
            block.classList.add("error");
            block.innerHTML = errors[0];
            $(formGroup).append(block);
        }
    } else {
        // otherwise we simply mark it as success
        formGroup.classList.add("has-success");
    }
    return;
}


var showErrors = (inputs, errors) => {
    // We loop through all the inputs and show the errors for that input

    inputs.map((i, input) => {
        showErrorsForInput(input, errors && errors[input.name]);
        return null;
    });
    return;
}


var ValidateForm = (e) => {
    var inputs = $(e.currentTarget.getElementsByClassName('form-control')).map((i, el) => {
        if (el.closest(".form-group").classList.contains("hidden") || el.getAttribute("disabled")  !== null) {
            return null;
        }
        else {
            return el;
        }
    });

    //remove un-touched class for all elements when form submitted
    if (e.type === "submit") {
        inputs.map((i, e) => {
            e.classList.remove("un-touched");
            return null;
        });
    }

    var data = {};
    //create object with {inputName : input value}
    inputs.map((i, e) => {
        data[e.name] = e.value;
        return null;
    });

    var errors = validate(data, constraints);


    showErrors(inputs, errors);

    //set focus to first element with error when form submit
    var BreakException = {};

    try {
        //e.type used because focus should be set on when submit fired
        if (errors && e.type === "submit") {
            inputs.map((i, e) => {
                if (errors && errors[e.name]) {
                    e.focus();
                    throw BreakException;  //used to exit map function ref : http://stackoverflow.com/a/2641374
                }
                return null;
            })
        }
    }
    catch (e) {
        if (e !== BreakException) throw e;
    }

    try {
        if (errors) {
            Object.keys(data).forEach((ele) => {
                if (Object.keys(errors).indexOf(ele) > -1) {
                    throw BreakException;
                }
            });
        }
    }
    catch (e) {
        return false;
    }
    return true;
}


var setUnTouched = (doc) => {
    $(doc.getElementsByClassName('form-control')).map((i, e) => {
        e.classList.add("un-touched");
        e.removeEventListener('focusin', () => { });
        e.addEventListener("focusin", () => {
            e.classList.remove("un-touched");
        })

        return null;
    });

    var k = $(doc.getElementsByClassName('help-block'));
    k.map((i, e) => {
        e.parentNode.removeChild(e);
        return null;
    })

    var l = $(doc.getElementsByClassName('has-error'));
    l.map((i, e) => {
        e.classList.remove("has-error");
        return null;
    })

    var m = $(doc.getElementsByClassName('has-success'));
    m.map((i, e) => {
        e.classList.remove("has-success");
        return null;
    })
}







export { ValidateForm, showErrorsForInput, setUnTouched, showErrors, removePreviousErrors };