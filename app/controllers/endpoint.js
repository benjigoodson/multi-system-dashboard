// endpoint controller file
'use strict'

// Import models
var Endpoint = require('../models/endpoint');
var System = require('../models/system');

var controller = {};
    
controller.getAll = function getAll (callback) {
    var countPromises = []

    var endpointPromise = Endpoint.find().lean().exec()
        .then(function endpointFind (endpoints) {

            endpoints.forEach(function (endpoint , i) {

                countPromises.push(controller.getSystemNames(endpoint)
                    .then(function updateSystemName (systems) {

                        endpoint.systemName = systems[0].name;

                    }))
            });

            Promise.all(countPromises).then(function completedPromises () {

                callback(undefined, endpoints);           

            })
        })
        .catch(function errorHandler (error) {
            callback(error);
        })

}

controller.getAllBasic = function getAllEndpointsBasic (systemId, callback) {

    var countPromises = []

    var endpointPromise = Endpoint.find({parentSystem : systemId}).lean().exec()
        .then(function endpointFind (endpoints) {

            var basicEndpoints = [];

            for(var i = 0; i < endpoints.length; i++) {

                // Just get basic fields
                basicEndpoints.push({ 
                    id : endpoints[i]._id,
                    name : endpoints[i].name,
                    createdBy : endpoints[i].createdBy,
                    createdDate : endpoints[i].createdDate,
                    url : endpoints[i].url,
                    requiresBody : endpoints[i].requiresBody,
                    requestType : endpoints[i].requestType
                });                

            }

            callback(undefined, basicEndpoints);

        })
        .catch(function errorHandler (error) {
            callback(error);
        })

}

controller.getSystemNames = function getSystemName (endpoint) {

    // Get the system name
    return System.find({_id :  endpoint.parentSystem.toString()}).lean().exec()

}

controller.create = function create (newEndpoint, callback) {

    var endpoint = Endpoint(newEndpoint);

    endpoint.save(function(err, createdEndpoint) {
        if(err) {
            callback(err);
        }

        callback(undefined, createdEndpoint);

    });
}

controller.delete = function create (endpointId, callback) {

    Endpoint.remove({ _id : endpointId }, function(err) {

        callback(err);

    });
}

module.exports = controller;