var SystemModule = angular.module('SystemModule');

SystemModule.factory('SystemService', function ($http) {
	
	var url = '/api/system/';

	return {

		getAll : function() {
			
			var promise = $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;			
		},
		
		get : function(systemId) {
			
			var promise = $http.get(url + systemId) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;			
		},
		
		create : function(systemData) {
			var promise = $http.post(url, systemData) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;	
		},
		
		delete : function(systemId) {
			var promise = $http.delete(url + systemId) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;	
			
		}
	}
	
});