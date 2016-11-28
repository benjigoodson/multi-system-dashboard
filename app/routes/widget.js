// API endpoints for Widgets
'use strict'

// Imports
var express = require('express');
var controller = require('../controllers/widget');
var Widget = require('../models/widget');

// instance of an express router
var router = express.Router();;

// Widgets api routes
router.route('/')
    .get(function(req, res) {
        console.log("Requested: GET - /api/widget");

        controller.getAll(function(err, widgets) {

            if(err) {
                Console.log("Error: " + err);
                res.status(500).send(err);
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
                    res.status(500).send(err);
                }

                res.send(newWidget);

            });

        }

    });

router.route('/:widget_id')

    // Get a unique widget
    .get(function(req, res) {
        console.log("Requested: GET - /api/sywidgetstem/:widget_id");

        // Get widget by the id passed
        Widget.findById(req.params.widget_id, function(err, widget) {
            if(err) {
                res.send(err);
            }

            // return the widget
            res.json(widget);
        });
    })

    // Update a widget
    .put(function(req, res) {
        console.log("Requested: GET - /api/widget/:widget_id");

        // Get widget by the id passed
        Widget.findById(req.params.widget_id, function(err, widget) {
            if(err) {
                res.send(err);
            }

            // Map fields

            widget.save(function(err) {
                if(err) {
                    res.send(err);
                }

                // return the message
                res.json({message : "Widget updated."});
            });

        });
    });



module.exports = router;