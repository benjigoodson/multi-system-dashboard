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

controller.delete = function create (systemId, callback) {

    System.remove({ _id : systemId }, function(err) {

        callback(err);

    });
}


module.exports = controller;