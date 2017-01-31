// widget controller file
'use strict'

// Import models
var Widget = require('../models/widget');

var controller = {};

controller.fieldBlacklist = [
    "_id",
    "__v",
    "data",    
    "labels",
    "options",
    "loading",
    "error"
];

controller.getAll = function getAll (callback) {
    var widgetPromise = Widget.find().lean().exec()
        .then(function widgetFind (widgets) {
            callback(undefined, widgets);
        })
        .catch(function errorHandler (error) {
            callback(error);
        })
}

controller.create = function create (newWidget, callback) {

    var widget = Widget(newWidget);

    widget.save(function(err, createdWidget) {
        if(err) {
            callback(err);
        }

        callback(undefined, createdWidget);

    });
}

controller.update = function update (updatedWidget, callback) {
        
        var query = { "_id" : updatedWidget._id };

        // Strip fields
        for(var property in updatedWidget)
        {	
            if(controller.fieldBlacklist.indexOf(property) > -1) {
                updatedWidget[property] = null;
                delete updatedWidget[property];
            }
        }

        Widget.findOneAndUpdate(query, updatedWidget, function(err, widget) {

            if(err) {
                console.log("Error: " + err);
                callback(err);
            }

            // return the message
            callback(undefined, {success : true, message : "Widget updated."});

        });
}

controller.delete = function (widgetId, callback) {

    Widget.find({"_id" : widgetId}).remove().then(function () {
            callback();
        })
        .catch(function errorHandler (error) {
            console.log("Error: " + error);

            callback(error);
        });
}

controller.getByDashboard = function getOne (callback) {

}

module.exports = controller;