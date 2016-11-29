'use strict'

var EndpointModule = angular.module('EndpointModule');

// Imports
EndpointModule.constant("moment", moment);

EndpointModule.controller('EndpointController', function($scope, $location, UserService, EndpointService) { 

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

		var self = this;

		EndpointService.delete(endpointId).then(function(response) {
			if(response.success) {
				// Refresh table
				self.getEndpoints();
			}
		});
	};

	this.setupCreatePage = function() {
		this.getSystems();

		$scope.endpoint = {};

		$scope.endpoint.createdDate = moment().format('DD/MM/YYYY');
		$scope.endpoint.createdBy = UserService.getCurrentUser().forename;


		this.systemURL = "";
	};

});