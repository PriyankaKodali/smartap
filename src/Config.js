var ApiUrl = "";
var ReCapthaSiteKey = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    ApiUrl = "http://localhost:63069/";
    ReCapthaSiteKey = "6LdWwy8UAAAAAA8QQ7YA60kosj1lW_dclcEnxhSm";
} else {
    ApiUrl = "https://smart.ap.gov.in/api/"
    ReCapthaSiteKey = "6LfJGjIUAAAAAN8ZOwY5p9up-u7d2Hg7S54ys9jO";
}

var remote = (remoteFunction) => {
    remoteFunction.pagination = true;
    return remoteFunction;
}

export { ApiUrl, ReCapthaSiteKey, remote };
