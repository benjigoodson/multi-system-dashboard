// widget controller file
'use strict'

// Import models
var Widget = require('../models/widget');
var Endpoint = require('../models/endpoint');
var System = require('../models/system');
var DashboardController = require('../controllers/dashboard');

var controller = {};

// List of fields not to be stored within the system or displayed
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

    var countPromises = [];

    // Database query to get all widgets
    Widget.find().lean().exec().then(function (widgets) {

        // For each widget
        widgets.forEach(function (widget, i) {

            // Get the method and URL for the widget
            // Add the promise to an array
            countPromises.push(controller.getEndpointDetails(widget.endpoint)
                .then(function (endpoint) {

                    // If an endpoint isn't found
                    if(!endpoint) {
                        // Log the error
                        console.log("Not all widgets could be loaded correctly!");

                        // Set null values
                        widget.method = null;
                        widget.apiURL = null;
                        widget.apiKey = "";

                        return;
                    }

                    // Set the url and method for the widget
                    widget.method = endpoint.method;
                    widget.apiURL = endpoint.url;
                    widget.apiKey = endpoint.apiKey;
            }))
            
        });

        // All promises have been completed
        Promise.all(countPromises)
        .catch(function(err) {
            // Log the error
            console.log("Problem loading widgets: " + err.message);
            // Don't use a callback as all of the widgets need to be returned anyway
        })
        .then(function completedPromises () {
            // Return all of the widgets
            callback(undefined, widgets);
            return;
        })

    }).catch(function errorHandler (error) {
        // Catch any errors return error to the calling function
        console.log("Error: " + error);
        callback(error);
    });
}

controller.get = function getUniqueWidget (widgetId, callback) {

    // Create a query matching a widget id
    var query = { _id : widgetId };

    // Database query to find a widget matching a widget id
    Widget.findById(query).lean().exec().then(function (widget) {
        
        controller.getEndpointDetails(widget.endpoint).then( function (endpoint) {

            // If an endpoint isn't found
            if(!endpoint) {
                // Log the error
                console.log("Not all widgets could be loaded correctly!");

                // Set null values
                widget.method = null;
                widget.apiURL = null;
                widget.apiKey = "";

                return;
            }

            // Set the endpoint values
            widget.method = endpoint.method;
            widget.apiURL = endpoint.url;

            // Return the widgets to the callback function
            callback(undefined, widget);
            return;
        })
    }).catch(function errorHandler (error) {
        // Catch any errors return error to the calling function
        console.log("Error: " + error);
        callback(error);
    });
}

controller.getForHome = function getAll (callback) {

    var countPromises = [];

    // create a query for widgets that have displayHome set as true
    var query = {displayHome : "TRUE"};

    // Database query for widgets on the home page
    Widget.find(query).lean().exec().then(function widgetFindForHome (widgets) {
        
        // for each widget
        widgets.forEach(function (widget, i) {

            // Get the method and URL
            // Add the promise to an array
            countPromises.push(controller.getEndpointDetails(widget.endpoint)
                .then(function (endpoint) {

                    // If an endpoint isn't found
                    if(!endpoint) {
                        // Log the error
                        console.log("Not all widgets could be loaded correctly!");
                        
                        // Set null values
                        widget.method = null;
                        widget.apiURL = null;
                        widget.apiKey = "";

                        return;
                    }

                    // Set endpoint values
                    widget.method = endpoint.method;
                    widget.apiURL = endpoint.url;
                    widget.apiKey = endpoint.apiKey;
            }))
            
        });

        // When all promises are complete
        Promise.all(countPromises)
        .catch(function(err) {
            // Log the error
            console.log("Problem loading widgets: " + err.message);
            // Don't use a callback as all of the widgets need to be returned anyway
        })
        .then(function completedPromises () {
            // Return all of the widgets
            callback(undefined, widgets);
            return;
        })
        
    }).catch(function errorHandler (error) {
        // Catch any errors return error to the calling function
        console.log("Error: " + error);
        callback(error);
    });
}

controller.create = function create (newWidget, callback) {

    // Create a new widget with the Widget Schema
    var widget = new Widget(newWidget);

    // Database query for creating a new widget
    widget.save(function(err, createdWidget) {
        // If there is an error, return it
        if(err) {
            callback(err);
            return;
        }

        // Return the created widget to the callback function
        callback(undefined, createdWidget);

    });
}

controller.update = function update (updatedWidget, callback) {

    // create a query for widgets id's matching the passed id        
    var query = { "_id" : updatedWidget._id };

    // Strip fields from the widget
    for(var property in updatedWidget)
    {	
        if(controller.fieldBlacklist.indexOf(property) > -1) {
            // Set the property as null
            updatedWidget[property] = null;
            // Remove the property form the object
            delete updatedWidget[property];
        }
    }

    // If not count then remove value field
    if(updatedWidget.value != undefined && updatedWidget.graphType != "count") {
        // If this field is set and isn't needed, remove it
        delete updatedWidget.value;
    }

    // Database query for updating a widget
    Widget.findOneAndUpdate(query, updatedWidget, {new: true}, function(err, widget) {

        // If an error occurs, return it
        if(err) {
            console.log("Error: " + err);
            callback(err);
            return;
        }

        // return the result
        callback(undefined, {success : true, message : "Widget Updated.", data : widget});

    });
}

controller.delete = function (widgetId, callback) {

    // Database query for removing a widget from a dashboard
    DashboardController.removeWidget(widgetId, function(error) {

        // If an error occurs, return it
        if(error) {
            callback(error);
            return;
        }

        // Database query for removing a widget
        Widget.remove({"_id" : widgetId}).then(function () {
            callback();
            return;
        })
        .catch(function errorHandler (error) {
            // Catch any errors return error to the calling function
            console.log("Error: " + error);
            callback(error);
            return;
        });
    });
}

controller.getEndpointDetails = function(endpointId) {

    var result = {};

    // Database query to find an endpoint matching the passed id, returns the database promise
    return Endpoint.findOne({_id :  endpointId}, "requestType url parentSystem apiKey").lean().exec().then(function (endpoint) {

        // If an endpoint is found
        if(endpoint) {
                        
            // Set the result method
            result.method = endpoint.requestType;
            result.apiKey = endpoint.apiKey;

            // Get the system url
            return System.findOne({_id :  endpoint.parentSystem}, "url").lean().exec().then(function (system) {
                result.url = system.url + endpoint.url;

                return result;
            });

        } else {
            // Resolve a null value
            Promise.resolve(null);
        }

    })

}

controller.deleteByEndpoint = function(endpointId, callback) {

    var self = this;

    // Store the callback method
    self.callback = callback;

    // Database query for finding a widget that matches an endpoitn id
    Widget.find({ endpoint : endpointId }).lean().exec()
        .then(function (widgets) {

        if(widgets.length > 0) {
            // For each widget
            widgets.forEach(function (widget, i) {

                // Use the controller method to delete the widget
                // This handles cascading to other entites
                self.delete(widget._id, function (err) {
                    // If an error occurs, return it
                    if(err) {
                        self.callback(err);
                        return;
                    }

                    self.callback(); 
                })
            });
        } else {
            self.callback();
        }
  
    })
    .catch(function errorHandler (error) {
        // Catch any errors return error to the calling function
        console.log("Error: " + error)
        self.callback(error);
        return;
    })

}

module.exports = controller;