// Using server.js as our main file

// Import modules
var express = require('express');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload');

//////////////// Database setup ////////////////

// database config values
var db = require('./app/config/db');

// connect to our Mongo database
console.log('Connecting to database...   ' + db.uri);

if(!db.uri) {
  console.warn("No database connection string set.");
}

mongoose.Promise = global.Promise;

mongoose.connect(db.uri);

//////////////// Application setup ////////////////

// select port and IP
var server_port = process.env.SERVICE_PORT || 3000;
var server_ip = process.env.SERVICE_IP || '127.0.0.1';

var app = express();

app.use(fileUpload());

// location of web files
app.use(express.static('public'));

// register routes
require('./app/routes')(app);

// Start listening on the server port 
app.listen(server_port, function () {
  console.log( "Listening on " + server_ip + ", port " + server_port )
});

// expose app
exports = module.exports = app;