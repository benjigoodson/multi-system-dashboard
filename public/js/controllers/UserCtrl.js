'use strict'

var UserModule = angular.module('UserModule');

UserModule.controller('UserController', UserController);

UserController.$inject = ['$scope', 'UserService', 'notificationService'];
function UserController($scope,UserService, notificationService) {

    var self = this;

    this.getCurrentUser = function() {
         
        UserService.getCurrentUser().then(function(user) {
            $scope.user = user;
        });
    };

    this.initProfile = function() {

        // Make sure a user is loaded
        this.getCurrentUser();

        this.userStats = {};

        this.getUserStats($scope.user._id);

        $scope.edit = false;

    };
    
    this.getUserStats = function(userId) {

        UserService.getStats(userId).then(function(response) {

            self.userStats = response.stats;

        });

    };

    this.toggleEdit = function() {

        if($scope.edit == true) {
            $scope.edit = false;
        } else {
            $scope.edit = true;
        }

    };

    this.saveUser = function() {

        var user = $scope.user;

        UserService.update(user._id, user).then(function(response) {

            if(response.success == true) {
				notificationService.info(response.message);
                $scope.user = response.data;
            } else {
                this.errorHandler(response.message);
            }

            self.toggleEdit();
        });

    };

    this.errorHandler = function(error) {
		notificationService.error(error);
	};

    // Run as soon as this controller starts
    this.getCurrentUser();

};