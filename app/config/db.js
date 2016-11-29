// database config details

var host = "127.0.0.1";

var port = "27017";
var database =  "sampledb"; // "dashboardapp";
var username = "";
var password = "";

var mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL || "";

if (mongoURL == undefined && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURL = 'mongodb://';

    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }

    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}

module.exports = {

    uri : "mongodb://" + host + ":" + port + "/" + database,
    options : {
        user : username,
        password : password
    },
    url : mongoURL

};