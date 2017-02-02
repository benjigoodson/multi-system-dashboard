var DashboardModule = angular.module('DashboardModule');

DashboardModule.factory('DashboardService', function ($http) {
	
	var url = '/api/dashboard/';

	return {

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

			})
			return promise;			
		},
		
		create : function(dashboardData) {

			// Just keep widget id's in the array
			var widgetIds = [];

			dashboardData.widgets.forEach(function (widget, count) {
            	widgetIds.push(widget._id);
			});

			dashboardData.widgets = widgetIds;

			var promise = $http.post(url, dashboardData) .then(function(response) {
				return response.data;
			}, function(error) {
				
			})
			return promise;	
		}
	}
	
});