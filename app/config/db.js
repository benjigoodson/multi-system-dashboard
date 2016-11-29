// database config details

var host = "172.30.25.87";
var port = "27017";
var database =  "sampledb"; // "dashboardapp";
var username = "userA3F";
var password = "Mcsv3q0yWuIDuUmX";

module.exports = {

    uri : "mongodb://" + host + ":" + port + "/" + database,
    options : {
        user : username,
        password : password
    }

};