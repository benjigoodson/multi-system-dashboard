// system controller file
'use strict'

// Import models
var System = require('../models/system');
var Endpoint = require('../models/endpoint');

var controller = {};
    
controller.getAll = function getAllSystems (callback) {

    var countPromises = []

    System.find().lean().exec()
        .then(function systemFind (systems) {

            systems.forEach(function (system, i) {

                countPromises.push(controller.countEndpoints(system)
                    .then(function updateSystemCount (count) {
                        system.numEndpoints = count;
                    }))
            });

            Promise.all(countPromises).then(function completedPromises () {
                callback(undefined, systems);   
            })
        })
        .catch(function errorHandler (error) {
            callback(error);
        })

}

controller.getAllBasic = function getAllSystemsBasic (callback) {

    System.find().lean().exec().then(function systemFind (systems) {

        var basicSystems = [];

        if(!systems || systems.length == 0) {
            callback(undefined, basicSystems);
            return;
        }

        systems.forEach(function (system, i) {
            // Just get basic fields
            basicSystems.push({ id : system._id, name : system.name, url : system.url});
        });

        callback(undefined, basicSystems);

    })
    .catch(function errorHandler (error) {
        callback(error);
    })

}

controller.get = function getUniqueSystem (systemId, callback) {

    var query = {_id : systemId};

    System.findOne(query).lean().exec().then(function systemFindOne (system) {

        controller.countEndpoints(system).then( function(numEndpoints) {

            system.numEndpoints = numEndpoints;

            callback(undefined, system);
        });

    })
    .catch(function errorHandler (error) {
        callback(error);
    })

}

controller.countEndpoints = function getSystemEndpointCount (system) {

    // Count the endpoints
    return Endpoint.count({parentSystem :  system._id.toString()}).lean().exec()

}

controller.create = function create (newSystem, callback) {

    var system = System(newSystem);

    system.save(function(err, createdSystem) {
        if(err) {
            callback(err);
        }

        callback(undefined, createdSystem);

    });
}

controller.update = function create (updatedSystem, callback) {

    var query = { _id : updatedSystem._id };

    System.findOneAndUpdate(query, updatedSystem, {new: true}, function(err, system) {

        if(err) {
            console.log("Error: " + err);
            callback(err);
        }

        // return the message
        callback(undefined, {success : true, message : "System Updated.", data : system});

    });
}

controller.delete = function create (systemId, callback) {

    // Remove all endpoints
    Endpoint.remove({ parentSystem : systemId }, function(err) {

        // Remove the system
        System.remove({ _id : systemId }, function(err) {

            callback(err);

        });
    });

}


module.exports = controller;