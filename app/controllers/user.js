// User controller file
'use strict'

// Import models
var User = require('../models/user');
var sharp = require('sharp');

var controller = {};
    
controller.getByUsername = function getByUsername (username, callback) {

    User.find({email : username}).lean().exec().then(function userFind (user) {
        callback(undefined, user);
    })
    .catch(function errorHandler (error) {
        callback(error);
    })

}

controller.create = function create (newUser, callback) {

    var user = User(newUser);

    // Make first letter of names capital
    user.forename = user.forename.charAt(0).toUpperCase() + user.forename.slice(1);
    user.surname = user.surname.charAt(0).toUpperCase() + user.surname.slice(1);

    user.createdDate = new Date();

    user.save(function(err, createdUser) {
        if(err) {
            callback(err);
        }

        callback(undefined, createdUser);

    });

};

controller.update = function update (userData, callback) {
        
    var query = { "_id" : userData._id };

    User.findOneAndUpdate(query, userData, {new: true}, function(err, user) {

        if(err) {
            console.log("Error: " + err);
            callback(err);
        }

        // return the message
        callback(undefined, {success : true, message : "User Updated.", data : user});
    });
    
}

controller.getStats = function getStats (userId, callback) {

    var System = require('../models/system');
    var Endpoint = require('../models/endpoint');
    var Widget = require('../models/widget');

    var systemStats = 0;
    var endpointStats = 0;
    var widgetStats = 0;

    System.count({createdBy : userId}, function(err, systemCount) {
        systemStats = systemCount;
    });

    Endpoint.count({createdBy : userId}, function(err, endpointCount) {
        endpointStats = endpointCount;
    });

    Widget.count({createdBy : userId}, function(err, widgetCount) {
        widgetStats = widgetCount;
    });

    callback(undefined, {system : systemStats, endpoint : endpointStats, widget : widgetStats });

}

controller.saveImage = function saveImage (userId, userImage, callback) {

    // Rename image
    var imageName = userId;

    // Save image
    userImage.mv('public/userImages/' + userId + '.jpg', function(err) {
        if (err) {
            callback(err);
            return;
        }

        // Use sharp to resize image to 128 x 128
        sharp('public/userImages/' + userId + '.jpg')
            .resize(128, 128)
            .toFile('public/userImages/resized/' + userId + '.jpg', function(err) {
                if(err) {
                    callback(err);
                    return;
                }
        });
    });

    // Update user with new image name
    User.findByIdAndUpdate(userId, { $set : { image : imageName } }, function(err, user) {

        if(err) {
            callback(err);
        }

        callback(undefined, user);

    });

}

module.exports = controller;