// endpoint controller file
'use strict'

// Import models
var Endpoint = require('../models/endpoint');
var System = require('../models/system');
var WidgetController = require('../controllers/widget');

var controller = {};
    
controller.getAll = function getAll (callback) {
    var countPromises = []

    // Database query to get all endpoints
    Endpoint.find().lean().exec()
        .then(function endpointFind (endpoints) {

            // For each endpoint
            endpoints.forEach(function (endpoint, i) {

                // Get the system name and url
                // Add the promise to an array
                countPromises.push(controller.getSystemNameAndUrl(endpoint.parentSystem)
                    .then(function (system) {
                        // Set the system name and url
                        endpoint.systemName = system.name;
                        endpoint.fullUrl = system.url + endpoint.url;
                }))
            });

            // When all promises are complete
            Promise.all(countPromises).then(function completedPromises () {
                // Return the endpoints to the callback function
                callback(undefined, endpoints);      
                return;
            })
        })
        .catch(function errorHandler (error) {
            // Catch any errors return error to the calling function
            console.log("Error: " + error);
            callback(error);
        })

}

controller.get = function get (endpointId, callback) {

    // Create a query for id's matching the passed id
    var query = {_id : endpointId};

    // Database query to get an endpoint matchign the id
    Endpoint.findById(query).lean().exec().then(function endpointFindOne (endpoint) {

        // Call fucntion to get the system name and url
        controller.getSystemNameAndUrl(endpoint.parentSystem).then(function (system) {
            // Set the system name and url
            endpoint.systemName = system.name;
            endpoint.fullUrl = system.url + endpoint.url;

            // Return the endpoint to the callback function
            callback(undefined, endpoint);
        })

    })
    .catch(function errorHandler (error) {
        // Catch any errors return error to the calling function
        console.log("Error: " + error);
        callback(error);
    })
}

controller.getBasicEndpoints = function (systemId, callback) {

    var countPromises = []

    // Database query to get all endpoints matching the parent system id
    Endpoint.find({parentSystem : systemId}).lean().exec().then(function (endpoints) {

        var basicEndpoints = [];

        // For each endpoint
        endpoints.forEach(function (endpoint , i) {

            // Get the system name and url
            // Add the promises to an array
            countPromises.push(controller.getSystemNameAndUrl(endpoint.parentSystem)
                .then(function (system) {

                    // take the details and create an endpoint with basic details
                    basicEndpoints.push({
                        id : endpoint._id,
                        name : endpoint.name,
                        createdBy : endpoint.createdBy,
                        createdDate : endpoint.createdDate,
                        requiresParam : endpoint.requiresParam,
                        requestType : endpoint.requestType,
                        fullUrl : system.url + endpoint.url,
                        apiKey : endpoint.apiKey,
                        method : endpoint.method
                    })
            }))
        })

        // If all promises are complete
        Promise.all(countPromises).then(function completedPromises () {
            // Return the basic details to the callback function
            callback(undefined, basicEndpoints);      
            return;
        })

    })
    .catch(function errorHandler (error) {
        // Catch any errors return error to the calling function
        console.log("Error: " + error);
        callback(error);
    })

}

controller.getSystemNameAndUrl = function(systemId) {    
    // Get the system name and url
    return System.findOne({_id :  systemId}, "name url").lean().exec()
}

controller.create = function create (newEndpoint, callback) {

    // create a new endpoint that matches the Endpoint Schema
    var endpoint = new Endpoint(newEndpoint);

    // Database query to create a new endpoint
    endpoint.save(function(err, createdEndpoint) {

        // If there is an error, return it
        if(err) {
            callback(err);
            return;
        }

        // Return the created endpoint to the callback function
        callback(undefined, createdEndpoint);

    });
}

controller.update = function update (endpoint, callback) {
        
    // Create a query to match endpoints with the passed id
    var query = { "_id" : endpoint._id };

    // Database query to find one endpoitn and update it
    Endpoint.findOneAndUpdate(query, endpoint, {new: true}, function(err, updatedEndpoint) {

        // If there is an error, return it
        if(err) {
            callback(err);
            return;
        }

        // return the endpoint to the callback method
        callback(undefined, updatedEndpoint);

    });
}

controller.delete = function (endpointId, callback) {

    // Call widget controller method to remove delete widgets
    // that use this endpoint
    WidgetController.deleteByEndpoint(endpointId, function (err) {

        // If there is an error, return it
        if(err) {
            callback(err);
        } else {

            // Database query to remove the endpoints
            Endpoint.remove({ _id : endpointId }, function(err) {

                 // If there is an error, return it
                if(err) {
                    self.callback(err);
                    return;
                }

                callback();
            });
        }
    });
}

controller.deleteBySystem = function create (systemId, callback) {

    var self = this;

    // Create a varible to hold the callback function
    self.callback = callback;

    // Database query to return endpoints matching the system id
    Endpoint.find({ parentSystem : systemId }).lean().exec()
        .then(function (endpoints) {
        
            if(endpoints.length > 0) {
                // For each endpoint
                endpoints.forEach(function (endpoint, i) {

                    // Call the controlelrs delete method to remove them from the database
                    // This also removes any other entities that sue it
                    self.delete(endpoint._id, function (err) {

                        // If there is an error, return it
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
        console.log("Error: " + error);
        self.callback(error);
        return;
    })
}

module.exports = controller;