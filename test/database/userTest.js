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
            var validUser = factory.validUser();
            // Before each test add one user to the database
            User(validUser).save(function(err, createdUser) {
                if(err || !createdUser) {
                    throw err;
                }

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
        var model = new User();

        model.validate(function(err) {
            expect(err.errors.forename).to.exist;
            done();
        });
    });

    it('should be invalid if surname is empty', function(done) {
        var model = new User();

        model.validate(function(err) {
            expect(err.errors.surname).to.exist;
            done();
        });
    });

    it('should be invalid if email is empty', function(done) {
        var model = new User();

        model.validate(function(err) {
            expect(err.errors.email).to.exist;
            done();
        });
    });

    it('should be invalid if password is empty', function(done) {
        var model = new User();

        model.validate(function(err) {
            expect(err.errors.password).to.exist;
            done();
        });
    });

    it('should prevent email being repeated', function(done) {
        var validUser = factory.validUser();

        validUser.forename = "Ben10";

        User(validUser).save(function(err, createdUser) {
            if(err || !createdUser) {
                expect(err).to.exist;
            }

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.exist;

            done();
        });
    });

    it('should prevent duplicates', function(done) {
        var validUser = factory.validUser();
        
        User(validUser).save(function(err, createdUser) {
            if(err || !createdUser) {
                expect(err).to.exist;
            }

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.exist;

            done();
        });
    });

    it('should be valid', function(done) {

        var model = new User(factory.validUser());

        model.validate(function(err) {
            expect(err).to.not.exist;
            done();
        });
    });

    it('should find one', function(done) {
 
        var validUser = factory.validUser();

        User.find({ name : validUser.name }).lean().exec().then(function(results) {
            expect(results).to.exist;
            expect(results).to.have.lengthOf(1);

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.not.exist;

            done();
        });
    
    });

    it('should return all, which will be two', function(done) {
        var validUser = factory.validUser();
        validUser.name = "UserTwo";
        validUser.email = "email2@email.com";

        User(validUser).save(function(err, createdUser) {
            if(err || !createdUser) {
                throw err;
            }

            done();
        });

        User.find({}).lean().exec().then(function(results) {
            expect(results).to.exist;
            expect(results).to.have.lengthOf(2);

            done();
        }).catch(function errorHandler (error) {
            expect(error).to.not.exist;

            done();
        });
    });
});