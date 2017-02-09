// User controller file
'use strict'

// Import models
var sharp = require('sharp');
var format = require('date-format');
var User = require('../models/user');

var self = this;

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

    // Make first letter of names capital
    newUser.forename = newUser.forename.charAt(0).toUpperCase() + newUser.forename.slice(1);
    newUser.surname = newUser.surname.charAt(0).toUpperCase() + newUser.surname.slice(1);

    newUser.createdDate = format('dd/MM/yyyy', new Date());

    var user = User(newUser);

    user.save(function(err, createdUser) {
        if(err) {
            callback(err.message);
            return;
        }

        callback(undefined, createdUser);

    });

};

controller.update = function update (userData, callback) {
        
    var query = { "_id" : userData._id };

    User.findOneAndUpdate(query, userData, {new: true}, function(err, user) {

        if(err) {
            callback(err);
            return;
        }

        // return the message
        callback(undefined, {success : true, message : "User Updated.", data : user});
    });
    
}

controller.getStats = function getStats (userId, callback) {

    var ObjectId= require('mongoose').Types.ObjectId;

    var System = require('../models/system');
    var Endpoint = require('../models/endpoint');
    var Widget = require('../models/widget');

    self.systemStats;
    self.endpointStats;
    self.widgetStats;

    var query = { "createdBy.id" : new ObjectId(userId)};

    var countPromises = [];

    countPromises.push(System.count(query, function(err, systemCount) {
        self.systemStats = systemCount;
    }));

    countPromises.push(Endpoint.count(query, function(err, endpointCount) {
        self.endpointStats = endpointCount;
    }));

    countPromises.push(Widget.count(query, function(err, widgetCount) {
        self.widgetStats = widgetCount;
    }));

    Promise.all(countPromises).then(function completedPromises () {
        callback(undefined, {system : self.systemStats, endpoint : self.endpointStats, widget : self.widgetStats });
    });
    
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
    User.findByIdAndUpdate(userId, { $set : { image : imageName } }, {new: true}, function(err, user) {

        if(err) {
            callback(err);
            return;
        }

        callback(undefined, user);

    });

}

module.exports = controller;