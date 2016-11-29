// database config details

// Local host settings
var host = "127.0.0.1";
var port = "27017";
var database =  "dashboardapp";
var username = "";
var password = "";

var mongoURL = "mongodb://";

if (process.env.DATABASE_HOST) {

    // OpenShift
    var mongoUser = process.env.DATABASE_USER;
    var mongoPassword = process.env.DATABASE_PASSWORD;
    var mongoHost = process.env.DATABASE_HOST;
    var mongoPort = process.env.DATABASE_PORT;
    var mongoDatabase = process.env.DATABASE_COLLECTION;

    mongoURL += mongoUser + ':' + mongoPassword + '@';
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

} else {
    // On localhost
    mongoURL += host + ':' + port + '/' + database;
}

module.exports = {

    uri : mongoURL

};