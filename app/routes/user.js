// API endpoints for Users
'use strict'

// Imports
var express = require('express');
var fileupload = require('express-fileupload');
var fs = require('fs');
var controller = require('../controllers/user');

// instance of an express router
var router = express.Router();

// Create user
router.route('/create').post(function(req, res) {

    console.log("Requested: POST - /api/user");

    // If there is a request body
    if(req._body) {

        // Store the user object 
        var user = req.body;

        // Call the controller function to create a new user
        controller.create(user, function(err, newUser) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // Return the result
                res.json({ success : true, message : "User created.", data : newUser});
            }

        });

    }

});

// User stats
router.route('/stats/:user_id').get(function(req, res) {

    // Store the user id
    var userId = req.params.user_id;

    console.log("Requested: GET - /api/user/stats/" + userId);

    // Call the controller's function to get a user's stats
    controller.getStats(userId, function(err, stats) {
        if(err) {
            // If there is an error thrown log the error
            console.log("Error: " + err);
            // Return an error to the user
            res.status(500).json({success:false, message: err});
            return;
        } else {
            // Return the results
            res.json({ success : true, stats : stats});
        }
    });
    
});

// Update User
router.route('/:userId').put(function(req, res) {

    // Store the user id
    var userId = req.params.user_id;

    console.log("Requested: GET - /api/user/" + userId);

    // Store the user details
    var user = req.body;

    // Call the controller's function to update a user
    controller.update(user, function(err, response) {

        if(err) {
            // If there is an error thrown log the error
            console.log("Error: " + err);
            // Return an error to the user
            res.status(500).json({success:false, message: err});
            return;
        } else {
            // Return the result
            res.json(response);
        }
    });         

});

// Upload Image
router.route('/image/:userId').put(function(req, res) {

    // Store the user id
    var userId = req.params.userId;

    console.log("Requested: PUT - /api/user/" + userId);

    // If no file is in the request
    if (!req.files) {
        // Log error
        console.log("Error: No files were uploaded.");
        // Return error to the user
        res.send({success:false, message : 'No files were uploaded.'});
        return;
    }
 
    // Store the image
    var image = req.files.file;

    // Call the controller's function to save an image
    controller.saveImage(userId, image, function(err, user) {

        if(err) {
            // If there is an error thrown log the error
            console.log("Error: " + err);
            // Return an error to the user
            res.status(500).json({success:false, message: err});
            return;
        } else {
            // Return the result
            res.json({success:true, message:"Image uploaded.", data:user});
        }
    });
    
});

// Get a unique user
router.route('/:username').get(function(req, res) {

    // Store the username
    var username = req.params.username;

    console.log("Requested: GET - /api/user/" + username);

    // If a username has been set
    if(username) {

        // Get user by the email passed
        controller.getByUsername(username, function(err, user) {
            if(err) { 
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // Return the user
                res.json(user);
            }
        });
    }
});

// Get a user image
router.route('/image/:userId').get(function(req, res) {

    // Store the user id
    var userId = req.params.userId;

    console.log("Requested: GET - /api/user/image/" + userId);

    // If the user id is set
    if(userId) {

        // Store the path to the image
        var imagePath = "public/userImages/" + userId + ".jpg";

        fs.readFile(imagePath, function(err, data) {
             // Fail if the file can't be read.
            if (err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // Write the headers 
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                
                // Send the file data to the user
                res.end(data);
            }
        });
    }
});

// Get a small user image
router.route('/image/small/:userId').get(function(req, res) {

    // Store the user id
    var userId = req.params.userId;

    console.log("Requested: GET - /api/user/image/small/" + userId);

    // If a user id is set
    if(userId) {

        // Create the path to the user profile image
        var imagePath = "public/userImages/resized/" + userId + ".jpg";

        // Read the image file
        fs.readFile(imagePath, function(err, data) {
             // Fail if the file can't be read.
            if (err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(404).json({success:false, message : err});
                return;
            } else {
                // Write the headers
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                
                // Send the file data to the user
                res.end(data);
            }
        });
    }
});

module.exports = router;