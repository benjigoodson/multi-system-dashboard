// endpoint database test file
'use strict'

// Imports
var mongoose = require('mongoose');
var expect = require('chai').expect;

var factory = require('../factory');

// Database models
var Endpoint = require('../../app/models/endpoint');

mongoose.Promise = global.Promise;

before(function (done) {
    // Use a test database, this replicates more of a real scenario than mocking
    mongoose.createConnection("mongodb://localhost/dashboardapp_test", done);
});


after(function (done) {
    // Close all connections to the database
    mongoose.connection.close(done);
});

describe('Endpoint model', function() {

    beforeEach(function (done) {
        // Make sure database is empty
        Endpoint.remove({}, function () {
            var validEndpoint = factory.validEndpoint();
            // Before each test add one endpoint to the database
            Endpoint(validEndpoint).save(function(err, createdEndpoint) {

                // Expect no errors
                expect(err).to.not.exist;

                // Expect endpoint object to be returned
                expect(createdEndpoint).to.exist;

                done();
            });
        });
    });

    afterEach(function (done) {
        // After each test remove all contents in the database
        Endpoint.remove({}, function () {
            done();
        });
    });

    it('should be invalid if name is empty', function(done) {
        // Create a blank endpoint
        var model = new Endpoint();

        // Validate the endpoint
        model.validate(function(err) {
            // Check an error for an invalid name is returned
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if description is empty', function(done) {
        // Create a blank endpoint
        var model = new Endpoint();

        // Validate the endpoint
        model.validate(function(err) {
            // Check an error for an invalid description is returned
            expect(err.errors.description).to.exist;
            done();
        });
    });

    it('should be invalid if parentSystem is empty', function(done) {
        // Create a blank endpoint
        var model = new Endpoint();

        // Validate the endpoint
        model.validate(function(err) {
            // Check an error for an invalid parentSystem is returned
            expect(err.errors.parentSystem).to.exist;
            done();
        });
    });

    it('should be invalid if url is empty', function(done) {
        // Create a blank endpoint
        var model = new Endpoint();

        // Validate the endpoint
        model.validate(function(err) {
            // Check an error for an invalid url is returned
            expect(err.errors.url).to.exist;
            done();
        });
    });

    it('should be invalid if requestType is empty', function(done) {
        // Create a blank endpoint
        var model = new Endpoint();

        // Validate the endpoint
        model.validate(function(err) {
            // Check an error for an invalid requestType is returned
            expect(err.errors.requestType).to.exist;
            done();
        });
    });

    it('should prevent duplicates', function(done) {
        // Get a valid endpoint
        var validEndpoint = factory.validEndpoint();
        
        // Add the endpoint to the database
        Endpoint(validEndpoint).save(function(err, createdEndpoint) {
            // Error should exist
            expect(err).to.exist;

            // A created endpoint should not be returned
            expect(createdEndpoint).to.not.exist

            done();
        }).catch(function errorHandler (error) {
            // Error should exist if catch is triggered
            expect(error).to.exist;
            done();
        });
    });

    it('should be valid', function(done) {

        // Get a valid endpoint
        var model = new Endpoint(factory.validEndpoint());

        // Validate
        model.validate(function(err) {
            // Error shouldn't exist
            expect(err).to.not.exist;
            done();
        });
    });

    it('should find one', function(done) {
 
        // Get a valid endpoint
        var validEndpoint = factory.validEndpoint();

        // Return a endpoint from the database
        Endpoint.find({ name : validEndpoint.name }).lean().exec().then(function(results) {
           // Results should exist
            expect(results).to.exist;
            
            // One result
            expect(results).to.have.lengthOf(1);

            done();
        }).catch(function errorHandler (error) {
            // No errors
            expect(error).to.not.exist;
            done();
        });
    
    });

    it('should return all, which will be two', function(done) {
        // Get a valid endpoint
        var validEndpoint = factory.validEndpoint();
        // Change the name
        validEndpoint.name = "EndpointTwo";

        // Add the endpoint to the database
        Endpoint(validEndpoint).save(function(err, createdEndpoint) {
            // Expect no errors
            expect(err).to.not.exist;

            // Expect a endpoint object back
            expect(createdEndpoint).to.exist;

            done();
        });

        Endpoint.find({}).lean().exec().then(function(results) {
            // Expect results back
            expect(results).to.exist;

            // Reults have two objects
            expect(results).to.have.lengthOf(2);

            done();
        }).catch(function errorHandler (error) {
            // Expect no error
            expect(error).to.not.exist;
            done();
        });
    });
});