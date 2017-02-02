// Dashboard controller file
'use strict'

// Import models
var Dashboard = require('../models/dashboard');
var Endpoint = require('../models/endpoint');

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

controller.create = function create (newDashboard, callback) {

    var dashboard = Dashboard(newDashboard);

    dashboard.save(function(err, createdDashboard) {
        if(err) {
            callback(err);
        }
        callback(undefined, createdDashboard);
    });
}

module.exports = controller;