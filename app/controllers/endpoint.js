// endpoint controller file
'use strict'

// Import models
var Endpoint = require('../models/endpoint');
var System = require('../models/system');
var WidgetController = require('../controllers/widget');

var controller = {};
    
controller.getAll = function getAll (callback) {
    var countPromises = []

    Endpoint.find().lean().exec()
        .then(function endpointFind (endpoints) {

            endpoints.forEach(function (endpoint, i) {

                countPromises.push(controller.getSystemNameAndUrl(endpoint.parentSystem)
                    .then(function (system) {
                        endpoint.systemName = system.name;
                        endpoint.fullUrl = system.url + endpoint.url;
                }))
            });

            Promise.all(countPromises).then(function completedPromises () {
                callback(undefined, endpoints);      
                return;
            })
        })
        .catch(function errorHandler (error) {
            callback(error);
        })

}

controller.get = function get (endpointId, callback) {

    var query = {_id : endpointId};

    Endpoint.findById(query).lean().exec().then(function endpointFindOne (endpoint) {

        controller.getSystemNameAndUrl(endpoint.parentSystem).then(function (system) {
            endpoint.systemName = system.name;
            endpoint.fullUrl = system.url + endpoint.url;

            callback(undefined, endpoint);
        })

    })
    .catch(function errorHandler (error) {
        callback(error);
    })
}

controller.getBasicEndpoints = function (systemId, callback) {

    var countPromises = []

    Endpoint.find({parentSystem : systemId}).lean().exec().then(function (endpoints) {

        var basicEndpoints = [];

        endpoints.forEach(function (endpoint , i) {

            countPromises.push(controller.getSystemNameAndUrl(endpoint.parentSystem)
                .then(function (system) {

                    basicEndpoints.push({
                        id : endpoint._id,
                        name : endpoint.name,
                        createdBy : endpoint.createdBy,
                        createdDate : endpoint.createdDate,
                        requiresParam : endpoint.requiresParam,
                        requestType : endpoint.requestType,
                        fullUrl : system.url + endpoint.url,
                        method : endpoint.method
                    })
            }))
        })

        Promise.all(countPromises).then(function completedPromises () {
            callback(undefined, basicEndpoints);      
            return;
        })

    })
    .catch(function errorHandler (error) {
        callback(error);
    })

}

controller.getSystemNameAndUrl = function(systemId) {    
    // Get the system name and url
    return System.findOne({_id :  systemId}, "name url").lean().exec()
}

controller.create = function create (newEndpoint, callback) {

    var endpoint = Endpoint(newEndpoint);

    endpoint.save(function(err, createdEndpoint) {
        if(err) {
            callback(err);
            return;
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

    WidgetController.deleteByEndpoint(endpointId, function (err) {
        if(err) {
            callback(err);
        } else {
            Endpoint.remove({ _id : endpointId }, function(err) {
                callback(err);
                return;
            });
        }
    })
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

        self.callback();   
    })
    .catch(function errorHandler (error) {
        self.callback(error);
        return;
    })
}

module.exports = controller;