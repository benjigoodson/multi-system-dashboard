'use strict'

var SystemModule = angular.module('SystemModule');

// Imports
SystemModule.constant("moment", moment);

SystemModule.controller('SystemController', SystemController);

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

		SystemService.create($scope.system).then(function(response) {
			if(response && response.success) {
				notificationService.success(response.message);
				$location.path("/system/" + response.data._id);
			} else {
				self.errorHandler("Unable to create system:" + response.message);
			}
		}, function(error) {
			self.errorHandler("Unable to create system:" + error);
		});
	};

	this.getSystems = function() {
		SystemService.getAll().then(function(response) {
			if(response.success == true) {
				$scope.systems = response.data;
			}
		});
	};

	this.initEdit = function() {

		// Set the id
		this.id = $routeParams.system_id;

		SystemService.get(this.id).then(function(data) {
			self.system = data;

			if(self.system.numEndpoints > 0) {
				// Get all endpoints that are saved for this system
				EndpointService.getBasicEndpoints(self.system._id).then(function(response) {
					if(response.success == true) {
						self.endpoints = response.data;
					} else {
						self.errorHandler("Unable to update system:" + response.message);
					}
				});
			}

		});
	};

	this.deleteSystemFromEdit = function(systemId) {

		var message = "Are you sure you wish to delete this system, '" + self.system.name + "' [" + systemId + "]?";
		var title = "Delete this system?";

		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
				self.deleteSystem(systemId).then(function(response) {
					if(response.success) {
						notificationService.success(response.message);
						$location.path("/systems");
					} else {
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

		var message = "Are you sure you wish to delte this system [" + systemId + "]?";
		var title = "Delete this system?";

		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
				
				self.deleteSystem(systemId).then(function(response) {
					if(response.success) {
						notificationService.success(response.message);
						
						self.getSystems();
					} else {
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

		return SystemService.delete(systemId);
	};

	this.saveSystem = function(system) {

		SystemService.update(system).then(function(response) {
			if(response.success) {
				notificationService.info(response.message);
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
			$scope.system.createdBy = {id : user._id, forename : user.forename};
		})
	};

	this.setEdit = function() {
		if($scope.edit == true) {
			$scope.edit = false;
		} else {
			$scope.edit = true;
		}
	}

	this.errorHandler = function(error) {
		notificationService.error(error);
	};

};