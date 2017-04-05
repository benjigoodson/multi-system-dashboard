// system controller file
'use strict'

// Import models
var System = require('../models/system');
var Endpoint = require('../models/endpoint');
var EndpointController = require('../controllers/endpoint');

var controller = {};
    
controller.getAll = function getAllSystems (callback) {

    var countPromises = []

    // Database query to get all systems
    System.find().lean().exec()
        .then(function systemFind (systems) {

            // For each system
            systems.forEach(function (system, i) {

                // Count the endpoints for each system
                // Add the promise to an array
                countPromises.push(controller.countEndpoints(system)
                    .then(function updateSystemCount (count) {
                        // set the number of number of endpoints]
                        system.numEndpoints = count;
                    }))
            });

            // If all promises are completed
            Promise.all(countPromises).then(function completedPromises () {
                // Return the systems
                callback(undefined, systems);   
                return;
            })
        })
        .catch(function errorHandler (error) {
            // Catch any errors and return the error
            console.log("Error: " + error);
            callback(error);
        })

}

controller.getAllBasic = function getAllSystemsBasic (callback) {

    // Database query to get all systems
    System.find().lean().exec().then(function systemFind (systems) {

        var basicSystems = [];

        // If no systems return an empty array
        if(!systems || systems.length == 0) {
            callback(undefined, basicSystems);
            return;
        }

        // For each system
        systems.forEach(function (system, i) {
            // Just get basic fields
            basicSystems.push({ id : system._id, name : system.name, url : system.url});
        });

        // Return the basic details to the calling function
        callback(undefined, basicSystems);

    })
    .catch(function errorHandler (error) {
        // Catch any errors and return to the calling function
        console.log("Error: " + error);
        callback(error);
    })

}

controller.get = function getUniqueSystem (systemId, callback) {

    // Create the database query
    var query = {_id : systemId};

    // Database query to return one system matching the id
    System.findOne(query).lean().exec().then(function systemFindOne (system) {

        // Count endpoints for the system
        controller.countEndpoints(system).then( function(numEndpoints) {

            // Add the number of endpoints
            system.numEndpoints = numEndpoints;

            // Return the system to the calling function
            callback(undefined, system);
        });

    })
    .catch(function errorHandler (error) {
        // Catch any errors return error to the calling function
        console.log("Error: " + error);
        callback(error);
    })

}

controller.countEndpoints = function getSystemEndpointCount (system) {

    // Database query to count the endpoints for a system id
    return Endpoint.count({parentSystem :  system._id.toString()}).lean().exec()

}

controller.create = function create (newSystem, callback) {

    // Create a new system matching the System Schema
    var system = new System(newSystem);

    // Database query to create a new system
    system.save(function(err, createdSystem) {

        // If there is an error, return it
        if(err) {
            console.log("Error: " + err);
            callback(err);
            return;
        }

        // Return the created system to the calling function
        callback(undefined, createdSystem);

    });
}

controller.update = function update (updatedSystem, callback) {

    // Create the database query for system id's matching the passed id 
    var query = { _id : updatedSystem._id };

    // Database query to find and update one system
    System.findOneAndUpdate(query, updatedSystem, {new: true}, function(err, system) {

        // If there is an error, return it
        if(err) {
            console.log("Error: " + err);
            callback(err);
            return;
        }

        // Return the message
        callback(undefined, {success : true, message : "System Updated.", data : system});

    });
}

controller.delete = function create (systemId, callback) {

    // Remove all endpoint using this system id
    EndpointController.deleteBySystem(systemId, function(err) {

        // If there is an error, return it
        if(err) {
            console.log("Error: " + err);
            callback(err)
            return;
        }

        // Remove the system
        System.remove({ _id : systemId }, function(err) {

            // If there is an error, return it
            if(err) {
                console.log("Error: " + err);
                callback(err);
                return;
            }

            // Return to the callback function
            callback();

        });
    });

}


module.exports = controller;