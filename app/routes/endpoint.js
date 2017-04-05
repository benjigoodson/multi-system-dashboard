// API endpoints for Endpoints
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/endpoint');

// instance of an express router
var router = express.Router();

// Endpoints api routes

// Get all endpoints
router.route('/')
    .get(function(req, res) {
        console.log("Requested: GET - /api/endpoint");

        // Call the controller function to get all endpoints
        controller.getAll(function(err, endpoints) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // Return the results to the user
                res.json({ success : true, data : endpoints});
            }

        });

    })

// Get basic details for endpoints that match a system id
router.route('/basic/:systemId')
    .get(function(req, res) {

        // Store the system id
        var systemId = req.params.systemId;

        console.log("Requested: GET - /api/endpoint/basic/" + systemId);

        // If a system id is set
        if(systemId) {

            // Call the controller function to get all the basic details
            // for all endpoints that match a system id
            controller.getBasicEndpoints(systemId, function(err, endpoints) {

                if(err) {
                    // If there is an error thrown log the error
                    console.log("Error: " + err);
                    // Return an error to the user
                    res.status(500).json({success:false, message: err});
                    return;
                } else {
                    // Return the results to the user
                    res.json({ success : true, data : endpoints});
                }
            });
        }
    })

// Create a new endpoint
router.route('/')
    .post(function(req, res) {
        console.log("Requested: POST - /api/endpoint");

        // If there is a request body
        if(req._body) {

            // store the endpoint object 
            var endpoint = req.body;

            // Call the controller function to create a new endpoint
            controller.create(endpoint, function(err, newEndpoint) {

                if(err) {
                    // If there is an error thrown log the error
                    console.log("Error: " + err);
                    // Return an error to the user
                    res.status(500).json({success:false, message: err});
                    return;
                } else {
                    // Return the result
                    res.json({ success : true, message : "Endpoint created.", data : newEndpoint});
                }
            });
        } else {
            // If there is an error thrown log the error
            console.log("Error: No body content");
            // Return an error to the user
            res.status(500).send({success:false, message: "No body content"});
            return;
        }
    });

router.route('/:endpoint_id')

    // Get a unique endpoint
    .get(function(req, res) {

        // Store the endpoint id
        var id = req.params.endpoint_id;

        console.log("Requested: GET - /api/endpoint/" + id);

        // Get endpoint by the id passed using the controllers function
        controller.get(id, function(err, endpoint) {
            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // return the endpoint
                res.json({ success : true, data : endpoint});
            }
        });
    })

    // Update a endpoint
    .put(function(req, res) {

        // Store the endpoint id
        var id = req.params.endpoint_id;

        console.log("Requested: PUT - /api/endpoint/" + id);

        // Store the endpoint details
        var endpoint = req.body;

        // Call the controller's function to update an endpoint
        controller.update(endpoint, function(err, updatedEndpoint) {
            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // return the updated endpoint
                res.json({ success : true, message : "Endpoint updated.", data : updatedEndpoint});
            }
        });

    })

    // Delete a unique endpoint
    .delete(function(req, res) {

        // Store the endpoint id
        var endpointId = req.params.endpoint_id;

        console.log("Requested: DELETE - /api/endpoint/" + endpointId);

        // Call the controller's function to delete an endpoint
        controller.delete(endpointId, function(err) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // Return the result
                res.json({success : true, message : "Endpoint removed."});
            }

        });
    });

module.exports = router;