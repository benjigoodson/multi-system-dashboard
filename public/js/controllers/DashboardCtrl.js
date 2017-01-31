'use strict'

var DashboardModule = angular.module('DashboardModule');

// Imports
DashboardModule.constant("moment", moment);

DashboardModule.controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', '$location', 'UserService', 'SystemService'];
function DashboardController($scope, $location, UserService, DashboardService) { 

	this.createDashboard = function() {

		DashboardService.create($scope.dashboard).then(function(response) {
			$location.path("/dashboards");
		}, function(error) {

		});
	};

	this.getSystems = function() {
		SystemService.getAll().then(function(data) {
			$scope.systems = data;
		});
	};

	this.deleteSystem = function(systemId) {

		var self = this;

		SystemService.delete(systemId).then(function(response) {
			if(response.success) {
				// Refresh table
				self.getSystems();
			}
		});
	};

	this.setupCreatePage = function() {
		$scope.dashboard = {};

		$scope.dashboard.createdDate = moment().format('DD/MM/YYYY');
		$scope.dashboard.createdBy = UserService.getCurrentUser().forename;
	};

};