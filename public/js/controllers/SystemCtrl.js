'use strict'

var SystemModule = angular.module('SystemModule');

// Imports
SystemModule.constant("moment", moment);

SystemModule.controller('SystemController', SystemController);

SystemController.$inject = ['$scope', '$location', '$routeParams', 'UserService', 'SystemService', 'EndpointService', 'notificationService'];
function SystemController($scope, $location, $routeParams, UserService, SystemService, EndpointService, notificationService) { 

	var self = this;

	this.createSystem = function() {

		// Add a trailing '/' to url
		if ($scope.system.url.charAt($scope.system.url.length - 1) != '/') {
			$scope.system.url = $scope.system.url + '/';
		}

		SystemService.create($scope.system).then(function(response) {
			if(response.success) {
				notificationService.success(response.message);
				$location.path("/system/" + response.data._id);
			} else {
				self.errorHandler("Unable to create system:" + response.message);
			}
		}, function(error) {
			self.errorHandler("Unable to create system:" + response.message);
		});
	};

	this.getSystems = function() {
		SystemService.getAll().then(function(data) {
			$scope.systems = data;
		});
	};

	this.initEdit = function() {

		// Set the id
		this.id = $routeParams.system_id;

		SystemService.get(this.id).then(function(data) {
			self.system = data;

			if(self.system.numEndpoints > 0) {
				// Get all endpoints that are saved for this system
				EndpointService.getBasicEndpoints(self.system._id).then(function(endpoints) {
					self.endpoints = endpoints;
				});
			}

		});
	};

	this.deleteSystemFromEdit = function(systemId) {
		this.deleteSystem(systemId).then(function(response) {
			if(response.success) {
				notificationService.success(response.message);
				$location.path("/systems");
			} else {
				self.errorHandler("Unable to delete system:" + response.message);
			}
		});
	};

	this.deleteSystemFromViewAll = function(systemId) {
		this.deleteSystem(systemId).then(function(response) {
			if(response.success) {
				notificationService.success(response.message);
				
				self.getSystems();
			} else {
				self.errorHandler("Unable to delete system:" + response.message);
			}
		});
	}

	this.deleteSystem = function(systemId) {

		return SystemService.delete(systemId);
	};

	this.saveSystem = function(system) {

		SystemService.update(system).then(function(response) {
			if(response.success) {
				notificationService.success(response.message);
				self.setEdit();
			} else {
				self.errorHandler("Unable to update system:" + response.message);
			}

		}, function(error) {
			self.errorHandler("Unable to update system:" + error.message);
		});
	};

	this.setupCreatePage = function() {
		$scope.system = {};

		// Set default status value
		$scope.system.status = "online";

		$scope.system.createdDate = moment().format('DD/MM/YYYY');

		UserService.getCurrentUser().then(function(user) {
			$scope.system.createdBy = user.forename;
		})
	};

	this.setEdit = function() {
		if($scope.edit == true) {
			$scope.edit = false;
		} else {
			$scope.edit = true;
		}
	}

};