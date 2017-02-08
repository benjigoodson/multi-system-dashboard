var EndpointModule = angular.module('EndpointModule');

EndpointModule.factory('EndpointService', function ($http) {
	
	var url = '/api/endpoint/';

	return {

		getAll : function() {
			
			return $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {

			})		
		},
		
		get : function(id) {
			
			return $http.get(url + id) .then(function(response) {
				return response.data;
			}, function(error) {

			})			
		},

		getBasicEndpoints : function(systemId) {
			
			return $http.get(url + "basic/" + systemId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})		
		},
		
		create : function(endpointData) {
			return $http.post(url, endpointData) .then(function(response) {
				return response.data;
			}, function(error) {

			})
		},
		
		delete : function(endpointId) {
			return $http.delete(url + endpointId) .then(function(response) {
				return response.data;
			}, function(error) {

			})			
		},

		getSystems : function() {
			
			return $http.get("/api/system/basic") .then(function(response) {
				return response.data;
			}, function(error) {

			})	
		}

	}
	
});