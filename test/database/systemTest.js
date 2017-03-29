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
                if(err || !createdSystem) {
                    throw err;
                }

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
        var model = new System();

        model.validate(function(err) {
            expect(err.errors.name).to.exist;
            done();
        });
    });

    it('should be invalid if contact is empty', function(done) {
        var model = new System();

        model.validate(function(err) {
            expect(err.errors.contact).to.exist;
            done();
        });
    });

    it('should be invalid if url is empty', function(done) {
        var model = new System();

        model.validate(function(err) {
            expect(err.errors.url).to.exist;
            done();
        });
    });

    it('should prevent duplicates', function(done) {
        var validSystem = factory.validSystem();
        
        System(validSystem).save(function(err, createdSystem) {
            if(err || !createdSystem) {
                expect(err).to.exist;
            }

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.exist;

            done();
        });
    });

    it('should be valid', function(done) {

        var model = new System(factory.validSystem());

        model.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should find one', function(done) {
 
        var validSystem = factory.validSystem();

        System.find({ name : validSystem.name }).lean().exec().then(function(results) {
            expect(results).to.exist;
            expect(results).to.have.lengthOf(1);

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.not.exist;

            done();
        });
    
    });

    it('should return all, which will be two', function(done) {
        var validSystem = factory.validSystem();
        validSystem.name = "SystemTwo";

        System(validSystem).save(function(err, createdSystem) {
            if(err || !createdSystem) {
                throw err;
            }

            done();
        });

        System.find({}).lean().exec().then(function(results) {
            expect(results).to.exist;
            expect(results).to.have.lengthOf(2);

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.not.exist;

            done();
        });
    });
});