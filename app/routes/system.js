// API endpoints for Systems
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/system');

// instance of an express router
var router = express.Router();

// Systems api routes

// Get all systems
router.route('/')
    .get(function(req, res) {
        console.log("Requested: GET - /api/system");

        // Call the controller's function to get all systems
        controller.getAll(function(err, systems) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).send({success:false, message: err});
                return;
            } else {
                // Return the results to the user
                res.send({success:true, data : systems});
            }

        });

    })

router.route('/basic')
    .get(function(req, res) {
        console.log("Requested: GET - /api/system/basic");

        // Call the controller's function to get all basic for the systems
        controller.getAllBasic(function(err, systems) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).send({success:false, message: err});
                return;
            } else {
                // Return the results to the user
                res.send({success:true, data : systems});
            }

        });

    })

// Create a new system
router.route('/')
    .post(function(req, res) {
        console.log("Requested: POST - /api/system");

        // If a body is set
        if(req._body) {

            // Store the new system
            var system = req.body;

            // Call the controller's function to create a system
            controller.create(system, function(err, newSystem) {

                if(err) {
                    // If there is an error thrown log the error
                    console.log("Error: " + err);
                    // Return an error to the user
                    res.status(500).json({success:false, message: err.message});
                    return;
                } else {
                    // Return the result to the user
                    res.json({success:true, message: "System created.", data : newSystem});
                }

            });

        }

    });

router.route('/:system_id')

    // Get a unique system
    .get(function(req, res) {

        // Store the system id
        var id = req.params.system_id;

        console.log("Requested: GET - /api/system/" + id);

        // Call the controller function to get the system that matches a system id
        controller.get(id, function(err, system) {
            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).send({success:false, message: err});
                return;
            } else {
                // Return the result to the user
                res.json(system);
            }
        });
    })

    // Update a system
    .put(function(req, res) {

        // Store the system id
        var id = req.params.system_id;

        console.log("Requested: PUT - /api/system/" + id);

        // Store the system
        var updatedSystem = req.body;

        // Call the controller function to update a system
        controller.update(updatedSystem, function(err, response) {
            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.send(500, { success : false, error: err });
                return;
            } else {
                // Return the result to the user
                res.json(response);
            }
        });
    })

    // Delete a unique system
    .delete(function(req, res) {

        // Store the system id
        var systemId = req.params.system_id;

        console.log("Requested: DELETE - /api/system/" + systemId);

        // Call the controller function to delete a system
        controller.delete(systemId, function(err) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).send(err);
                return;
            } else {
                // Return the result to the user
                res.json({success : true, message : "System removed."});
            }

        });
    });

module.exports = router;