// API endpoints for Athuentication
'use strict'

// Imports
var express = require('express');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

// Get config
var apiConfig = require('../config/api');

module.exports = function (app) {

    app.use(function(req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

        // Headers to allow
        res.setHeader('Access-Control-Allow-Headers', '*, authorization');

        // Allow senidng of cookies for sessions etc
        res.setHeader('Access-Control-Allow-Credentials', true);

        next();

    });

    app.use(function(req, res, next) {
        console.log("Authorizing at middleware");

        console.log("Auth deactivated");

        // // check header or url parameters or post parameters for token
        // var token = req.body.token || req.query.token || req.headers['authorization'];

        // // decode token
        // if (token) {

        //     // verifies secret and checks exp
        //     jwt.verify(token, apiConfig.secret, function(err, decoded) {      
        //         if (err) {
        //             return res.json({ success: false, message: 'Failed to authenticate token.' });    
        //         } else {
        //             // if everything is good, save to request for use in other routes
        //             req.decoded = decoded;    
                     next();
        //         }
        //     });

        // } else {

        //     // if there is no token
        //     // return an error
        //     return res.status(403).send({ 
        //         success: false, 
        //         message: 'No authentication token provided.' 
        //     });
        // }
    });

    app.route('/api/authenticate/').post(function(req, res) {

        if(!req.body) {
            console.log('No request body.');
            return res.status(500).send({message: "Unable to login."});
        }

        var email = req.body.username.toLowerCase();

        console.log("Requested: POST - /api/authenticate");
        console.log("User login - " + email);

        User.findOne({
                email : email
        }).lean().exec()
        .then(function(user) {
            if (!user) {
                
                res.json({ success: false, message: 'Authentication failed. User not found.' });

            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {

                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });

                } else {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user, apiConfig.secret, {
                        expiresIn: "2 days" // expires in 48 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        token: token,
                        user : user
                    });
                }
            }   
        })
        .catch(function errorHandler (err) {
            return res.status(500).send({  
                message: "Unable to login - " + err.message
            });
        });
    });
}