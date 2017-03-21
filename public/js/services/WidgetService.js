'use strict'

var WidgetModule = angular.module('WidgetModule');

WidgetModule.factory('WidgetService', function ($http) {
	
	var url = '/api/widget/';

	return {

		getAll : function() {
			
			return $http.get(url) .then(function(response) {
				return response.data;
			}, function(error) {
				if(error && error.success != undefined) {
					return { success : error.data.success, message : error.statusText};
				} else {
					return { success : false, message : "Unable to completed request."};
				}
			})		
		},

		getForHome : function() {
			
			return $http.get(url + "/home") .then(function(response) {
				return response.data;
			}, function(error) {
				if(error && error.success != undefined) {
					return { success : error.data.success, message : error.statusText};
				} else {
					return { success : false, message : "Unable to completed request."};
				}
			})		
		},
		
		getWidget : function(widgetId) {
			
			return $http.get(url + widgetId) .then(function(response) {
				return response.data;
			}, function(error) {
				if(error && error.success != undefined) {
					return { success : error.data.success, message : error.statusText};
				} else {
					return { success : false, message : "Unable to completed request."};
				}
			})		
		},
		
		create : function(widgetData) {
			return $http.post(url, widgetData) .then(function(response) {
				return response.data;
			}, function(error) {
				if(error && error.success != undefined) {
					return { success : error.data.success, message : error.statusText};
				} else {
					return { success : false, message : "Unable to completed request."};
				}
			})
		},

		update : function(widgetData) {
			return $http.put(url + widgetData._id, widgetData) .then(function(response) {
				return response.data;
			}, function(error) {
				if(error && error.success != undefined) {
					return { success : error.data.success, message : error.statusText};
				} else {
					return { success : false, message : "Unable to completed request."};
				}
			})
		},
		
		delete : function(widgetId) {
			
			return $http.delete(url + widgetId).then(function(response) {
				return response.data;
			}, function(error) {
				if(error && error.success != undefined) {
					return { success : error.data.success, message : error.statusText};
				} else {
					return { success : false, message : "Unable to completed request."};
				}
			})
		},

		makeRESTCall : function(method, apiURL, requestParam) {

			var url;

			if(requestParam && requestParam.length > 0) {
				url = apiURL + "/" + requestParam;
			} else {
				url = apiURL;
			}

			// Time out of 10 seconds
			var promise = $http(
				{ 
					method: method, 
					url: url,
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