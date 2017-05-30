'use strict'

var WidgetModule = angular.module('WidgetModule');

WidgetModule.factory('WidgetService', function ($http, $q) {
	
	var url = '/api/widget/';

	return {

		// Make request to get all widgets
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

		// Make request to get all widgets for the home page
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
		
		// Make request to get a widget matching the id
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
		
		// Make request to create a widget
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

		// Make request to update a widget
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
		
		// Make request to delete a widget
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

		// Make a rest call using the detials passed to the function
		makeRESTCall : function(method, apiURL, apiKey, requestParam) {

			var url;

			// If a URL isn't present
			if(!apiURL || apiURL == undefined) {
				// Return error and handle this in the calling function
				throw "No URL is present.";
			}

			// If any request parameter is set
			if(requestParam && requestParam.length > 0) {
				// Add the parameter to the end of the url
				url = apiURL + "/" + requestParam;
			} else {
				// Set the url to use
				url = apiURL;
			}

			// Time out of 10 seconds
			var promise = $http(
				{ 
					method : method, 
					url : url,
					headers : {
						'Authorization' : apiKey
					},
					timeout : 10000
				})
			.then(function (response) {	  
				return response;
			}, function (error) {
				// If the request returns an error
				if(error && error.status > -1) {
					// Return the error status text
					return { success : 'false', message : error.statusText};
				} else {
					// Return a generic message about being unable to make the call
					return { success : 'false', message : "Problem making request."};
				}
			});

			return promise;
		}

	};
	
});