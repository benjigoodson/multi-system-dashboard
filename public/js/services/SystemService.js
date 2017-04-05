var SystemModule = angular.module('SystemModule');

SystemModule.factory('SystemService', function ($http) {
	
	var url = '/api/system/';

	return {

		// Make request to get all systems
		getAll : function() {			
			return $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		// Make request to get a system matching the id
		get : function(systemId) {			
			return $http.get(url + systemId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		// Make request to ceate a system
		create : function(systemData) {
			return $http.post(url, systemData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},

		// Make request to get the basic details for all systems
		getBasicSystems : function() {
			
			return $http.get(url + "basic/").then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},

		// Make request to updsate a system
		update : function(systemData) {
			return $http.put(url + systemData._id, systemData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},
		
		// Make request to delete a system
		delete : function(systemId) {
			return $http.delete(url + systemId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})			
		}
	}
	
});