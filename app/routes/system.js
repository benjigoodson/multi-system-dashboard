// API endpoints for Systems
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/system');
var System = require('../models/system');

// instance of an express router
var router = express.Router();

// Systems api routes
router.route('/')
    .get(function(req, res) {
        console.log("Requested: GET - /api/system");

        controller.getAll(function(err, systems) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send(err);
            }

            res.send(systems);

        });

    })

router.route('/basic')
    .get(function(req, res) {
        console.log("Requested: GET - /api/system/basic");

        controller.getAllBasic(function(err, systems) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send(err);
            }

            res.send(systems);

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
                    res.status(500).send(err);
                }

                res.json({ success : true, user : newSystem});

            });

        }

    });

router.route('/:system_id')

    // Get a unique system
    .get(function(req, res) {
        console.log("Requested: GET - /api/system/:system_id");

        // Get system by the id passed
        System.findById(req.params.system_id, function(err, system) {
            if(err) {
                res.send(err);
            }

            // return the system
            res.json(system);
        });
    })

    // Update a system
    .put(function(req, res) {
        console.log("Requested: GET - /api/system/:system_id");

        // Get system by the id passed
        System.findById(req.params.system_id, function(err, system) {
            if(err) {
                res.send(err);
            }

            // Map fields

            system.save(function(err) {
                if(err) {
                    res.send(err);
                }

                // return the message
                res.json({message : "System updated."});
            });

        });
    })

    // Delete a unique system
    .delete(function(req, res) {

        var systemId = req.params.system_id;

        console.log("Requested: DELETE - /api/system/" + systemId);

        controller.delete(systemId, function(err, result) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send(err);
            }

            res.send(result);

        });
    });

module.exports = router;