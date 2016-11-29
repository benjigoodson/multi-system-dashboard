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

// select port
var port = process.env.PORT || 3000;

// register routes
require('./app/routes')(app);

// connect to our Mongo database
console.log('Connecting to database...');
mongoose.connect(db.uri, db.options);

mongoose.Promise = global.Promise;

// location of web files
app.use(express.static('public'));

// start listening on the port, display message once complete
app.listen(port, function () {
  console.log('Server listening on port ' + port + '...');
});

// expose app
exports = module.exports = app;