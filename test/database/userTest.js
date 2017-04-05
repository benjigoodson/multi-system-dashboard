// user database test file
'use strict'

// Imports
var mongoose = require('mongoose');
var expect = require('chai').expect;

var factory = require('../factory');

// Database models
var User = require('../../app/models/user');

mongoose.Promise = global.Promise;

before(function (done) {
    // Use a test database, this replicates more of a real scenario than mocking
    mongoose.createConnection("mongodb://localhost/dashboardapp_test", done);
});

after(function (done) {
    // close all connections to the database
    mongoose.connection.close(done);
});

describe('User model', function() {

    beforeEach(function (done) {
        // Make sure database is empty
        User.remove({}, function () {
            // Get a valid user
            var validUser = factory.validUser();
            // Before each test add one user to the database
            User(validUser).save(function(err, createdUser) {
                // Expect no errors
                expect(err).to.not.exist;

                // Expect user object to be returned
                expect(createdUser).to.exist;

                // Test done
                done();
            });
        });
    });

    afterEach(function (done) {
        // After each test remove all contents in the database
        User.remove({}, function () {
            done();
        });
    });

    it('should be invalid if forename is empty', function(done) {
        // Create a blank user
        var model = new User();

        // Validate
        model.validate(function(err) {
            // Expect an error for forename to be returned
            expect(err.errors.forename).to.exist;
            done();
        });
    });

    it('should be invalid if surname is empty', function(done) {
        // Create a blank user
        var model = new User();

        // Validate
        model.validate(function(err) {
            // Expect an error for surname to be returned
            expect(err.errors.surname).to.exist;
            done();
        });
    });

    it('should be invalid if email is empty', function(done) {
        // Create a blank user
        var model = new User();

        // Validate
        model.validate(function(err) {
            // Expect an error for email to be returned
            expect(err.errors.email).to.exist;
            done();
        });
    });

    it('should be invalid if password is empty', function(done) {
        // Create a blank user
        var model = new User();

        // Validate
        model.validate(function(err) {
            // Expect an error for password to be returned
            expect(err.errors.password).to.exist;
            done();
        });
    });

    it('should prevent email being repeated', function(done) {
        // Get a valid user
        var validUser = factory.validUser();

        // Change the forename
        validUser.forename = "Ben10";

        // Add to the database
        User(validUser).save(function(err, createdUser) {
            // Error should exist
            expect(err).to.exist;

            // A created user should not be returned
            expect(createdUser).to.not.exist

            done();
        }).catch(function errorHandler (error) {
            // Error should exist if catch is triggered
            expect(error).to.exist;
            done();
        });
    });

    it('should prevent duplicates', function(done) {
        // Get a valid user
        var validUser = factory.validUser();
        
        // Add the user to the database
        User(validUser).save(function(err, createdUser) {
            // Error should exist
            expect(err).to.exist;

            // A created user should not be returned
            expect(createdUser).to.not.exist

            done();
        }).catch(function errorHandler (error) {
            // Error should exist if catch is triggered
            expect(error).to.exist;
            done();
        });
    });

    it('should be valid', function(done) {

        // Get a valid user
        var model = new User(factory.validUser());

        // Validate
        model.validate(function(err) {
            // An error shouldn't exist
            expect(err).to.not.exist;
            done();
        });
    });

    it('should find one', function(done) {
 
        // Get a valid user
        var validUser = factory.validUser();

        // Return a user from the database
        User.find({ name : validUser.name }).lean().exec().then(function(results) {
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
        // Get a valid user
        var validUser = factory.validUser();
         // Change the name
        validUser.forename = "UserTwo";
         // Change the email
        validUser.email = "email2@email.com";

         // Add the user to the database
        User(validUser).save(function(err, createdUser) {
            // Expect no errors
            expect(err).to.not.exist;

            // Expect a user object back
            expect(createdUser).to.exist;

            done();
        });

        User.find({}).lean().exec().then(function(results) {
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