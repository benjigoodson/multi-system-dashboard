'use strict'

var DashboardModule = angular.module('DashboardModule');

// Imports
DashboardModule.constant("moment", moment);

DashboardModule.controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', '$location', 'UserService', 'DashboardService', 'WidgetService', 'notificationService'];
function DashboardController($scope, $location, UserService, DashboardService, WidgetService, notificationService) {

	this.createDashboard = function() {

		DashboardService.create($scope.dashboard).then(function(response) {
			if(response.success == true) {
				notificationService.success(response.message);
				$location.path("/");
			} else {
				self.errorHandler("Unable to create widget:" + response.message);	
			}
		}, function(error) {
			self.errorHandler("Unable to create widget:" + response.message);
		});
	};

	this.setupCreatePage = function() {
		$scope.dashboard = {};

		$scope.dashboard.createdDate = moment().format('DD/MM/YYYY');
		$scope.dashboard.createdBy = UserService.getCurrentUser().forename;

		$scope.widgets=[];

		WidgetService.getAll().then(function(widgets) {
			$scope.widgets = widgets;
		});
	};

};