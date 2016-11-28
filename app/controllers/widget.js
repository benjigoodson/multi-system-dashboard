// widget controller file
'use strict'

// Import models
var Widget = require('../models/widget');

 var controller = {};
    
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

controller.getByDashboard = function getOne (callback) {

}

module.exports = controller;