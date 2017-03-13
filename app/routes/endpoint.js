// API endpoints for Endpoints
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/endpoint');

// instance of an express router
var router = express.Router();;

// Endpoints api routes
router.route('/')
    .get(function(req, res) {
        console.log("Requested: GET - /api/endpoint");

        controller.getAll(function(err, endpoints) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).json({success:false, message: err});
                return;
            } else {
                res.json({ success : true, data : endpoints});
            }

        });

    })

router.route('/basic/:systemId')
    .get(function(req, res) {

        var systemId = req.params.systemId;

        console.log("Requested: GET - /api/endpoint/basic/" + systemId);

        if(systemId) {

            controller.getAllBasic(systemId, function(err, endpoints) {

                if(err) {
                    console.log("Error: " + err);
                    res.status(500).json({success:false, message: err});
                    return;
                } else {
                    res.json({ success : true, data : endpoints});
                }
            });
        }
    })

// Create a new endpoint
router.route('/')
    .post(function(req, res) {
        console.log("Requested: POST - /api/endpoint");

        if(req._body) {

            var endpoint = req.body;

            controller.create(endpoint, function(err, newEndpoint) {

                if(err) {
                    console.log("Error: " + err);
                    res.status(500).json({success:false, message: err});
                    return;
                } else {
                    res.json({ success : true, message : "Endpoint created.", data : newEndpoint});
                }
            });
        }
    });

router.route('/:endpoint_id')

    // Get a unique endpoint
    .get(function(req, res) {

        var id = req.params.endpoint_id;

        console.log("Requested: GET - /api/endpoint/" + id);

        // Get endpoint by the id passed
        controller.get(id, function(err, endpoint) {
            if(err) {
                console.log("Error: " + err);
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

        var id = req.params.endpoint_id;

        console.log("Requested: PUT - /api/endpoint/" + id);

        var endpoint = req.body;

        // Get endpoint by the id passed
        controller.update(endpoint, function(err, updatedEndpoint) {
            if(err) {
                console.log("Error: " + err);
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // return the message
                res.json({ success : true, message : "Endpoint updated.", data : updatedEndpoint});
            }
        });

    })

    // Delete a unique endpoint
    .delete(function(req, res) {

        var endpointId = req.params.endpoint_id;

        console.log("Requested: DELETE - /api/endpoint/" + endpointId);

        controller.delete(endpointId, function(err) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).json({success:false, message: err});
                return;
            } else {
                res.json({success : true, message : "Endpoint removed."});
            }

        });
    });

module.exports = router;