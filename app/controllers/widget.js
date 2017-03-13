// widget controller file
'use strict'

// Import models
var Widget = require('../models/widget');
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
    Widget.find().lean().exec().then(function widgetFind (widgets) {
        callback(undefined, widgets);
        return;
    }).catch(function errorHandler (error) {
        callback(error);
    });
}

controller.get = function getUniqueWidget (widgetId, callback) {

    var query = { _id : widgetId };

    Widget.findById(query).lean().exec().then(function (widget) {
        callback(undefined, widget);
        return;
    }).catch(function errorHandler (error) {
        callback(error);
    });
}

controller.getForHome = function getAll (callback) {

    var query = {displayHome : "TRUE"};

    Widget.find(query).lean().exec().then(function widgetFindForHome (widgets) {
        callback(undefined, widgets);
        return;
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