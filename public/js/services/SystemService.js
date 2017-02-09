var SystemModule = angular.module('SystemModule');

SystemModule.factory('SystemService', function ($http) {
	
	var url = '/api/system/';

	return {

		getAll : function() {			
			return $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		get : function(systemId) {			
			return $http.get(url + systemId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		create : function(systemData) {
			return $http.post(url, systemData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},

		getBasicSystems : function() {
			
			return $http.get(url + "basic/").then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},

		update : function(systemData) {
			return $http.put(url + systemData._id, systemData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},
		
		delete : function(systemId) {
			return $http.delete(url + systemId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})			
		}
	}
	
});