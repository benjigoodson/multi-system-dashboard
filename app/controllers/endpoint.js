// endpoint controller file
'use strict'

// Import models
var Endpoint = require('../models/endpoint');
var System = require('../models/system');
var Widget = require('../models/widget');

var controller = {};
    
controller.getAll = function getAll (callback) {
    var countPromises = []

    Endpoint.find().lean().exec()
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

controller.get = function get (endpointId, callback) {

    var query = {_id : endpointId};

    Endpoint.findOne(query).lean().exec().then(function endpointFindOne (endpoint) {

        callback(undefined, endpoint);
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

controller.update = function update (endpoint, callback) {
        
    var query = { "_id" : endpoint._id };

    Endpoint.findOneAndUpdate(query, endpoint, {new: true}, function(err, updatedEndpoint) {

        if(err) {
            callback(err);
            return;
        }

        // return the endpoint
        callback(undefined, updatedEndpoint);

    });
}

controller.delete = function create (endpointId, callback) {

    var method = this;

    Widget.remove( { endpoint : endpointId }, function (err) {
        if(err) {
            method.callback(err);
            return;
        }
    })
    .catch(function errorHandler (error) {
        method.callback(error);
        return;
    })

    Endpoint.remove({ _id : endpointId }, function(err) {
        callback(err);
        return;
    });
}

controller.deleteBySystem = function create (systemId, callback) {

    var self = this;
    self.callback = callback;

    Endpoint.find({ parentSystem : systemId }).lean().exec()
        .then(function (endpoints) {

        endpoints.forEach(function (endpoint, i) {

            self.delete(endpoint._id, function (err) {
                if(err) {
                    self.callback(err);
                    return;
                }
            })
        });

        self.callback(undefined);   
    })
    .catch(function errorHandler (error) {
        self.callback(error);
        return;
    })
}

module.exports = controller;