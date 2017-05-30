// API endpoints for Dashboards
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/dashboard');

// instance of an express router
var router = express.Router();

// Dashboards api routes

// Get a basic dashboard
router.route('/basic/:userId').get(function(req, res) {

    // Get the id from the parameters passed
    var userId = req.params.userId;

    console.log("Requested: GET - /api/dashboard/basic/"  + userId);

    // Call controller method to get all the dashboards basic details
    controller.getAllBasic(userId, function(err, basicDashboards) {

        if(err) {
            // If there is an error thrown log the error
            console.log("Error: " + err);
            // Return an error to the user
            res.status(500).json({success:false, message: err});
            return;
        } else {
            // Send the results of the query
            res.send({success:true, message: "Dashboards loaded.", data : basicDashboards});
        }

    });

})

// Create a new dashboard
router.route('/').post(function(req, res) {
    console.log("Requested: POST - /api/dashboard");

    // If there is a request body 
    if(req._body) {

        // store the dashboard object 
        var dashboard = req.body;

        // Use the controller's function to create a dashboard and return the created object
        controller.create(dashboard, function(err, newDashboard) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // return the result to the user
                res.json({success:true, message: "Dashboard created.", data : newDashboard});
            }

        });
    }
});

// get a unqiue dashboard
router.route('/:dashboard_id')

    // Get a unique dashboard
    .get(function(req, res) {

        // Get the id from the parameters passed
        var id = req.params.dashboard_id;

        console.log("Requested: GET - /api/dashboard/" + id);

        // Get dashboard by the id passed
        controller.get(id, function(err, dashboard) {
            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // return the dashboard
                res.json({success:true, data : dashboard});
            }
        });

    })

    // Update a dashboard
    .put(function(req, res) {

        // Get the id from the paremters passed
        var id = req.params.dashboard_id;

        console.log("Requested: PUT - /api/dashboard/" + id);

        // store the dashboard object 
        var dashboard = req.body;

        // Call the controller's update function
        controller.update(dashboard, function(err, updatedDashboard) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // return the result
                res.json({success : true, message : "Dashboard Updated.", data : updatedDashboard});
            }

        });
    })

    // Delete a dashboard
    .delete(function(req, res) {

        // Get the id from the paremters passed
        var dashboardId = req.params.dashboard_id;

        console.log("Requested: DELETE - /api/dashboard/" + dashboardId);

        // Call the controller's delete function    
        controller.delete(dashboardId, function(err) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).json({success:false, message: err});
                return;
            } else {
                // return the result
                res.json({success : true, message : "Dashboard removed."});
            }

        })
    });

module.exports = router;