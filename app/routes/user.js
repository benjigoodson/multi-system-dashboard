// API endpoints for Users
'use strict'

// Imports
var express = require('express');
var fileupload = require('express-fileupload');
var fs = require('fs');
var controller = require('../controllers/user');
var User = require('../models/user');

// instance of an express router
var router = express.Router();

// Create user
router.route('/').post(function(req, res) {

    console.log("Requested: POST - /api/user");

    if(req._body) {

        var user = req.body;

        controller.create(user, function(err, newUser) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send(err);
                return;
            }

            res.json({ success : true, user : newUser});

        });

    }

});

// User stats
router.route('/stats/:user_id').get(function(req, res) {

    var userId = req.params.user_id;

    console.log("Requested: GET - /api/user/stats/" + userId);

    controller.getStats(userId, function(err, stats) {
        if(err) {
            console.log("Error: " + err);
            res.status(500).send(err);
            return;
        }

        res.json({ success : true, stats : stats});
    });
    
});

// Update User
router.route('/:userId').put(function(req, res) {

    var userId = req.params.user_id;

    console.log("Requested: GET - /api/user/" + userId);

    var user = req.body;

    controller.update(user, function(err, response) {

        if(err) {
            console.log("Error: " + err);
            res.status(500).send({success:false, message: err});
        }

        // return the message
        res.json(response);
    });         

});

// Upload Image
router.route('/image/:userId').put(function(req, res) {

    var userId = req.params.userId;

    console.log("Requested: PUT - /api/user/" + userId);

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
 
    var image = req.files.file;

    controller.saveImage(userId, image, function(err, user) {

        var result = {};

        if(err) {
            console.log("Error: " + err);
            result.success = false;
            result.error = err;
            res.status(500).send(result);
            return;
        }

        result.success = true;
        
        // return the message
        res.send(result);
    });
    
});

// Get a unique user
router.route('/:username').get(function(req, res) {

    var username = req.params.username;

    console.log("Requested: GET - /api/user/" + username);

    if(username) {

        // Get user by the email passed
        controller.getByUsername(username, function(err, user) {
            if(err) { 
                console.log("Error: " + err);
                res.status(500).send(err);
                return;
            }

            // return the user
            res.json(user);
        });
    }
});

// Get a user image
router.route('/image/:userId').get(function(req, res) {

    var userId = req.params.userId;

    console.log("Requested: GET - /api/user/image/" + userId);

    if(userId) {

        var imagePath = "public/userImages/" + userId + ".jpg";

       fs.readFile(imagePath, function(err, data) {
             // Fail if the file can't be read.
            if (err) {
                console.log("Error: " + err);
                res.status(500).send(err);
                return;
            }

            // Write the headers
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            
            // Send the file data to the user
            res.end(data);
        });
    }
});

// Get a small user image
router.route('/image/small/:userId').get(function(req, res) {

    var userId = req.params.userId;

    console.log("Requested: GET - /api/user/image/small/" + userId);

    if(userId) {

        var imagePath = "public/userImages/resized/" + userId + ".jpg";

       fs.readFile(imagePath, function(err, data) {
             // Fail if the file can't be read.
            if (err) {
                console.log("Error: " + err);
                res.status(404).send(err);
                return;
            }

            // Write the headers
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            
            // Send the file data to the user
            res.end(data);
        });
    }
});

module.exports = router;