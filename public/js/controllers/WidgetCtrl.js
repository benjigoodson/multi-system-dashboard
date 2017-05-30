'use strict'

var WidgetModule = angular.module('WidgetModule');

// Imports
WidgetModule.constant("moment", moment);

WidgetModule.controller('WidgetController', function($scope, $http, $routeParams, $location, $interval, WidgetService, SystemService, 
	EndpointService, ChartService, UserService, notificationService, ModalService) { 

	this.id = $routeParams.widget_id;

	var self = this;

	// Stores a timer for creating a new widget
	self.timer = undefined;

	self.blacklist = [
		"_id",
		"__v"
	];

	$scope.chart = {};

	$scope.labels = [
		"Dark Grey",
		"Purple Color",
		"Gray Color",
		"Green Color",
		"Blue Color"
	];
	$scope.data = [120, 50, 140, 180, 100];
	$scope.type = "pie";

	$scope.edit = false;

	this.createWidget = function(widgetData) {
		// Create a new widget
		WidgetService.create(widgetData).then(function(response) {
			if(response.success == true) {
				// Display a message to the user
				notificationService.success(response.message);

				// View the widget
				$location.path("/widget/" + response.data._id);
			} else {
				// Display an error message
				self.errorHandler("Unable to create widget:" + response.message);	
			}
		}, function(error) {
			// Display an error message
			self.errorHandler("Unable to create widget:" + error.message);
		});
	};

	this.getWidget = function() {
		// Get a widget for an id
		WidgetService.getWidget(this.id).then(function(response) {

			var widget = response.data;
			widget.loading = true;

			$scope.widget = widget;

			// Now generate the graph
			try {

				// Generate chart for widget
				ChartService.generateChartData(widget)
					.then(function(widget) {
						// If the widget is a bar chart
						if(widget.graphType == "bar") {

							// Set these options
							widget.options = { 
								scales: {
									yAxes: [{
										ticks: {
											min : 0,
											stepSize : 1
										}
									}]
								}
							}; 

						} else {
							// Doon't set any custom options
							widget.options = {};
                        }

						widget.loading = false;
                        $scope.widget = widget;

                    }, function(errorMessage) {
						$scope.widget.loading = false;
                        $scope.widget.error = errorMessage;

						// Log the error
						console.log("Unable to contact sever for widget: " + widget._id);
                    });
			} catch(err) {
				// Display an error message
				self.errorHandler(err);
			}

		});
	};
	
	this.setEdit = function() {

		// Toggle the edit controls
		if($scope.edit == true) {
			$scope.edit = false;

			this.getWidget();
		} else {
			$scope.edit = true;

			$scope.datasets = [];
			$scope.fields = [];

			this.getOptions($scope.widget.method, $scope.widget.apiURL, $scope.widget.apiKey);
		}

	};

	this.saveWidget = function(widget) {

		// Update a widget
		WidgetService.update(widget).then(function(response) {

			if(response.success == true) {
				// Display a message to the user
				notificationService.info(response.message);

				// Now generate the graph
				try {

					// Generate chart for widget
					ChartService.generateChartData(widget)
						.then(function(widget) {

							// Hide the loading animation
							widget.loading = false;
							$scope.widget = widget;

						}, function(errorMessage) {
							// Hide the loading animation
							$scope.widget.loading = false;

							// Set an error message
							$scope.widget.error = errorMessage;

							// Log the error
							console.log("Unable to contact sever for widget: " + widget._id);
						});
				} catch(err) {
					// Display an error message
					self.errorHandler(err);
				}

				self.setEdit();
			} else {
				// Display an error message
				self.errorHandler(response.message)
			}

		}, function(err) {
			// Display an error message
			self.errorHandler(err.error);
		});
	}

	this.deleteWidget = function(widgetId) {

		// Set the modal values
		var message = "Are you sure you wish to delete this widget, '" + $scope.widget.name + "' [" + widgetId + "]?";
		var title = "Delete this widget?";

		// Display the modal
		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
				// Delete the widget
				WidgetService.delete(widgetId).then(function(response) {

					if(response.success == true) {
						// Display a message to the user
						notificationService.success(response.message);

						// View the home screen
						$location.path("/");
					} else {
						// Display an error message
						self.errorHandler("Unable to delete widget:" + response.message);
					}

				}, function(error) {
					// Display an error message
					self.errorHandler("Unable to delete widget.");
				});
			}
		}, function (modal_response) {
			// Modal dismissed
			console.log("Modal dismissed: " + modal_response);
		});

	};

	this.getWidgets = function() {
		// Get all widgets
		WidgetService.getAll().then(function(data) {
			$scope.widgets = data;
		});
	};

	this.getSystems = function() {
		// Get all the basic system details
		SystemService.getBasicSystems().then(function(response) {
			if(response.success == true) {
				$scope.systems = response.data;
			}
		});
	};

	this.systemChanged = function() {

		$scope.endpoints = [];
		$scope.widget.endpoint = "";

		// If a system has been selected
		if($scope.widget.system) {
			var systemId = $scope.widget.system;

			$scope.fields = [];
			$scope.field = "";

			$scope.widget.fieldPath = [];

			// Get endpoints
			this.getEndpoints(systemId);
		}
	};

	this.getEndpoints = function(systemId) {
		// Get basic details for the endpoints matching a system id
		EndpointService.getBasicEndpoints(systemId).then(function(response) {
			if(response.success == true) {
				$scope.endpoints = response.data;
			}
		});
	};

	this.endpointChanged = function() {

		// If an endpoint is selected
		if($scope.widget.endpoint) {

			$scope.fields = [];

			$scope.dataset = "";
			$scope.field = "";

			$scope.widget.datasetPath = [];
			$scope.widget.fieldPath = [];

			var method;
			var apiURL;
			var apiKey;

			// Loop through the store endpoints
			for(var i = 0; i < $scope.endpoints.length; i++) {

				// Find the one thats been selected
				if($scope.endpoints[i].id == $scope.widget.endpoint) {

					// Get the details
					$scope.requestingParam = $scope.endpoints[i].requiresParam;

					method = $scope.endpoints[i].requestType;
					apiURL = $scope.endpoints[i].fullUrl;
					apiKey = $scope.endpoints[i].apiKey || '';
					break;
				}
			}

			// Store the endpoints details onto the widget
			$scope.widget.method = method;
			$scope.widget.apiURL = apiURL;
			$scope.widget.apiKey = apiKey;

			if($scope.requestingParam == false) {
				this.getOptions(method, apiURL, apiKey);
			}
				
		}
	};

	this.parameterChanged = function() {

		// Cancel the timer
		if(self.timer) {
			$interval.cancel(self.timer);
		}

		// Remove a leading '/'
		if($scope.widget.requestParam && $scope.widget.requestParam.length > 0 && $scope.widget.requestParam.charAt(0) == "/") {
			$scope.widget.requestParam = $scope.widget.requestParam.substr(1);
		}

		// If parameter has a value and form is valid
		if($scope.widget.requestParam && $scope.widget.requestParam.length > 0 && this.getForm().$valid) {

			// After 750 milliseconds make the request
			self.timer = $interval(function() {

				// Cancel it to stop it repeating
				$interval.cancel(self.timer);

				// Set the values
				var method = $scope.widget.method;
				var apiURL = $scope.widget.apiURL;

				// Optional values
				var apiKey = $scope.widget.apiKey || '';
				var requestParam = $scope.widget.requestParam || '';

				// Make the API request
				self.getOptions(method, apiURL, apiKey, requestParam);

			}, 750);
		}

	};

	this.getOptions = function(method, apiURL, apiKey, requestParam) {

		// Test endpoint and get data back
		WidgetService.makeRESTCall(method, apiURL, apiKey, requestParam).then(function(response) {

			// Check result is ok
			if(response && response.status == 200) {

				// Reset options
				var datasets = [];

				// Always starts with data due to headers
				var responseObject = response.data;

				// If an object is returned containing just a single array
				if(Array.isArray(responseObject[Object.keys(responseObject)[0]]) && Object.keys(responseObject).length == 1) {
					// Use that array as there are no other options currently
					responseObject = responseObject[Object.keys(responseObject)[0]];
				}

				// Store response
				self.responseObject = responseObject;

				// If object is just an array then we can't pick a dataset
				if(!Array.isArray(responseObject)) {
					// List every option as dataset array
					for(var dataset in responseObject)
					{	
						if(!_.contains(self.blacklist, dataset)) {
							datasets.push(dataset);
						}
					}

					$scope.datasets = datasets;
				}

				// Reset fields
				$scope.fields = [];

				// If response object is an array
				if(Array.isArray(responseObject)) {
					// Populate fields from the first object
					self.populateFields(responseObject[0]);

					// Set searchableObject
					self.searchableObject = responseObject[0];
				}

				self.searchableArray = responseObject;

				// If editing a widget
				if($scope.edit && $scope.widget.datasetPath) {

					// Simulate selecting a dataset
					self.searchableArray = self.traverseObject($scope.widget.datasetPath, self.searchableArray);

					// If selected dataset is an array
					if(Array.isArray(self.searchableArray)) {

						// Get the first object in the array
						self.searchableObject = self.searchableArray[0];

						// Traverse throguh the opbject to the field we want
						self.searchableObject = self.traverseObject($scope.widget.fieldPath, self.searchableObject);
						
						// Populate fields
						self.populateFields(self.searchableObject);
					}

				}

			} else {
				// display error with REST call
				self.errorHandler("Problem making REST call.");
			}

		});
	};

	this.populateFields = function(searchableObject) {

		var fields = [];

		// If the searchable object is just an object
		if(searchableObject instanceof Object) {

			// Get all of the properties that aren't in the blacklist
			for(var field in searchableObject)
			{	
				if(!_.contains(self.blacklist, field)) {

					// Add the field to the array
					fields.push(field);
				}
			}
		}

		// Set the fields in the drop down
		$scope.fields = fields;

	};

	this.populateDatasets = function(searchableArray) {

		var datasets = [];

		for(var dataset in searchableArray)
		{	
			if(!_.contains(self.blacklist, dataset)) {
				datasets.push(dataset);
			}
		}

		$scope.datasets = datasets;

	};

	this.datasetChanged = function() { 

		if($scope.dataset) {

			$scope.widget.datasetPath.push($scope.dataset);

			$scope.widget.fieldPath = [];

			// Reset fields
			$scope.fields = [];

			self.searchableObject = {};

			// Update searchable array
			self.searchableArray = self.searchableArray[$scope.dataset];

			this.populateDatasets(self.searchableArray);

			// If selected dataset is an array
			if(Array.isArray(self.searchableArray)) {
				self.searchableObject = self.searchableArray[0];
				
				// Populate fields
				self.populateFields(self.searchableObject);
			}
		}

	}

	this.fieldChanged = function() {

		if($scope.field) {

			// Update field selection
			self.searchableObject = self.searchableObject[$scope.field];

			if(self.searchableObject instanceof Object) {

				if(Array.isArray(self.searchableObject)) {
					// Take first object
					self.searchableObject = self.searchableObject[0];
				}

				this.populateFields(self.searchableObject);
			} else {
				// No sub documents or arrays remaining
				$scope.fields = [];
			}

			$scope.widget.fieldPath.push($scope.field);

			// If graph type is not count generate chart
			if($scope.widget.graphType != "count") {
				this.createChart();
			}
		}
	};

	this.valueChanged = function() {
		this.createChart();
	};

	this.createChart = function() {
		$scope.chart.loading = true;

		try {
			// Display sample graph
			ChartService.generateChartData($scope.widget).then(function(widgetData) {	

				// Set the details to an example chart to use as an example
				$scope.chart.graphType = widgetData.graphType;
				$scope.chart.data = widgetData.data;
				$scope.chart.labels = widgetData.labels;
				$scope.chart.loading = false;

			}, function(errorMessage) {

				$scope.chart.loading = false;
				$scope.chart.error = errorMessage;
				
				// Log the error
				console.log("Unable to contact sever for widget: " + $scope.widget._id);

			});
		} catch(err) {
			$scope.chart.loading = false;
			$scope.chart.error = err;

			// Display an error message
			self.errorHandler(err);
		}
	}

	this.graphChanged = function() {
		// If a graph type has been selected
		if($scope.widget.graphType && $scope.widget.graphType.length > 1) {
			// Display new graph
			if($scope.widget.graphType == "pie") {

				// Set example display labels
				$scope.labels = [
					"Dark Grey",
					"Purple Color",
					"Gray Color",
					"Green Color",
					"Blue Color"
				];

				$scope.series = [];

				// Set example data
				$scope.data = [120, 50, 140, 180, 100];

			} else if($scope.widget.graphType == "count") {
				// Set example data
				$scope.exampleCountField = "Colour";
				$scope.exampleCount = "180";
				$scope.exampleCountValue = "Green Color";
			} else {
				// Set example data
				$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
				$scope.series = ['Series A', 'Series B'];
				$scope.data = [
					[65, 59, 80, 81, 56, 55, 40],
					[28, 48, 40, 19, 86, 27, 90]
				];
			}

			$scope.type = $scope.widget.graphType;
		}
	};

	this.setupCreatePage = function() {
		
		// Get all systems
		this.getSystems();

		$scope.widget = {};

		$scope.widget.graphType = "pie";

		$scope.widget.datasetPath = [];
		$scope.widget.fieldPath = [];

		$scope.datasets = [];
		$scope.fields = [];
		
		// Set created date
		$scope.widget.createdDate = moment().format('DD/MM/YYYY');

		// Set the created by user
		UserService.getCurrentUser().then(function(user) {
			$scope.widget.createdBy = {id : user._id, forename : user.forename};
		})

	};

	this.removeOneDatasetPath = function() {

		// Rem,ove the last added dataset
		$scope.widget.datasetPath.splice($scope.widget.datasetPath.length - 1, 1);

		self.searchableArray = this.traverseObject($scope.widget.datasetPath, self.responseObject);

		self.populateDatasets(self.searchableArray);

	};

	this.removeOneFieldPath = function() {

		// Remvoe the last select field option
		$scope.widget.fieldPath.splice($scope.widget.fieldPath.length - 1, 1);

		self.searchableObject = this.traverseObject($scope.widget.fieldPath, self.searchableArray[0]);

		self.populateFields(self.searchableObject);

	};

	this.clearFieldPath = function() {

		// Completly clear the selected field options
		$scope.widget.fieldPath = [];

		self.searchableObject = self.searchableArray[0];

		self.populateFields(self.searchableObject);
	};

	this.getForm = function() {
		// Get the form displayed on screen
		var scope = angular.element(document.getElementById("step-" + $("#wizard").smartWizard("currentStep") + "-form")).scope();

		var form = scope["widgetForm" + $("#wizard").smartWizard("currentStep")];

		// If a form has been found
		if(form) {
			// Return it to the calling method
			return form;
		}
	};

	this.validateSteps = function(context){

		if(context.toStep < context.fromStep) {
			// Previous clicked
			return true;
		}

		// Get the form displayed on screen
	  	var formId = "step-" + context.fromStep + "-form";

	  	var scope = angular.element(document.getElementById(formId)).scope();

		$scope.formValid = scope["widgetForm" + context.fromStep].$valid;

		// Return if the form is valid
      	return $scope.formValid;
	}

	this.onFinish = function() {

		// Get current scope 
		var currentScope = angular.element(document.getElementById("widgetController")).scope();

		// Create new widget
		this.createWidget(currentScope.widget);
	};

	this.errorHandler = function(error) {
		// Display an error message
        notificationService.error(error);
    };

	this.traverseObject = function(path, object) {

		if(path && path.length) {

			// Loop through all of the keys in the array
			for(var pathCount = 0; pathCount < path.length; pathCount++) {
				// Select each value for the key and continuing drilling down
				object = object[path[pathCount]];
			}

			// Return the object we want stats on
			return object;

		} else {
			// No path so return object
			return object;
		}
	}

});