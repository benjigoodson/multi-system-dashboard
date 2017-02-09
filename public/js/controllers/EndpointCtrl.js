'use strict'

var EndpointModule = angular.module('EndpointModule');

// Imports
EndpointModule.constant("moment", moment);

EndpointModule.controller('EndpointController', EndpointController);

EndpointController.$inject = ['$scope', '$location', 'UserService', 'EndpointService', 'notificationService'];
function EndpointController ($scope, $location, UserService, EndpointService, notificationService) { 

	var self = this;

	this.createEndpoint = function() {

		$scope.endpoint.url = this.systemURL + $scope.endpoint.url;	

		EndpointService.create($scope.endpoint).then(function(response) {
			// Go to endpoint list page
			$location.path('/endpoints');
		}, function(error) {

		});
	};

	this.getEndpoints = function() {
		EndpointService.getAll().then(function(data) {
			$scope.endpoints = data;
		});
	};

	this.getSystems = function() {
		EndpointService.getSystems().then(function(data) {
			$scope.systems = data;
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

	this.deleteEndpoint = function(endpointId) {

		EndpointService.delete(endpointId).then(function(response) {
			if(response.success) {
				notificationService.success(response.message);

				// Refresh table
				self.getEndpoints();
			}
		});
	};

	this.setupCreatePage = function() {
		this.getSystems();

		$scope.endpoint = {};

		$scope.endpoint.createdDate = moment().format('DD/MM/YYYY');
		
		UserService.getCurrentUser().then(function(user) {
			$scope.endpoint.createdBy = {id : user._id, forename : user.forename};
		})


		this.systemURL = "";
	};

};