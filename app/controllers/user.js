// User controller file
'use strict'

// Import models
var scrupt = require("scrypt");
var sharp = require('sharp');
var format = require('date-format');
var mailer = require('nodemailer');
var User = require('../models/user');

var self = this;

var controller = {};

controller.getByUsername = function getByUsername(username, callback) {

    // Database query for finding a user that matches the entered email
    User.findOne({ email: username }).lean().exec().then(function userFind(user) {

        // Return the user to the callback function
        callback(user);
        return;

    })
        .catch(function errorHandler(error) {
            // Catch any errors, return error to the calling function
            console.log("Error: " + error);
            callback(error);
        })

}

controller.create = function create(newUser, callback) {

    // Make first letter of names capital
    newUser.forename = newUser.forename.charAt(0).toUpperCase() + newUser.forename.slice(1);
    newUser.surname = newUser.surname.charAt(0).toUpperCase() + newUser.surname.slice(1);

    // Make email lowercase
    newUser.email = newUser.email.toLowerCase();

    // Set the created date
    newUser.createdDate = format('dd/MM/yyyy', new Date());

    // Get crypto libary
    var scrypt = require('scrypt');

    // Set up memory params
    var cryptParams = scrypt.paramsSync(0.1);

    // Hash user password
    var hash = scrypt.kdfSync(newUser.password, cryptParams);

    // Convert the hash to a base64 string
    newUser.password = hash.toString("base64");

    // Create a new user matching the User Schema
    var user = User(newUser);

    // Database query for creating a new user
    user.save(function (err, createdUser) {

        // If an error occurs, return it to the callback function
        if (err) {
            callback(err.message);
            return;
        }

        // Return the created user to the callback function
        callback(undefined, createdUser);

    });

};

controller.update = function update(user, callback) {

    // Create a query for matching a user to a user id
    var query = { "_id": user._id };

    // Database query for updating a user
    User.findOneAndUpdate(query, user, { new: true }, function (err, user) {

        // If an error occurs, return it to the callback function
        if (err) {
            callback(err);
            return;
        }

        // return the result
        callback(undefined, { success: true, message: "User Updated.", data: user });
    });

}

controller.getStats = function getStats(userId, callback) {

    // Import database services for each entity
    var ObjectId = require('mongoose').Types.ObjectId;

    var System = require('../models/system');
    var Endpoint = require('../models/endpoint');
    var Widget = require('../models/widget');

    // Create blank varibles
    self.systemStats;
    self.endpointStats;
    self.widgetStats;

    // Create a query that matches the user id
    var query = { "createdBy.id": new ObjectId(userId) };

    var countPromises = [];

    // Count systems that match the query
    // Add the promise to the array
    countPromises.push(System.count(query, function (err, systemCount) {
        self.systemStats = systemCount;
    }));

    // Count systems that match the query   
    // Add the promise to the array
    countPromises.push(Endpoint.count(query, function (err, endpointCount) {
        self.endpointStats = endpointCount;
    }));

    // Count systems that match the query
    // Add the promise to the array
    countPromises.push(Widget.count(query, function (err, widgetCount) {
        self.widgetStats = widgetCount;
    }));

    // Once all promises have been completed
    Promise.all(countPromises).then(function completedPromises() {
        // Return the results to the callback function
        callback(undefined, { system: self.systemStats, endpoint: self.endpointStats, widget: self.widgetStats });
    });

}

controller.saveImage = function saveImage(userId, userImage, callback) {

    // Rename image
    var imageName = userId;

    // Save image to a file
    userImage.mv('public/userImages/' + userId + '.jpg', function (err) {

        // If an error occurs, return it to the callback function
        if (err) {
            callback(err);
            return;
        }

        // Use sharp to resize image to 128 x 128 in the resized folder
        sharp('public/userImages/' + userId + '.jpg')
            .resize(128, 128)
            .toFile('public/userImages/resized/' + userId + '.jpg', function (err) {

                // If an error occurs, return it to the callback function
                if (err) {
                    callback(err);
                    return;
                }

                // Update user with new image name
                User.findByIdAndUpdate(userId, { $set: { image: imageName } }, { new: true }, function (err, user) {

                    // If an error occurs, return it to the callback function
                    if (err) {
                        callback(err);
                        return;
                    }

                    callback(undefined, user);

                });
            });
    });

}

