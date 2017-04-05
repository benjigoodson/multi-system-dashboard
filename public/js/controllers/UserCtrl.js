'use strict'

var UserModule = angular.module('UserModule');

UserModule.controller('UserController', UserController);

UserController.$inject = ['$scope', 'UserService', 'notificationService'];
function UserController($scope, UserService, notificationService) {

    var self = this;

    this.getCurrentUser = function() {
        
        // Get the current user
        UserService.getCurrentUser().then(function(user) {
            $scope.user = user;
        });
    };

    this.initProfile = function() {

        // Make sure a user is loaded
        this.getCurrentUser();

        this.userStats = {};

        // Get the user stats
        this.getUserStats($scope.user._id);

        $scope.edit = false;

    };
    
    this.getUserStats = function(userId) {

        // Get user stats
        UserService.getStats(userId).then(function(response) {

            self.userStats = response.stats;

        });

    };

    this.toggleEdit = function() {

        // Toggle between editing and not editing
        if($scope.edit == true) {
            $scope.edit = false;
        } else {
            $scope.edit = true;
        }

    };

    this.saveUser = function() {

        var user = $scope.user;

        // Update the user
        UserService.update(user._id, user).then(function(response) {

            if(response.success == true) {
                // Display a message
				notificationService.info(response.message);
                $scope.user = response.data;
            } else {
                // Display an error
                this.errorHandler(response.message);
            }

            self.toggleEdit();
        });

    };

    this.errorHandler = function(error) {
        // Display an error
		notificationService.error(error);
	};

    // Run as soon as this controller starts
    this.getCurrentUser();

};