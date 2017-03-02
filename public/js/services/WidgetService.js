'use strict'

var WidgetModule = angular.module('WidgetModule');

WidgetModule.factory('WidgetService', function ($http) {
	
	var url = '/api/widget/';

	return {

		getAll : function() {
			
			return $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {
				return { success : error.data.success, message : error.statusText};
			})		
		},

		getForHome : function() {
			
			return $http.get(url + "/home") .then(function(response) {
				return response.data;
			}, function(error) {
				return { success : error.data.success, message : error.statusText};
			})		
		},
		
		getWidget : function(widgetId) {
			
			return $http.get(url + widgetId) .then(function(response) {
				return response.data;
			}, function(error) {
				return { success : error.data.success, message : error.statusText};
			})		
		},
		
		create : function(widgetData) {
			return $http.post(url, widgetData) .then(function(response) {
				return response.data;
			}, function(error) {
				return { success : error.data.success, message : error.statusText};
			})
		},

		update : function(widgetData) {
			return $http.put(url + widgetData._id, widgetData) .then(function(response) {
				return response.data;
			}, function(error) {
				return { success : error.data.success, message : error.statusText};
			})
		},
		
		delete : function(widgetId) {
			
			return $http.delete(url + widgetId).then(function(response) {
				return response.data;
			}, function(error) {
				return { success : error.data.success, message : error.statusText};
			})
		},

		makeRESTCall : function(method, apiURL) {

			// Time out of 15 seconds
			var promise = $http(
				{ 
					method: method, 
					url: apiURL,
					timeout: 10000
				})
			.then(function (response) {	  
				return response;
			}, function (error) {
				if(error && error.status > -1) {
					return { success : 'false', message : error.statusText};
				} else {
					return undefined;
				}
			});

			return promise;
		}

	};
	
});