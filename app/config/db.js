// database config details
'use strict'

// Local host settings
var host = "127.0.0.1";
var port = "27017";
var database =  "dashboardapp";
var username = "";
var password = "";

var mongoURL = "mongodb://";

// If arguments are passed into the applciation when its ran
// This is used when deploying on a cloud server
if (process.env.DATABASE_HOST) {

    // Set the varibles based on these arguments
    var mongoUser = process.env.DATABASE_USER;
    var mongoPassword = process.env.DATABASE_PASSWORD;
    var mongoHost = process.env.DATABASE_HOST;
    var mongoPort = process.env.DATABASE_PORT;
    var mongoDatabase = process.env.DATABASE_COLLECTION;

    // Generate a url for mongo to use assigning the varibles passed in
    mongoURL += mongoUser + ':' + mongoPassword + '@';
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

} else {
    // On localhost
    mongoURL += host + ':' + port + '/' + database;
}

module.exports = {

    uri : mongoURL

};