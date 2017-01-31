var DashboardModule = angular.module('DashboardModule');

DashboardModule.factory('DashboardService', function ($http) {
	
	var url = '/api/dashboard/';

	return {

		getAll : function() {
			
			var promise = $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {

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
			var promise = $http.post(url, dashboardData) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;	
		}
	}
	
});