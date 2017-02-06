'use strict'

var SystemModule = angular.module('SystemModule');

// Imports
SystemModule.constant("moment", moment);

SystemModule.controller('SystemController', SystemController);

SystemController.$inject = ['$scope', '$location', 'UserService', 'SystemService', 'notificationService'];
function SystemController($scope, $location, UserService, SystemService, notificationService) { 

	var self = this;

	this.createSystem = function() {

		// Add a trailing '/' to url
		if ($scope.system.url.charAt($scope.system.url.length - 1) != '/') {
			$scope.system.url = $scope.system.url + '/';
		}

		SystemService.create($scope.system).then(function(response) {
			$location.path("/systems");
		}, function(error) {

		});
	};

	this.getSystems = function() {
		SystemService.getAll().then(function(data) {
			$scope.systems = data;
		});
	};

	this.deleteSystem = function(systemId) {

		SystemService.delete(systemId).then(function(response) {
			if(response.success) {
				notificationService.success(response.message);

				// Refresh table
				self.getSystems();
			}
		});
	};

	this.setupCreatePage = function() {
		$scope.system = {};

		// Set default status value
		$scope.system.status = "online";

		$scope.system.createdDate = moment().format('DD/MM/YYYY');
		$scope.system.createdBy = UserService.getCurrentUser().forename;
	};

};