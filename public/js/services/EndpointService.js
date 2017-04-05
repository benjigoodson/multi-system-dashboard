var EndpointModule = angular.module('EndpointModule');

EndpointModule.factory('EndpointService', function ($http) {
	
	var url = '/api/endpoint/';

	return {

		// Make request to get all endpoints
		getAll : function() {			
			return $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		// Make request to get an endpoint matching the id
		get : function(id) {			
			return $http.get(url + id) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})			
		},

		// Make request to get all basic details for the endpoints
		getBasicEndpoints : function(systemId) {			
			return $http.get(url + "basic/" + systemId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		// Make request to create a endpoint
		create : function(endpointData) {
			return $http.post(url, endpointData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},

		// Make request to update an endpoint
		update : function(endpointData) {
			return $http.put(url + endpointData._id, endpointData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},
		
		// Make request to delete an endpoint
		delete : function(endpointId) {
			return $http.delete(url + endpointId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})			
		},
	
		// Make request to get basic system details
		getSystems : function() {			
			return $http.get("/api/system/basic") .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})	
		}

	}
	
});