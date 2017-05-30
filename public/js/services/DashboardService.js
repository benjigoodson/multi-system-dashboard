'use strict'

var DashboardModule = angular.module('DashboardModule');

DashboardModule.factory('DashboardService', function ($http) {
	
	var url = '/api/dashboard/';

	var self = {

		dashboardMenu : {
			items : []
		},

		// Make request to get all the basic details for each dashboard
		getAllBasic : function(userId) {
			return $http.get(url + 'basic/' + userId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		// Make request to get a dashboard matching the passed id
		get : function(dashboardId) {
			
			return $http.get(url + dashboardId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		// Make request to create a new dashboard
		create : function(dashboardData) {

			// Just keep widget id's in the array
			var widgetIds = [];

			// If widgets have been selected
			if(dashboardData.widgets && dashboardData.widgets != undefined && dashboardData.widgets.length > 0) {
				// Loop through each widget
				dashboardData.widgets.forEach(function (widget, count) {
					// Add each id to an array
					widgetIds.push(widget._id);
				});
			}

			// Set the dashboard's widget to the array of ids
			dashboardData.widgets = widgetIds;

			// Make the REST call
			return $http.post(url, dashboardData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},

		// Make request to update a dashboard
		update : function(dashboardData) {
			return $http.put(url + dashboardData._id, dashboardData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},

		// Make request to delete a dashboard
		delete : function(dashboardId) {
			return $http.delete('/api/dashboard/' + dashboardId).then(function(response) {
				return response;
			}, function(error) {
				return error.data;
			})
		},

		// Make request to get all the basic dashboard details and set them on the menu
		updateMenu : function(userId) {
			// Load menu list dashboards
			return this.getAllBasic(userId).then(function(response) {

				if(response.success == true) {
					self.dashboardMenu.items = response.data;
				}

			});
		}
	}

	return self;
	
});