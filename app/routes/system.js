// API endpoints for Systems
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/system');

// instance of an express router
var router = express.Router();

// Systems api routes
router.route('/')
    .get(function(req, res) {
        console.log("Requested: GET - /api/system");

        controller.getAll(function(err, systems) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send({success:false, message: err});
            }

            res.send({success:true, data : systems});

        });

    })

router.route('/basic')
    .get(function(req, res) {
        console.log("Requested: GET - /api/system/basic");

        controller.getAllBasic(function(err, systems) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send({success:false, message: err});
            }

            res.send({success:true, data : systems});

        });

    })

// Create a new system
router.route('/').post(function(req, res) {
        console.log("Requested: POST - /api/system");

        if(req._body) {

            var system = req.body;

            controller.create(system, function(err, newSystem) {

                if(err) {
                    console.log("Error: " + err);
                    res.status(500).json({success:false, message: err.message});

                } else {
                    res.json({success:true, message: "System created.", data : newSystem});
                }

            });

        }

    });

router.route('/:system_id')

    // Get a unique system
    .get(function(req, res) {
        console.log("Requested: GET - /api/system/" + req.params.system_id);

        // Get system by the id passed
        controller.get(req.params.system_id, function(err, system) {
            if(err) {
                res.status(500).send({success:false, message: err});
            }

            // return the system
            res.json(system);
        });
    })

    // Update a system
    .put(function(req, res) {

        var id = req.params.system_id;

        console.log("Requested: PUT - /api/system/" + id);

        var updatedSystem = req.body;

        // Get system by the id passed
        controller.update(updatedSystem, function(err, response) {
            if(err) {
                res.send(500, { success : false, error: err });
            }

            // return the message
            res.json(response);
        });
    })

    // Delete a unique system
    .delete(function(req, res) {

        var systemId = req.params.system_id;

        console.log("Requested: DELETE - /api/system/" + systemId);

        controller.delete(systemId, function(err) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send(err);
            }

            res.json({success : true, message : "System removed."});

        });
    });

module.exports = router;