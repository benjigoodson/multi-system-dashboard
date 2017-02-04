'use strict'

var WidgetModule = angular.module('WidgetModule');

WidgetModule.factory('WidgetService', function ($http) {
	
	var url = '/api/widget/';

	return {

		getAll : function() {
			
			var promise = $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;			
		},

		getForHome : function() {
			
			var promise = $http.get(url + "/home") .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;			
		},
		
		getWidget : function(widgetId) {
			
			var promise = $http.get(url + widgetId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;			
		},
		
		create : function(widgetData) {
			var promise = $http.post(url, widgetData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;	
		},

		update : function(widgetData) {
			var promise = $http.put(url + widgetData._id, widgetData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;	
		},
		
		delete : function(widgetId) {
			
			var promise = $http.delete('/api/widget/' + widgetId).then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;	
		},

		getSystems : function() {
			
			var promise = $http.get("/api/system/basic").then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;			
		},

		getEndpoints : function(systemId) {
			
			var promise = $http.get("/api/endpoint/basic/" + systemId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
			return promise;			
		},

		makeRESTCall : function(method, apiURL) {

			// Time out of 15 seconds
			var promise = $http(
				{ 
					method: method, 
					url: apiURL,
					timeout: 15000 
				})
			.then(function (response) {	  
				return response;
			}, function (error) {
				return error;
			});

			return promise;
		}

	};
	
});