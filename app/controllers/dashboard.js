// Dashboard controller file
'use strict'

// Import models
var Dashboard = require('../models/dashboard');

var controller = {};
    
controller.getAllBasic = function getAllBasicDashboards (callback) {

    Dashboard.find().lean().exec().then(function dashboardFindAll (dashboards) {

        var basicDashboards = [];

        dashboards.forEach(function (dashboard, i) {

            // Just get basic fields
            basicDashboards.push({ id : dashboard._id, name : dashboard.name});    
        });

        callback(undefined, basicDashboards);
    })
    .catch(function errorHandler (error) {
        callback(error);
    })
}

controller.get = function getDashboard (dashboardId, callback) {

    var query = {_id : dashboardId};

    Dashboard.findOne(query).lean().exec().then(function dashboardFindOne (dashboard) {

        callback(undefined, dashboard);
    })
    .catch(function errorHandler (error) {
        callback(error);
    })
}

controller.create = function create (newDashboard, callback) {

     Dashboard(newDashboard).save(function(err, createdDashboard) {
        if(err) {
            callback(err);
            return;
        }
        callback(undefined, createdDashboard);
    });
}

controller.update = function update (updatedDashboard, callback) {
        
    var query = { "_id" : updatedDashboard._id };

    Dashboard.findOneAndUpdate(query, updatedDashboard, {new: true}, function(err, dashboard) {

        if(err) {
            callback(err);
            return;
        }

        // return the dashboard
        callback(undefined, dashboard);

    });
}

controller.delete = function (dashboardId, callback) {

    Dashboard.remove({"_id" : dashboardId}).then(function () {
        callback();
    })
    .catch(function errorHandler (error) {
        callback(error);
    });
}

module.exports = controller;