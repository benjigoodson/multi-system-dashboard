'use strict'

var EndpointModule = angular.module('EndpointModule');

// Imports
EndpointModule.constant("moment", moment);

EndpointModule.controller('EndpointController', EndpointController);

// Inject dependencies
EndpointController.$inject = ['$scope', '$location', '$routeParams', 'UserService', 'EndpointService', 'SystemService', 
	'notificationService', 'ModalService'];
	
function EndpointController ($scope, $location, $routeParams, UserService, EndpointService, SystemService, 
	notificationService, ModalService) { 

	var self = this;

	this.createEndpoint = function() {

		// Create the endpoint
		EndpointService.create($scope.endpoint).then(function(response) {
			if(response.success == true) {
				// Display message
				notificationService.success(response.message);

				// View the new endpoint
				$location.path("/endpoint/" + response.data._id);
			} else {
				// Display an error
				self.errorHandler("Unable to create endpoint:" + response.message);	
			}
		}, function(error) {
			// Display an error
			self.errorHandler(error);
		});
	};

	this.getEndpoints = function() {
		// Get all endpoints
		EndpointService.getAll().then(function(response) {
			if(response.success == true) {
				// Display them on screen
				$scope.endpoints = response.data;
			} else {
				// Display an error
				self.errorHandler("Unable to get endpoints:" + response.message);	
			}
		});
	};

	this.getSystems = function() {
		EndpointService.getSystems().then(function(response) {
			if(response.success == true) {
				// Set the systems in scope
				$scope.systems = response.data;
			} else {
				// Display an error
				self.errorHandler("Unable to get systems:" + response.message);	
			}
		});
	};

	this.systemChanged = function() {
		// If a set has been selected
		if($scope.endpoint.parentSystem) {

			var self = this;

			// For each system
			$scope.systems.forEach(function(system) {
				// Find the selected system
				if($scope.endpoint.parentSystem == system.id) {
					// Display the url for the selected system
					self.systemURL = system.url;
				}
			});

		} else {
			// Set the url as blank
			this.systemURL = '';
		}
	};

	this.saveEndpoint = function(endpoint) {

		// update the endpoint
		EndpointService.update(endpoint).then(function(response) {
			if(response.success) {
				// Display a message
				notificationService.info(response.message);

				// Turn editing off
				self.setEdit();
			} else {
				// Display an error
				self.errorHandler("Unable to update endpoint:" + response.message);
			}

		}, function(error) {
			// Display an error
			self.errorHandler("Unable to update endpoint:" + error.message);
		});
	};

	this.deleteEndpointFromEdit = function(endpointId) {

		// Set text for the modal
		var message = "Are you sure you wish to delete this endpoint, '" + self.endpoint.name + "' [" + endpointId + "]?";
		var title = "Delete this endpoint?";

		// Display the modal
		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
				// Delete an endpoint
				self.deleteEndpoint(endpointId).then(function(response) {
					if(response.success) {
						// Display a message
						notificationService.success(response.message);

						// List all of the endpoints remaining
						$location.path("/endpoints");
					} else {
						// Display an error
						self.errorHandler("Unable to delete endpoint:" + response.message);
					}
				});
			}
		}, function (modal_response) {
			// Modal dismissed
			console.log("Modal dismissed: " + modal_response);
		});

	};

	this.deleteEndpointFromViewAll = function(endpointId) {

		// Set text for the modal
		var message = "Are you sure you wish to delete this endpoint [" + endpointId + "]?";
		var title = "Delete this endpoint?";

		// Display the modal
		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
				// Delete the endpoint
				self.deleteEndpoint(endpointId).then(function(response) {
					if(response.success) {
						// Display a message
						notificationService.success(response.message);

						// Refresh table
						self.getEndpoints();
					}
				});
			}
		}, function (modal_response) {
			// Modal dismissed
			console.log("Modal dismissed: " + modal_response);
		});

	};

	this.deleteEndpoint = function(endpointId) {

		// Delete the endpoint
		return EndpointService.delete(endpointId);

	};

	this.setupCreatePage = function() {
		// get all systems
		this.getSystems();

		$scope.endpoint = {};

		// set the created date
		$scope.endpoint.createdDate = moment().format('DD/MM/YYYY');
		
		UserService.getCurrentUser().then(function(user) {
			// Set the created by user
			$scope.endpoint.createdBy = {id : user._id, forename : user.forename};
		});

		this.systemURL = "";
	};

	this.getSystem = function(systemId) {

		// Get a system for an id
		SystemService.get(systemId).then(function(data) {
			self.system = data;
		});
	}

	this.initEdit = function() {

		// Set the id
		this.id = $routeParams.endpoint_id;

		$scope.edit = false;

		// Get an endpoint for an id
		EndpointService.get(this.id).then(function(response) {
			if(response.success == true) {
				self.endpoint = response.data;

				self.getSystem(self.endpoint.parentSystem);
			} else {
				// Display an error
				self.errorHandler("Unable to get endpoint: " + response.message);
			}
		});

	};

	this.setEdit = function() {
		// Swap between editing
		if($scope.edit == true) {
			$scope.edit = false;
		} else {
			$scope.edit = true;
		}
	}

	this.errorHandler = function(error) {
		// Use the notifciation service to display the error
		notificationService.error(error);
	};

};