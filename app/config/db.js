// database config details

var host = "127.0.0.1";
var port = "27017";
var database = "dashboardapp";
var username = "";
var password = "";

module.exports = {

    uri : "mongodb://" + host + ":" + port + "/" + database,
    options : {
    }

};