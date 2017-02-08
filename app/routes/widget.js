// API endpoints for Widgets
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/widget');

// instance of an express router
var router = express.Router();;

// Widgets api routes
// Get all widgets
router.route('/').get(function(req, res) {
    console.log("Requested: GET - /api/widget");

    controller.getAll(function(err, widgets) {

        if(err) {
            Console.log("Error: " + err);
            res.status(500).send(err);
        }

        res.send(widgets);

    });

})

// Get all widgets for the home screen
router.route('/home').get(function(req, res) {
    console.log("Requested: GET - /api/widget/home");

    controller.getForHome(function(err, widgets) {

        if(err) {
            console.log("Error: " + err);
            res.status(500).send({success:false, message: err});
        }

        res.send(widgets);

    });

})

// Create a new widget
router.route('/').post(function(req, res) {
    console.log("Requested: POST - /api/widget");

    if(req._body) {

        var widget = req.body;

        controller.create(widget, function(err, newWidget) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send({success:false, message: err});
            }

            res.send({success:true, message: "Widget created.", data : newWidget});

        });

    }

});

router.route('/:widget_id')

    // Get a unique widget
    .get(function(req, res) {

        var id = req.params.widget_id;

        console.log("Requested: GET - /api/widget/" + id);

        // Get widget by the id passed
        controller.get(id, function(err, widget) {
            if(err) {
                console.log("Error: " + err);
                res.status(500).send({success:false, message: err});
            }

            // return the widget            
            res.json({success:true, message: "Widget loaded.", data : widget});
        });
    })

    // Update a widget
    .put(function(req, res) {
        console.log("Requested: PUT - /api/widget/" + req.params.widget_id);

        var updatedWidget = req.body;

        controller.update(updatedWidget, function(err, response) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send({success:false, message: err});
            }

            // return the message
            res.json(response);

        });
    })

    // Delete a widget
    .delete(function(req, res) {

        var widgetId = req.params.widget_id;

        console.log("Requested: DELETE - /api/widget/" + widgetId);

        controller.delete(widgetId, function(err) {

            if(err) {
                console.log("Error: " + err);
                res.status(500).send({success:false, message: err});
            }

            // return the message
            res.json({success : true, message : "Widget removed."});

        });
    });

module.exports = router;