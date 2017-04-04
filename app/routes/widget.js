// API endpoints for Widgets
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/widget');

// instance of an express router
var router = express.Router();

// Widgets api routes

// Get all widgets
router.route('/')
    .get(function(req, res) {
        console.log("Requested: GET - /api/widget");

        // Call the controller's function to get all widgets
        controller.getAll(function(err, widgets) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).send(err);
                return;
            } else {
                // Return the results
                res.send(widgets);
            }

        });
    })

// Get all widgets for the home screen
router.route('/home')
    .get(function(req, res) {
        console.log("Requested: GET - /api/widget/home");

        // Call the controller's function to get all widgets on the home page
        controller.getForHome(function(err, widgets) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).send({success:false, message: err});
                return;
            } else {
                // Return the results
                res.send(widgets);
            }

        });
    })

// Create a new widget
router.route('/')
    .post(function(req, res) {
        console.log("Requested: POST - /api/widget");

        // If the body is set
        if(req._body) {

            // Store the widget details
            var widget = req.body;

            // Call the controller's function to create a  widget
            controller.create(widget, function(err, newWidget) {

                if(err) {
                    // If there is an error thrown log the error
                    console.log("Error: " + err);
                    // Return an error to the user
                    res.status(500).send({success:false, message: err});
                    return;
                } else {
                    // Return the result
                    res.send({success:true, message: "Widget created.", data : newWidget});
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

router.route('/:widget_id')

    // Get a unique widget
    .get(function(req, res) {

        // Store the widget id
        var id = req.params.widget_id;

        console.log("Requested: GET - /api/widget/" + id);

        // Call the controller's function to get a  widget that matches the widget id
        controller.get(id, function(err, widget) {
            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).send({success:false, message: err});
                return;
            }

            // return the widget            
            res.json({success:true, message: "Widget loaded.", data : widget});
        });
    })

    // Update a widget
    .put(function(req, res) {
        console.log("Requested: PUT - /api/widget/" + req.params.widget_id);

        // Store the updated widget
        var updatedWidget = req.body;

        // Call the controller's function to update a  widget
        controller.update(updatedWidget, function(err, response) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).send({success:false, message: err});
                return;
            } else {
                // Return the result
                res.json(response);
            }

        });
    })

    // Delete a widget
    .delete(function(req, res) {

        // Store the widget id
        var widgetId = req.params.widget_id;

        console.log("Requested: DELETE - /api/widget/" + widgetId);

        // Call the controller's function to delete a  widget
        controller.delete(widgetId, function(err) {

            if(err) {
                // If there is an error thrown log the error
                console.log("Error: " + err);
                // Return an error to the user
                res.status(500).send({success:false, message: err});
                return;
            } else {
                // Return the result
                res.json({success : true, message : "Widget removed."});
            }

        });
    });

module.exports = router;