// API endpoints for Athuentication
'use strict'

// Imports
var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var _ = require('underscore');

// Get config
var apiConfig = require('../config/api');

module.exports = function (app) {

    // Array of routes that don't require the user to be authenticated to use them 
    var unsecured_routes = ["/libs/", "/api/authenticate", "/api/user/image/small/", "/api/user/create", 
        "/api/user/image", "/api/user/forgot"];

    // Use this route for every request
    app.use(function(req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

        // Headers to allow
        res.setHeader('Access-Control-Allow-Headers', '*, authorisation');

        // Allow senidng of cookies for sessions etc
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Go to the next route
        next();

    });

    // Use this route for every request
    app.use(function(req, res, next) {
        console.log("Authorising at middleware");

        // Loops through the array and returns all matching unsecured_routes
        // If the fucntion returns true it adds the unsecured route to an array to be returned
        var authRequired = _.filter(unsecured_routes, function(route) {
            // if the url contains the given route return a boolean
            return req.url.indexOf(route) > -1;
        });

        // If authRequired is set and the array has an element then the url matches at least 
        // one of the unsecured routes
        if(authRequired && authRequired.length > 0) {
            console.log("Authorisation not required - Reason: " + authRequired[0]);
            // Go to the next route
            next();

            // Exit the function
            return;
        }

        // Check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['authorization'];

        // If a token is set
        if (token) {

            // Verifies secret and checks expiration and decode the token
            jwt.verify(token, apiConfig.secret, function(err, decoded) {      
                if (err) {
                    console.log("Authentication failed.");
                    // Return a message as the token was not correct
                    return res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });    
                } else {
                    // if everything is good, save to request for use in the routes
                    console.log("Authentication successful.");
                    req.decoded = decoded;    

                    // Go to the next route
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No authentication token provided.' 
            });
        }
    });

    // This route is sued when a suer is logging in
    app.route('/api/authenticate/').post(function(req, res) {

        // If no request body
        if(!req.body) {
            console.log('No request body.');
            // Return an error
            return res.status(500).send({message: "Unable to login."});
        }

        // Convert the email to lowercase
        var email = req.body.username.toLowerCase();

        console.log("Requested: POST - /api/authenticate");
        console.log("User login - " + email);

        // Query the database for the email address
        User.findOne({email : email}).lean().exec().then(function(user) {
            // If the user isn't found
            if (!user) {
                // Return an error
                res.json({ success: false, message: 'Authentication failed. User not found.' });
                return;
            } else {

                // Get crypto libary
                var scrypt = require('scrypt');

                // Create a base64 buffer of the password form the database 
                var storedPassword = new Buffer(user.password, "base64");

                // Store the inputted password by the user
                var inputPassword = req.body.password;

                try {
                    // check if password matches
                    if (scrypt.verifyKdfSync(storedPassword, inputPassword)) {
                        // user is found and password is right create a token
                        var token = jwt.sign(user, apiConfig.secret, {
                            expiresIn: "2 days" // expires in 48 hours
                        });

                        // return the information including token as JSON
                        res.json({
                            success: true,
                            token: token,
                            user : user
                        });

                        return;

                    } else {
                        // Return an error
                        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                        return;
                    }
                } catch(exception) {
                    // Log the error
                    console.log("Log in exception: " + exception)

                    // Return an error
                    res.status(500).send({ success: false, message: exception });
                }
            }   
        })
        .catch(function errorHandler (err) {
            // Return an error message
            return res.status(500).send({  
                message: "Unable to login - " + err.message
            });
        });
    });
}