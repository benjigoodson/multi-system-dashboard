var DashboardModule = angular.module('DashboardModule');

DashboardModule.factory('DashboardService', function ($http) {
	
	var url = '/api/dashboard/';

	var self = {

		dashboardMenu : {
			items : []
		},

		getAllBasic : function() {
			
			return $http.get(url + 'basic') .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		get : function(dashboardId) {
			
			return $http.get(url + dashboardId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		create : function(dashboardData) {

			// Just keep widget id's in the array
			var widgetIds = [];

			if(dashboardData.widgets && dashboardData.widgets != undefined && dashboardData.widgets.length > 0) {
				dashboardData.widgets.forEach(function (widget, count) {
					widgetIds.push(widget._id);
				});
			}

			dashboardData.widgets = widgetIds;

			return $http.post(url, dashboardData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},

		update : function(dashboardData) {
			return $http.put(url + dashboardData._id, dashboardData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},

		delete : function(dashboardId) {
			return $http.delete('/api/dashboard/' + dashboardId).then(function(response) {
				return response;
			}, function(error) {
				return error.data;
			})
		},

		updateMenu : function() {
			// Load menu list dashboards
			return this.getAllBasic().then(function(response) {

				if(response.success == true) {
					self.dashboardMenu.items = response.data;
				}

			});
		}
	}

	return self;
	
});