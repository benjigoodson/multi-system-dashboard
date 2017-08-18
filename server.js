// Using server.js as our main file

// Import modules
var express = require('express');
var mongoose = require('mongoose');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');

//////////////// Database setup ////////////////

// Set the promises used by mongoose
mongoose.Promise = global.Promise;

// Database config values
var db = require('./app/config/db');

// Check email config is entered
if(!process.env.EMAIL_PASSWORD) {
  console.error("No EMAIL_PASSWORD argument set.");
  return;
}

// Connect to our Mongo database
console.log('Connecting to database...   ' + db.uri);

// If no database connection string is set
if(!db.uri) {
  // Display an error and end the application
  console.error("No database connection string set.");
  return;
}

// Connect to the database
mongoose.connect(db.uri);

//////////////// Application setup ////////////////

// Set port and ip, if arguments are passed to the application use those
var server_port = process.env.SERVICE_PORT || 3000;
var server_ip = process.env.SERVICE_IP || '127.0.0.1';

// Create an insatnce of an express application
var app = express();

// Create instance of the file upload library
app.use(fileUpload());

// Location of web files
app.use(express.static('public'));

app.use(favicon(path.normalize(__dirname + '/public/images/icon.png')));

// Register routes
require('./app/routes')(app);

// Ensure folder structure is correct
var dir = path.normalize(__dirname + "/public/userImages");

// If the directory doesn't exist
if(!fs.existsSync(dir)) {
  // Create the directory, give it 0744 permissions
  fs.mkdirSync(dir, 0744, function(err) {
    if (err) {
        // Something went wrong creating the folder
        console.log("Problem creating folder: " + dir); 
        console.log("Error : " + err);
    } else {
      // Successfully created folder
      console.log("Created folder: " + dir);
    }
  });
}

// Change the folder we want to check
dir = path.normalize(dir + "/resized");

// If the directory doesn't exist
if(!fs.existsSync(dir)) {  
  // Create the directory, give it 0744 permissions
  fs.mkdirSync(dir, 0744, function(err) {
    if (err) {
        // Something went wrong creating the folder
        console.log("Problem creating folder: " + dir); 
        console.log("Error : " + err);
    } else {
      // Successfully created folder
      console.log("Created folder: " + dir);
    }
  });
}

// Get local IP
var ip = require("ip");

// This library gets the local ip address of the machine
server_ip = ip.address();

// Start listening on the server port 
app.listen(server_port, function () {
  console.log("Listening on " + server_ip + ", port " + server_port )
});

// Expose app
exports = module.exports = app;
