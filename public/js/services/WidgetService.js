'use strict'

var WidgetModule = angular.module('WidgetModule');

WidgetModule.factory('WidgetService', function ($http) {
	
	var url = '/api/widget/';

	return {

		getAll : function() {
			
			var promise = $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;			
		},
		
		getWidget : function(widgetId) {
			
			var promise = $http.get(url + widgetId) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;			
		},

		get : function(dashboardId) {
			
			var promise = $http.get(url + "dashboard/" + dashboardId) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;			
		},
		
		create : function(widgetData) {
			var promise = $http.post(url, widgetData) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;	
		},
		
		delete : function(widgetIdid) {
			
			return $http.delete('/api/widget/' + widgetId);
			
		},

		getSystems : function() {
			
			var promise = $http.get("/api/system/basic") .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;			
		},

		getEndpoints : function(systemId) {
			
			var promise = $http.get("/api/endpoint/basic/" + systemId) .then(function(response) {
				return response.data;
			}, function(error) {

			})
			return promise;			
		},

		makeRESTCall : function(method, apiURL) {

			var promise = $http(
				{ 
					method: method, 
					url: apiURL 
				})
			.then(function (response) {	  
					return response;
			}, function (error) {
				// error
			});

			return promise;
		}

	};
	
});