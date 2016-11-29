var EndpointModule = angular.module('EndpointModule');

EndpointModule.factory('EndpointService', function ($http) {
	
	var url = '/api/endpoint/';

	return {

		getAll : function() {
			
			var promise = $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;			
		},
		
		get : function(id) {
			
			var promise = $http.get(url + id) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;			
		},
		
		create : function(endpointData) {
			var promise = $http.post(url, endpointData) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;
		},
		
		delete : function(endpointId) {
			var promise = $http.delete(url + endpointId) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;	
			
		},

		getSystems : function() {
			
			var promise = $http.get("/api/system/basic") .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;			
		}

	}
	
});