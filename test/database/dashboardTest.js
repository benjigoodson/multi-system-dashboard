// dashboard database test file
'use strict'

// Imports
var mongoose = require('mongoose');
var expect = require('chai').expect;

var factory = require('../factory');

// Database models
var Dashboard = require('../../app/models/dashboard');

mongoose.Promise = global.Promise;

before(function (done) {
    // Use a test database, this replicates more of a real scenario than mocking
    mongoose.createConnection("mongodb://localhost/dashboardapp_test", done);
});

after(function (done) {
    // close all connections to the database
    mongoose.connection.close(done);
});

describe('Dashboard model', function() {

    beforeEach(function (done) {
        // Make sure database is empty
        Dashboard.remove({}, function () {
            // Get a valid dashboard 
            var validDash = factory.validDashboard();
            // Before each test add one dashboard to the database
            Dashboard(validDash).save(function(err, createdDash) {
                // Expect no errors
                expect(err).to.not.exist;

                // Expect dashboard object to be returned
                expect(createdDash).to.exist;

                // Test done
                done();
            });
        });
    });

    afterEach(function (done) {
        // After each test remove all contents in the database
        Dashboard.remove({}, function () {
            // Test done
            done();
        });
    });

    it('should be invalid if name is empty', function(done) {
        var model = new Dashboard();

        // Create a blank dashboard and validate it
        model.validate(function(err) {
            // Check there is an error for having a blank name
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should prevent duplicates', function(done) {
        // Get a valid dashboard
        var validDash = factory.validDashboard();
        
        // Add the dashboard to the database
        Dashboard(validDash).save(function(err, createdDash) {
            // Error should exist
            expect(err).to.exist;

            // A created dashboard should not be returned
            expect(createdDash).to.not.exist

            done();
        }).catch(function errorHandler (error) {
            // Error should exist if catch is triggered
            expect(error).to.exist;
            done();
        });
    });

    it('should be valid', function(done) {

        // Get a valid dashboard
        var model = new Dashboard(factory.validDashboard());

        // Validate
        model.validate(function(err) {
            // An error shouldn't exist
            expect(err).to.not.exist;
            done();
        });
    });

    it('should find one', function(done) {
 
        // Get a valid dashboard
        var validDash = factory.validDashboard();

        // Return a dashboard from the database
        Dashboard.find({ name : validDash.name }).lean().exec().then(function(results) {
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
        // Get a valid dashboard 
        var validDash = factory.validDashboard();
        // Change the name
        validDash.name = "DashboardTwo";

        // Add the dashboard to the database
        Dashboard(validDash).save(function(err, createdDash) {
            // Expect no errors
            expect(err).to.not.exist;

            // Expect a dashboard object back
            expect(createdDash).to.exist;

            done();
        });

        Dashboard.find({}).lean().exec().then(function(results) {
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