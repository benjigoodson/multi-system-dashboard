// API endpoints for Dashboards
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/dashboard');
var System = require('../models/dashboard');

// instance of an express router
var router = express.Router();

// Dashboards api routes
router.route('/basic').get(function(req, res) {
    console.log("Requested: GET - /api/dashboard/basic");

    controller.getAllBasic(function(err, basicDashboards) {

        if(err) {
            console.log("Error: " + err);
            res.status(500).send({success:false, message: err});
        }

        res.send({success:true, message: "Dashboards loaded.", data : basicDashboards});

    });

})

// Create a new dashboard
router.route('/').post(function(req, res) {
    console.log("Requested: POST - /api/dashboard");

    if(req._body) {

        var dashboard = req.body;

        controller.create(dashboard, function(err, newDashboard) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send(err);
            }

            res.json({success:true, message: "Dashboard created.", data : newDashboard});

        });
    }
});

router.route('/:system_id')

    // Get a unique system
    .get(function(req, res) {
        console.log("Requested: GET - /api/system/" + req.params.system_id);

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
        console.log("Requested: PUT - /api/system/:system_id");

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