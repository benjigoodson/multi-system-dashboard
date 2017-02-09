'use strict'

var EndpointModule = angular.module('EndpointModule');

// Imports
EndpointModule.constant("moment", moment);

EndpointModule.controller('EndpointController', EndpointController);

EndpointController.$inject = ['$scope', '$location', '$routeParams', 'UserService', 'EndpointService', 'SystemService', 'notificationService'];
function EndpointController ($scope, $location, $routeParams, UserService, EndpointService, SystemService, notificationService) { 

	var self = this;

	this.createEndpoint = function() {

		$scope.endpoint.url = this.systemURL + $scope.endpoint.url;	

		EndpointService.create($scope.endpoint).then(function(response) {
			if(response.success == true) {
				notificationService.success(response.message);
				$location.path("/endpoint/" + response.data._id);
			} else {
				self.errorHandler("Unable to create endpoint:" + response.message);	
			}
		}, function(error) {
			self.errorHandler(error);
		});
	};

	this.getEndpoints = function() {
		EndpointService.getAll().then(function(response) {
			if(response.success == true) {
				$scope.endpoints = response.data;
			} else {
				self.errorHandler("Unable to get endpoints:" + response.message);	
			}
		});
	};

	this.getSystems = function() {
		EndpointService.getSystems().then(function(response) {
			if(response.success == true) {
				$scope.systems = response.data;
			} else {
				self.errorHandler("Unable to get systems:" + response.message);	
			}
		});
	};

	this.systemChanged = function() {
		if($scope.endpoint.parentSystem) {

			var self = this;

			$scope.systems.forEach(function(system) {

				if($scope.endpoint.parentSystem == system.id) {
					self.systemURL = system.url;
				}				

			});

		} else {
			this.systemURL = '';
		}
	};

	this.saveEndpoint = function(endpoint) {

		EndpointService.update(endpoint).then(function(response) {
			if(response.success) {
				notificationService.info(response.message);
				self.setEdit();
			} else {
				self.errorHandler("Unable to update endpoint:" + response.message);
			}

		}, function(error) {
			self.errorHandler("Unable to update endpoint:" + error.message);
		});
	};

	this.deleteEndpointFromEdit = function(endpointId) {
		this.deleteEndpoint(endpointId).then(function(response) {
			if(response.success) {
				notificationService.success(response.message);
				$location.path("/endpoints");
			} else {
				self.errorHandler("Unable to delete endpoint:" + response.message);
			}
		});
	};

	this.deleteEndpointFromViewAll = function(endpointId) {

		this.deleteEndpoint(endpointId).then(function(response) {
			if(response.success) {
				notificationService.success(response.message);

				// Refresh table
				self.getEndpoints();
			}
		});
	};

	this.deleteEndpoint = function(endpointId) {

		return EndpointService.delete(endpointId);
	};

	this.setupCreatePage = function() {
		this.getSystems();

		$scope.endpoint = {};

		$scope.endpoint.createdDate = moment().format('DD/MM/YYYY');
		
		UserService.getCurrentUser().then(function(user) {
			$scope.endpoint.createdBy = {id : user._id, forename : user.forename};
		});

		this.systemURL = "";
	};

	this.getSystem = function(systemId) {

		SystemService.get(systemId).then(function(data) {
			self.system = data;
		});
	}

	this.initEdit = function() {

		// Set the id
		this.id = $routeParams.endpoint_id;

		$scope.edit = false;

		EndpointService.get(this.id).then(function(response) {
			if(response.success == true) {
				self.endpoint = response.data;

				self.getSystem(self.endpoint.parentSystem);
			} else {
				self.errorHandler("Unable to get endpoint: " + response.message);
			}
		});

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