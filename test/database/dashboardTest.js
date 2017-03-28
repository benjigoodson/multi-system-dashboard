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
            var validDash = factory.validDashboard();
            // Before each test add one dashboard to the database
            Dashboard(validDash).save(function(err, createdDash) {
                if(err || !createdDash) {
                    throw err;
                }

                done();
            });
        });
    });

    afterEach(function (done) {
        // After each test remove all contents in the database
        Dashboard.remove({}, function () {
            done();
        });
    });

    it('should be invalid if name is empty', function(done) {
        var model = new Dashboard();

        model.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should prevent duplicates', function(done) {
        var validDash = factory.validDashboard();
        
        Dashboard(validDash).save(function(err, createdDash) {
            if(err || !createdDash) {
                expect(err).to.exist;
            }

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.exist;

            done();
        });
    });

    it('should be valid', function(done) {

        var model = new Dashboard(factory.validDashboard());

        model.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should find one', function(done) {
 
        var validDash = factory.validDashboard();

        Dashboard.find({ name : validDash.name }).lean().exec().then(function(results) {
            expect(results).to.exist;
            expect(results).to.have.lengthOf(1);

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.not.exist;

            done();
        });
    
    });

    it('should return all, which will be two', function(done) {
        var validDash = factory.validDashboard();
        validDash.name = "DashboardTwo";

        Dashboard(validDash).save(function(err, createdDash) {
            if(err || !createdDash) {
                throw err;
            }

            done();
        });

        Dashboard.find({}).lean().exec().then(function(results) {
            expect(results).to.exist;
            expect(results).to.have.lengthOf(2);

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.not.exist;

            done();
        });
    });

    it('should update one', function(done) {
        var validDash = factory.validDashboard();
        
        Dashboard(validDash).save(function(err, createdDash) {
            if(err || !createdDash) {
                expect(err).to.exist;
            }

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.exist;

            done();
        });
    });

});