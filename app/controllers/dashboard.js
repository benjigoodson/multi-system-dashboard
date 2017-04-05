// Dashboard controller file
'use strict'

// Import models
var Dashboard = require('../models/dashboard');

var controller = {};
    
controller.getAllBasic = function getAllBasicDashboards (callback) {

    // Database query to get all dashboards
    Dashboard.find().lean().exec().then(function dashboardFindAll (dashboards) {

        var basicDashboards = [];

        // For each dashboard just keep basic details
        dashboards.forEach(function (dashboard, i) {

            // Just get basic fields
            basicDashboards.push({ id : dashboard._id, name : dashboard.name});    
        });

        // Return the list of basic dashboard details
        callback(undefined, basicDashboards);
    })
    .catch(function errorHandler (error) {
        // Return error to the calling function
        callback(error);
    })
}

controller.get = function getDashboard (dashboardId, callback) {

    // Create the query
    var query = {_id : dashboardId};

    // Database query to get a single dashboard
    Dashboard.findOne(query).lean().exec().then(function dashboardFindOne (dashboard) {

        // Return the dashboard
        callback(undefined, dashboard);
    })
    .catch(function errorHandler (error) {
        // Return error to the calling function
        callback(error);
    })
}

controller.create = function create (newDashboard, callback) {

    // Database query to create a new dashboard
     Dashboard(newDashboard).save(function(err, createdDashboard) {
        
        // If there is an error, return it
        if(err) {
            callback(err);
            return;
        }
        // Return the created dashboard
        callback(undefined, createdDashboard);
    });
}

controller.update = function update (updatedDashboard, callback) {
        
    var query = { "_id" : updatedDashboard._id };

    Dashboard.findOneAndUpdate(query, updatedDashboard, {new: true}, function(err, dashboard) {
        // If there is an error, return it
        if(err) {
            callback(err);
            return;
        }

        // Return the dashboard
        callback(undefined, dashboard);

    });
}

controller.removeWidget = function(widgetId, callback) {

    var self = this;

    self.promises = [];

    // Database query to find dashboards containing that widget id
    Dashboard.find({ widgets : widgetId}).lean().exec().then(function (dashboards) {

        // Loop through the dashboards
        dashboards.forEach(function (dashboard, i) {
           
            // Get the index of where the widget is in the array
            var index = dashboard.widgets.indexOf(widgetId);

            // If the widget is in the array 
            // (it should be else the database wouldn't return the dashboard)
            if(index > -1) {

                // Remove the element from the array
                dashboard.widgets.splice(index, 1);

                // Update the dashboard in the database
                self.promises.push(self.update(dashboard, function(error) {
                    // If there is an error return it to the calling function
                    if(error) {
                        callback(error);
                        return;
                    }
                }));
            } else {
                // Return an error
                callback("Widget Id cannot be found on dashboard.");
                return;
            }

        });

        // Complete the callback if all queries have been completed
        Promise.all(self.promises).then(function () {
            callback();   
            return;
        })
        
    })
    .catch(function errorHandler (error) {
        // Catch any thrown errors and return it to the calling function
        callback(error);
    })

}

controller.delete = function (dashboardId, callback) {

    // Database query for removing a dashboard based on it's id
    Dashboard.remove({"_id" : dashboardId}).then(function () {
        // Return to the calling function
        callback();
    })
    .catch(function errorHandler (error) {
        // Catch any errors and return it to the callign function
        callback(error);
    });
}

module.exports = controller;