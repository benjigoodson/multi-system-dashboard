// endpoint database test file
'use strict'

// Imports
var mongoose = require('mongoose');
var expect = require('chai').expect;

var factory = require('../factory');

// Database models
var Endpoint = require('../../app/models/endpoint');

// Use a test database, this replicates more of a real scenario than mocking
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/dashboardapp_test");

describe('Endpoint model', function() {

    beforeEach(function (done) {
        // Make sure database is empty
        Endpoint.remove({}, function () {
            var validEndpoint = factory.validEndpoint();
            // Before each test add one endpoint to the database
            Endpoint(validEndpoint).save(function(err, createdEndpoint) {
                if(err || !createdEndpoint) {
                    throw err;
                }

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
        var model = new Endpoint();

        model.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if description is empty', function(done) {
        var model = new Endpoint();

        model.validate(function(err) {
            expect(err.errors.description).to.exist;
            done();
        });
    });

    it('should be invalid if parentSystem is empty', function(done) {
        var model = new Endpoint();

        model.validate(function(err) {
            expect(err.errors.parentSystem).to.exist;
            done();
        });
    });

    it('should be invalid if url is empty', function(done) {
        var model = new Endpoint();

        model.validate(function(err) {
            expect(err.errors.url).to.exist;
            done();
        });
    });

    it('should be invalid if requestType is empty', function(done) {
        var model = new Endpoint();

        model.validate(function(err) {
            expect(err.errors.requestType).to.exist;
            done();
        });
    });

    it('should be valid', function(done) {

        var model = new Endpoint(factory.validEndpoint());

        model.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should find one', function(done) {
 
        var validEndpoint = factory.validEndpoint();

        Endpoint.find({ name : validEndpoint.name }).lean().exec().then(function(results) {
            expect(results).to.exist;
            expect(results).to.have.lengthOf(1);

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.not.exist;

            done();
        });
    
    });

    it('should return all which, will be two', function(done) {
        var validEndpoint = factory.validEndpoint();
        validEndpoint.name = "EndpointTwo";

        Endpoint(validEndpoint).save(function(err, createdEndpoint) {
            if(err || !createdEndpoint) {
                throw err;
            }

            done();
        });

        Endpoint.find({}).lean().exec().then(function(results) {
            expect(results).to.exist;
            expect(results).to.have.lengthOf(2);

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.not.exist;

            done();
        });
    });

    it('should prevent duplicates', function(done) {
        var validEndpoint = factory.validEndpoint();
        
        Endpoint(validEndpoint).save(function(err, createdEndpoint) {
            if(err || !createdEndpoint) {
                expect(err).to.exist;
            }

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.exist;

            done();
        });
    });
});