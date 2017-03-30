// widget controller file
'use strict'

// Import models
var Widget = require('../models/widget');
var Endpoint = require('../models/endpoint');
var System = require('../models/system');
var DashboardController = require('../controllers/dashboard');

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

    var countPromises = [];

    Widget.find().lean().exec().then(function widgetFind (widgets) {

        widgets.forEach(function (widget, i) {

            countPromises.push(controller.getMethodAndUrl(widget.endpoint)
                .then(function (endpoint) {
                    if(!endpoint) {
                        Console.log("Not all widgets could be lodded correctly!");

                        widget.method = null;
                        widget.apiURL = null;

                        return;
                    }

                    widget.method = endpoint.method;
                    widget.apiURL = endpoint.url;
            }))
            
        });

        Promise.all(countPromises).then(function completedPromises () {
            callback(undefined, widgets);
            return;
        })

    }).catch(function errorHandler (error) {
        callback(error);
    });
}

controller.get = function getUniqueWidget (widgetId, callback) {

    var query = { _id : widgetId };

    Widget.findById(query).lean().exec().then(function (widget) {
        
        controller.getMethodAndUrl(widget.endpoint).then( function (endpoint) {
            if(!endpoint) {
                Console.log("Not all widgets could be lodded correctly!");

                widget.method = null;
                widget.apiURL = null;

                return;
            }

            widget.method = endpoint.method;
            widget.apiURL = endpoint.url;

            callback(undefined, widget);
            return;
        })
    }).catch(function errorHandler (error) {
        callback(error);
    });
}

controller.getForHome = function getAll (callback) {

    var countPromises = [];

    var query = {displayHome : "TRUE"};

    Widget.find(query).lean().exec().then(function widgetFindForHome (widgets) {
        
        widgets.forEach(function (widget, i) {

            countPromises.push(controller.getMethodAndUrl(widget.endpoint)
                .then(function (endpoint) {
                    if(!endpoint) {
                        Console.log("Not all widgets could be lodded correctly!");

                        widget.method = null;
                        widget.apiURL = null;

                        return;
                    }

                    widget.method = endpoint.method;
                    widget.apiURL = endpoint.url;
            }))
            
        });

        Promise.all(countPromises)
        .catch(function() {
            Console.log("Not all widgets could be lodded correctly!");
        })
        .then(function completedPromises () {
            callback(undefined, widgets);
            return;
        })
        
    }).catch(function errorHandler (error) {
        callback(error);
    });
}

controller.create = function create (newWidget, callback) {

    var widget = Widget(newWidget);

    widget.save(function(err, createdWidget) {
        if(err) {
            callback(err);
            return;
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

    // If not count then remove value field
    if(updatedWidget.value != undefined && updatedWidget.graphType != "count") {
        delete updatedWidget.value;
    }

    Widget.findOneAndUpdate(query, updatedWidget, {new: true}, function(err, widget) {

        if(err) {
            console.log("Error: " + err);
            callback(err);
            return;
        }

        // return the message
        callback(undefined, {success : true, message : "Widget Updated.", data : widget});

    });
}

controller.delete = function (widgetId, callback) {

    DashboardController.removeWidget(widgetId, function(error) {

        if(error) {
            callback(error);
            return;
        }

        Widget.remove({"_id" : widgetId}).then(function () {
            callback();
            return;
        })
        .catch(function errorHandler (error) {
            console.log("Error: " + error);

            callback(error);
            return;
        });
    });
}

controller.getMethodAndUrl = function(endpointId) {

    var result = {};

    return Endpoint.findOne({_id :  endpointId}, "requestType url parentSystem").lean().exec().then(function (endpoint) {

        if(endpoint) {

            result.method = endpoint.requestType;

            // Get the system url
            return System.findOne({_id :  endpoint.parentSystem}, "url").lean().exec().then(function (system) {
                result.url = system.url + endpoint.url;

                return result;
            })
        } else {
            Promise.resolve(null);
        }

    })

}

controller.deleteByEndpoint = function(endpointId, callback) {

    var self = this;
    self.callback = callback;

    Widget.find({ endpoint : endpointId }).lean().exec()
        .then(function (widgets) {

        widgets.forEach(function (widget, i) {

            self.delete(widget._id, function (err) {
                if(err) {
                    self.callback(err);
                    return;
                }
            })
        });

        self.callback();   
    })
    .catch(function errorHandler (error) {
        self.callback(error);
        return;
    })

}

module.exports = controller;