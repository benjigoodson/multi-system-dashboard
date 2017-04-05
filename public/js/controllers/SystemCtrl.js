'use strict'

var SystemModule = angular.module('SystemModule');

// Imports
SystemModule.constant("moment", moment);

SystemModule.controller('SystemController', SystemController);

// Inject dependencies
SystemController.$inject = ['$scope', '$location', '$routeParams', 'UserService', 'SystemService', 'EndpointService', 
	'notificationService', 'ModalService'];

function SystemController($scope, $location, $routeParams, UserService, SystemService, EndpointService, 
	notificationService, ModalService) { 

	var self = this;

	this.createSystem = function() {

		// Add a trailing '/' to url
		if ($scope.system.url.charAt($scope.system.url.length - 1) != '/') {
			$scope.system.url = $scope.system.url + '/';
		}

		// Create a new system
		SystemService.create($scope.system).then(function(response) {
			if(response && response.success) {
				// Display a message to the user
				notificationService.success(response.message);

				// view the system
				$location.path("/system/" + response.data._id);
			} else {
				// Display an error to the user
				self.errorHandler("Unable to create system:" + response.message);
			}
		}, function(error) {
			// Display an error to the user
			self.errorHandler("Unable to create system:" + error);
		});
	};

	this.getSystems = function() {
		// Get all systems
		SystemService.getAll().then(function(response) {
			if(response.success == true) {
				$scope.systems = response.data;
			}
		});
	};

	this.initEdit = function() {

		// Set the id
		this.id = $routeParams.system_id;

		// get a system for an id
		SystemService.get(this.id).then(function(data) {
			self.system = data;

			if(self.system.numEndpoints > 0) {
				// Get all endpoints that are saved for this system
				EndpointService.getBasicEndpoints(self.system._id).then(function(response) {
					if(response.success == true) {
						self.endpoints = response.data;
					} else {
						// Display an error to the user
						self.errorHandler("Unable to update system:" + response.message);
					}
				});
			}

		});
	};

	this.deleteSystemFromEdit = function(systemId) {

		// Set the modal values
		var message = "Are you sure you wish to delete this system, '" + self.system.name + "' [" + systemId + "]?";
		var title = "Delete this system?";

		// Display the modal
		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
				// Delete the system
				self.deleteSystem(systemId).then(function(response) {
					if(response.success) {
						// Display a message to the user
						notificationService.success(response.message);

						// View all systems
						$location.path("/systems");
					} else {
						// Display an error to the user
						self.errorHandler("Unable to delete system:" + response.message);
					}
				});
			}
		}, function (modal_response) {
			// Modal dismissed
			console.log("Modal dismissed: " + modal_response);
		});

	};

	this.deleteSystemFromViewAll = function(systemId) {

		// Set the modal values
		var message = "Are you sure you wish to delte this system [" + systemId + "]?";
		var title = "Delete this system?";

		// Display the modal
		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
				// Delete the system
				self.deleteSystem(systemId).then(function(response) {
					if(response.success) {
						// Display a message to the user
						notificationService.success(response.message);
						
						// View all systems
						self.getSystems();
					} else {
						// Display an error to the user
						self.errorHandler("Unable to delete system:" + response.message);
					}
				});
			}
		}, function (modal_response) {
			// Modal dismissed
			console.log("Modal dismissed: " + modal_response);
		});
	}

	this.deleteSystem = function(systemId) {

		// Delete the system
		return SystemService.delete(systemId);
	};

	this.saveSystem = function(system) {

		SystemService.update(system).then(function(response) {
			if(response.success) {
				// Display a message to the user
				notificationService.info(response.message);
				self.setEdit();
			} else {
				// Display an error to the user
				self.errorHandler("Unable to update system:" + response.message);
			}

		}, function(error) {
			// Display an error to the user
			self.errorHandler("Unable to update system:" + error.message);
		});
	};

	this.setupCreatePage = function() {
		$scope.system = {};

		// Set default status value
		$scope.system.status = "online";

		// Set the created date 
		$scope.system.createdDate = moment().format('DD/MM/YYYY');

		// Set the created user
		UserService.getCurrentUser().then(function(user) {
			$scope.system.createdBy = {id : user._id, forename : user.forename};
		})
	};

	this.setEdit = function() {
		// toggle the edit controls 
		if($scope.edit == true) {
			$scope.edit = false;
		} else {
			$scope.edit = true;
		}
	}

	this.errorHandler = function(error) {
		// Display an error to the user
		notificationService.error(error);
	};

};