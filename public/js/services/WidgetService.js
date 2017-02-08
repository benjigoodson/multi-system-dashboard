'use strict'

var WidgetModule = angular.module('WidgetModule');

WidgetModule.factory('WidgetService', function ($http) {
	
	var url = '/api/widget/';

	return {

		getAll : function() {
			
			return $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})		
		},

		getForHome : function() {
			
			return $http.get(url + "/home") .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})		
		},
		
		getWidget : function(widgetId) {
			
			return $http.get(url + widgetId) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})		
		},
		
		create : function(widgetData) {
			return $http.post(url, widgetData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
		},

		update : function(widgetData) {
			return $http.put(url + widgetData._id, widgetData) .then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
		},
		
		delete : function(widgetId) {
			
			return $http.delete(url + widgetId).then(function(response) {
				return response.data;
			}, function(error) {
				return error;
			})
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