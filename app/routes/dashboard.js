// API endpoints for Dashboards
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/dashboard');
var Dashboard = require('../models/dashboard');

// instance of an express router
var router = express.Router();

// Dashboards api routes
// Get a basic dashboard
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
                res.status(500).send({success:false, message: err});
                return;
            }

            res.json({success:true, message: "Dashboard created.", data : newDashboard});

        });
    }
});

router.route('/:dashboard_id')

    // Get a unique dashboard
    .get(function(req, res) {
        console.log("Requested: GET - /api/dashboard/" + req.params.dashboard_id);

        // Get dashboard by the id passed
        Dashboard.findById(req.params.dashboard_id, function(err, dashboard) {
            if(err) {
                res.status(500).send({success:false, message: err});
            }

            // return the dashboard
            res.json({success:true, data : dashboard});
        });

    })

    // Update a dashboard
    .put(function(req, res) {
        console.log("Requested: PUT - /api/dashboard/" + req.params.dashboard_id);

        var updatedDashboard = req.body;

        controller.update(updatedDashboard, function(err, response) {

            if(err) {
                res.send(500, { success : false, error: err });
            }

            // return the message
            res.json(response);

        });
    })

    // Delete a dashboard
    .delete(function(req, res) {

        var dashboardId = req.params.dashboard_id;

        console.log("Requested: DELETE - /api/dashboard/" + dashboardId);

        controller.delete(dashboardId, function(err) {

            if(err) {
                res.send(500, { success : false, error: err });
            }

            // return the message
            res.json({success : true, message : "Dashboard removed."});

        })
    });

module.exports = router;