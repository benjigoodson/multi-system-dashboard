// system database test file
'use strict'

// Imports
var mongoose = require('mongoose');
var expect = require('chai').expect;

var factory = require('../factory');

// Database models
var System = require('../../app/models/system');

// Use a test database, this replicates more of a real scenario than mocking
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/dashboardapp_test");

describe('System model', function() {

    beforeEach(function (done) {
        // Make sure database is empty
        System.remove({}, function () {
            var validSystem = factory.validSystem();
            // Before each test add one system to the database
            System(validSystem).save(function(err, createdSystem) {
                // Expect no errors
                expect(err).to.not.exist;

                // Expect system object to be returned
                expect(createdSystem).to.exist;

                done();
            });
        });
    });

    afterEach(function (done) {
        // After each test remove all contents in the database
        System.remove({}, function () {
            done();
        });
    });

    it('should be invalid if name is empty', function(done) {
        // Create a blank system
        var model = new System();

        // Validate the model
        model.validate(function(err) {
            // Expect an error to be thrown for a blank name
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if contact is empty', function(done) {
        // Create a blank system
        var model = new System();

        // Validate the model
        model.validate(function(err) {
            // Expect an error to be thrown for a blank contact
            expect(err.errors.contact).to.exist;
            done();
        });
    });

    it('should be invalid if url is empty', function(done) {
        // Create a blank system
        var model = new System();

        // Validate the model
        model.validate(function(err) {
            // Expect an error to be thrown for a blank url
            expect(err.errors.url).to.exist;
            done();
        });
    });

    it('should prevent duplicates', function(done) {
        // Get a valid system
        var validSystem = factory.validSystem();
        
        System(validSystem).save(function(err, createdSystem) {
            // Error should exist
            expect(err).to.exist;

            // A created system should not be returned
            expect(createdSystem).to.not.exist

            done();
        }).catch(function errorHandler (error) {
            // Error should exist if catch is triggered
            expect(error).to.exist;
            done();
        });
    });

    it('should be valid', function(done) {

        // Get a valid system
        var model = new System(factory.validSystem());

        // Validate
        model.validate(function(err) {
            // An error shouldn't exist
            expect(err).to.not.exist;
            done();
        });
    });

    it('should find one', function(done) {
 
        // Get a valid system
        var validSystem = factory.validSystem();

        // Return a system from the database
        System.find({ name : validSystem.name }).lean().exec().then(function(results) {
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
        // Get a valid system
        var validSystem = factory.validSystem();

        // Change the name
        validSystem.name = "SystemTwo";

        // Add the system to the database
        System(validSystem).save(function(err, createdSystem) {
            // Expect no errors
            expect(err).to.not.exist;

            // Expect a system object back
            expect(createdSystem).to.exist;

            done();
        });

        System.find({}).lean().exec().then(function(results) {
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