import $ from 'jquery';


var isLoggedIn = () => {
    return sessionStorage.getItem("smart_ap_access_token") !== null;
}

var MyAjax = (url, success, error, type, data) => {

    if (!isLoggedIn) {
        this.props.history.push("/login");
    }

    $.ajax({
        url: url,
        success: success,
        error: error,
        type: type,
        data: data,
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("smart_ap_access_token") }
    })

};

var MyAjaxForAttachments = (url, success, error, type, data) => {

    if (!isLoggedIn) {
        this.props.history.push("/login");
    }

    return $.ajax({
        url: url,
        success: success,
        error: error,
        type: type,
        data: data,
        contentType: false,
        processData: false,
        headers: { "Authorization": "Bearer " + sessionStorage.getItem("smart_ap_access_token") }
    })

};

// var DownloadFile = (url) => {
//     $.ajax({
//         url: url,
//         headers: { "Authorization": "Bearer " + sessionStorage.getItem("smart_ap_access_token") },
//         method: 'GET'
//       }).then(function(data, status, xhr) {
//         console.log(data.Content.Headers);
//         console.log(data);
//         console.log(status);
//       });   
// }


export { MyAjax, MyAjaxForAttachments, isLoggedIn }