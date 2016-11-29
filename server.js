// Using server.js as our main file

// Import modules
var express = require('express');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload');

var app = express();

// Setup config
app.use(fileUpload());

// database config values
var db = require('./app/config/db');

// register routes
require('./app/routes')(app);

// connect to our Mongo database
console.log('Connecting to database...   ' + db.uri);

if(!db.uri) {
  console.warn("No database connection string set.");
}

mongoose.connect(db.uri);

mongoose.Promise = global.Promise;

// location of web files
app.use(express.static('public'));

// Select port and IP
var server_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000;
var server_ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
 
app.listen(server_port, server_ip, function () {
  console.log( "Listening on " + server_ip + ", port " + server_port )
});

// LOCAL SETTINGS
// var server_port = process.env.PORT || 3000;

// start listening on the port, display message once complete
// app.listen(server_port, server_ip_address, function () {
  // console.log('Server listening on port ' + port + '...');
// });

// expose app
exports = module.exports = app;