var DashboardModule = angular.module('DashboardModule');

DashboardModule.factory('DashboardService', function ($http) {
	
	var url = '/api/dashboard/';

	var self = {

		dashboardMenu : {
			items : []
		},

		getAllBasic : function() {
			
			var promise = $http.get(url + 'basic') .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;			
		},
		
		get : function(dashboardId) {
			
			var promise = $http.get(url + dashboardId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;			
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

			var promise = $http.post(url, dashboardData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
			return promise;	
		},

		update : function(dashboardData) {
			var promise = $http.put(url + dashboardData._id, dashboardData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;	
		},

		delete : function(dashboardId) {
			var promise = $http.delete('/api/dashboard/' + dashboardId).then(function(response) {
				return response;
			}, function(error) {
				return error;
			})
			return promise;
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