controller.forgotPassword = function forgotPassword(email, callback) {

    var self = this;

    // See if email address is in the system
    controller.getByUsername(email, function (user) {
        // If user has been found
        if (user) {
            self.user = user;

            // Set details for resetting
            self.user.resetPasswordToken = generateToken(32);
            // 1 hour
            self.user.resetPasswordExpires = Date.now() + 3600000;

            // Update user
            controller.update(self.user, function (undefined, response) {

                if (response.success == true) {
                    // Send email
                    sendEmail("forgottenPassword.html", self.user.resetPasswordToken, self.user.email, "Forgotten Password");
                }

                // Don't return any errors / issues to the user.
                // Only a positive message
                callback(undefined, "If the username is valid you will receive an email with instructions on resetting the password.");

            });


        } else {
            // Don't return any errors / issues to the user.
            // Only a positive message
            callback(undefined, "If the username is valid you will receive an email with instructions on resetting the password.");
        }
    });

}

controller.validatePasswordToken = function validatePasswordToken (resetToken, callback) {

    var query = { resetPasswordToken : resetToken, resetPasswordExpires : { $gt : Date.now() } };

    // Is there a user with this token set and it hasn't expired
    User.find(query).lean().exec().then(function userFindForToken(users) {

        // Found a user with a valid token
        if (users && users.length > 0) {

            // Confirm that the token is valid
            callback(undefined, "Token is valid.");

        } else {

            // Token not found or has expired
            // Inform the user
            callback("Token cannot be found or has expired. Please request a new password reset.");
            return;

        }
    })
    .catch(function errorHandler(error) {
        // Catch any errors, return error to the calling function
        console.log("Error: " + error);
        callback(error);
        return;
    });

}

function generateToken(num_bytes) {
    return require('crypto').randomBytes(num_bytes).toString('hex');
}

controller.resetPassword = function resetPassword(token, password, callback) {

    // Get the user details for the token
    User.findOne({resetPasswordToken : token}).lean().exec().then(function(user) {

        if(!user) {
            // Catch any errors, return error to the calling function
            console.log("Error: " + "No user found for that token.");
            callback(error);
            return;
        }

        // Update the user password
        // Get crypto libary
        var scrypt = require('scrypt');

        // Set up memory params
        var cryptParams = scrypt.paramsSync(0.1);

        // Hash new password
        var hash = scrypt.kdfSync(password, cryptParams);

        // Convert the hash to a base64 string
        user.password = hash.toString("base64");

        // Remove the reset properties
        user.resetPasswordExpires = 0;
        user.resetPasswordToken = "";

        // Update the user in the database
        User.findByIdAndUpdate(user._id, user, { new: true }, function (err, user) {

            // If an error occurs, return it to the callback function
            if (err) {
                callback(err);
                return;
            }

            callback(undefined, "Your password has been successfully updated.");

        });
    });

}

function sendEmail(templateName, token, toEmail, subject) {

    var emailConfig = require('../config/email');

    // Set the email password as the enviromental varible
    emailConfig.pass = process.env.emailPassword;

    // Configure the email service
    var transporter = mailer.createTransport({
        service: emailConfig.service,
        auth: {
            user: emailConfig.user,
            pass: emailConfig.pass
        }
    });

    var fs = require('fs');
    var path = require('path');

    fs.readFile(path.normalize(__dirname + '/../templates/' + templateName), 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            exit;
        }

        // Construct the email
        var emailContent = data;

        // Repalce the user's email address
        emailContent = emailContent.replace(/{{email_address}}/g, toEmail);

        // Replace the action URL
        emailContent = emailContent.replace(/{{action_url}}/g, "http://localhost:3000/#/forgot/" + token);

        // Set the email options
        var mailOptions = {
            from: emailConfig.from,
            to: toEmail,
            subject: subject,
            html: emailContent
        };

        // Send the email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });

}

module.exports = controller;