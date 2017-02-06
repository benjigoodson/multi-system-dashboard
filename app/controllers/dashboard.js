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

    Dashboard.findOne(query).lean().exec().then(function dashboardFindOne (dashboards) {

        callback(undefined, dashboards);
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
            console.log("Error: " + err);
            callback(err);
        }

        // return the message
        callback(undefined, {success : true, message : "Dashboard Updated.", data : dashboard});

    });
}

controller.delete = function (dashboardId, callback) {

    Dashboard.find({"_id" : dashboardId}).remove().then(function () {
            callback();
    })
    .catch(function errorHandler (error) {
        console.log("Error: " + error);

        callback(error);
    });
}

module.exports = controller;