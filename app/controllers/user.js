// User controller file
'use strict'

// Import models
var scrupt = require("scrypt");
var sharp = require('sharp');
var format = require('date-format');
var User = require('../models/user');

var self = this;

var controller = {};
    
controller.getByUsername = function getByUsername (username, callback) {

    // Database query for finding a user that matches the entered email
    User.find({email : username}).lean().exec().then(function userFind (user) {
        // Return the user to the callback function
        callback(undefined, user);
        return;
    })
    .catch(function errorHandler (error) {
        // Catch any errors, return error to the calling function
        console.log("Error: " + error);
        callback(error);
    })

}

controller.create = function create (newUser, callback) {

    // Make first letter of names capital
    newUser.forename = newUser.forename.charAt(0).toUpperCase() + newUser.forename.slice(1);
    newUser.surname = newUser.surname.charAt(0).toUpperCase() + newUser.surname.slice(1);

    // Make email lowercase
    newUser.email = newUser.email.toLowerCase();

    // Set the created date
    newUser.createdDate = format('dd/MM/yyyy', new Date());

    // Get crypto libary
    var scrypt = require('scrypt');

    // Set up memory params
    var cryptParams = scrypt.paramsSync(0.1);

    // Hash user password
    var hash = scrypt.kdfSync(newUser.password, cryptParams);

    // Convert the ash to a base64 string
    newUser.password = hash.toString("base64");

    // Create a new user matching the User Schema
    var user = User(newUser);

    // Database query for creating a new user
    user.save(function(err, createdUser) {
        
        // If an error occurs, return it to the callback function
        if(err) {
            callback(err.message);
            return;
        }

        // Return the created user to the callback function
        callback(undefined, createdUser);

    });

};

controller.update = function update (userData, callback) {
    
    // Create a query for matching a user to a user id
    var query = { "_id" : userData._id };

    // Database query for updating a user
    User.findOneAndUpdate(query, userData, {new: true}, function(err, user) {

        // If an error occurs, return it to the callback function
        if(err) {
            callback(err);
            return;
        }

        // return the result
        callback(undefined, {success : true, message : "User Updated.", data : user});
    });
    
}

controller.getStats = function getStats (userId, callback) {

    // Import database services for each entity
    var ObjectId= require('mongoose').Types.ObjectId;

    var System = require('../models/system');
    var Endpoint = require('../models/endpoint');
    var Widget = require('../models/widget');

    // Create blank varibles
    self.systemStats;
    self.endpointStats;
    self.widgetStats;

    // Create a query that matches the user id
    var query = { "createdBy.id" : new ObjectId(userId)};

    var countPromises = [];

    // Count systems that match the query
    // Add the promise to the array
    countPromises.push(System.count(query, function(err, systemCount) {
        self.systemStats = systemCount;
    }));

    // Count systems that match the query   
    // Add the promise to the array
    countPromises.push(Endpoint.count(query, function(err, endpointCount) {
        self.endpointStats = endpointCount;
    }));

    // Count systems that match the query
    // Add the promise to the array
    countPromises.push(Widget.count(query, function(err, widgetCount) {
        self.widgetStats = widgetCount;
    }));

    // Once all promises have been completed
    Promise.all(countPromises).then(function completedPromises () {
        // Return the results to the callback function
        callback(undefined, {system : self.systemStats, endpoint : self.endpointStats, widget : self.widgetStats });
    });
    
}

controller.saveImage = function saveImage (userId, userImage, callback) {

    // Rename image
    var imageName = userId;

    // Save image to a file
    userImage.mv('public/userImages/' + userId + '.jpg', function(err) {

        // If an error occurs, return it to the callback function
        if (err) {
            callback(err);
            return;
        }

        // Use sharp to resize image to 128 x 128 in the resized folder
        sharp('public/userImages/' + userId + '.jpg')
            .resize(128, 128)
            .toFile('public/userImages/resized/' + userId + '.jpg', function(err) {

                // If an error occurs, return it to the callback function
                if(err) {
                    callback(err);
                    return;
                }

                // Update user with new image name
                User.findByIdAndUpdate(userId, { $set : { image : imageName } }, {new: true}, function(err, user) {

                    // If an error occurs, return it to the callback function
                    if(err) {
                        callback(err);
                        return;
                    }

                    callback(undefined, user);

                });
        });
    });

}

module.exports = controller;