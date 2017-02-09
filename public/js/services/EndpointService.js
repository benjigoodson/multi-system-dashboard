var EndpointModule = angular.module('EndpointModule');

EndpointModule.factory('EndpointService', function ($http) {
	
	var url = '/api/endpoint/';

	return {

		getAll : function() {			
			return $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		get : function(id) {			
			return $http.get(url + id) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})			
		},

		getBasicEndpoints : function(systemId) {			
			return $http.get(url + "basic/" + systemId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})		
		},
		
		create : function(endpointData) {
			return $http.post(url, endpointData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},

		update : function(endpointData) {
			return $http.put(url + endpointData._id, endpointData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})
		},
		
		delete : function(endpointId) {
			return $http.delete(url + endpointId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})			
		},

		getSystems : function() {			
			return $http.get("/api/system/basic") .then(function(response) {
				return response.data;
			}, function(error) {
				return error.data;
			})	
		}

	}
	
});