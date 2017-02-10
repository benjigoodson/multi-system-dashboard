'use strict'

var WidgetModule = angular.module('WidgetModule');

// Imports
WidgetModule.constant("moment", moment);

WidgetModule.controller('WidgetController', function($scope, $http, $routeParams, $location, WidgetService, SystemService, EndpointService, 
	ChartService, UserService, notificationService) { 

	this.id = $routeParams.widget_id;

	var self = this;

	$scope.chart = {};

	self.blacklist = [
		"_id",
		"__v"
	];

	$scope.edit = false;

	this.createWidget = function(widgetData) {
		WidgetService.create(widgetData).then(function(response) {
			if(response.success == true) {
				notificationService.success(response.message);
				$location.path("/widget/" + response.data._id);
			} else {
				self.errorHandler("Unable to create widget:" + response.message);	
			}
		}, function(error) {
			self.errorHandler("Unable to create widget:" + response.message);
		});
	};

	this.getWidget = function() {
		WidgetService.getWidget(this.id).then(function(response) {

			var widget = response.data;
			widget.loading = true;

			$scope.widget = widget;

			// Now generate the graph
			try {

				// Generate chart for widget
				ChartService.generateChartData(widget)
					.then(function(widget) {
						if(widget.graphType == "bar") {

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
							widget.options = {};
                        }

						widget.loading = false;
                        $scope.widget = widget;

                    }, function(errorMessage) {
						$scope.widget.loading = false;
                        $scope.widget.error = errorMessage;

						console.log("Unable to contact sever for widget: " + widget._id);
                    });
			} catch(err) {
				self.errorHandler(err);
			}

		});
	};
	
	this.setEdit = function() {

		if($scope.edit == true) {
			$scope.edit = false;
		} else {
			$scope.edit = true;

			this.getFields($scope.widget.method, $scope.widget.apiURL).then(function(fields) {
				$scope.fields = fields;
			});
		}

	};

	this.saveWidget = function(widget) {

		WidgetService.update(widget).then(function(response) {

			if(response.success == true) {
				notificationService.info(response.message);

				// Now generate the graph
				try {

					// Generate chart for widget
					ChartService.generateChartData(widget)
						.then(function(widget) {
							if(widget.graphType == "bar") {

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
								widget.options = {};
							}

							widget.loading = false;
							$scope.widget = widget;

						}, function(errorMessage) {
							$scope.widget.loading = false;
							$scope.widget.error = errorMessage;

							console.log("Unable to contact sever for widget: " + widget._id);
						});
				} catch(err) {
					self.errorHandler(err);
				}

				self.setEdit();
			} else {
				self.errorHandler(response.message)
			}

		}, function(err) {
			self.errorHandler(err.error);
		});
	}

	this.deleteWidget = function(widgetId) {
		WidgetService.delete(widgetId).then(function(response) {

			if(response.success == true) {
				notificationService.success(response.message);
				$location.path("/");
			} else {
				self.errorHandler("Unable to delete widget:" + response.message);
			}

		}, function(error) {
			self.errorHandler("Unable to delete widget.");
		});
	};

	this.getWidgets = function() {
		WidgetService.getAll().then(function(data) {
			$scope.widgets = data;
		});
	};

	this.getSystems = function() {
		SystemService.getBasicSystems().then(function(response) {
			if(response.success == true) {
				$scope.systems = response.data;
			}
		});
	};

	this.systemChanged = function() {
		if($scope.widget.system) {
			var systemId = $scope.widget.system;

			$scope.fields = [];
			$scope.field = "";
			$scope.fieldPathDisplay = "";

			$scope.widget.fieldPath = [];

			this.getEndpoints(systemId);
		} else {
			$scope.endpoints = [];
		}
	};

	this.getEndpoints = function(systemId) {
		EndpointService.getBasicEndpoints(systemId).then(function(response) {
			if(response.success == true) {
				$scope.endpoints = response.data;
			}
		});
	};

	this.endpointChanged = function() {
		if($scope.widget.endpoint) {

			$scope.fields = [];

			$scope.dataset = "";
			$scope.datasetPathDisplay = "";

			$scope.field = "";			
			$scope.fieldPathDisplay = "";

			$scope.widget.datasetPath = [];
			$scope.widget.fieldPath = [];

			var apiURL;
			var method;

			for(var i = 0; i < $scope.endpoints.length; i++) {

				if($scope.endpoints[i].id == $scope.widget.endpoint) {
					$scope.requiresBody = $scope.endpoints[i].requiresBody;
					apiURL = $scope.endpoints[i].url;
					method = $scope.endpoints[i].requestType;
					break;
				}
			}

			$scope.widget.method = method;
			$scope.widget.apiURL = apiURL;

			this.getOptions(method, apiURL);			
		}
	};

	this.getOptions = function(method, apiURL) {

		// Test endpoint and get data back
		WidgetService.makeRESTCall(method, apiURL).then(function(response) {

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

				// List every options as dataset array
				for(var dataset in responseObject)
				{	
					if(!_.contains(self.blacklist, dataset)) {
						datasets.push(dataset);
					}
				}

				$scope.datasets = datasets;

				// Reset fields
				$scope.fields = [];

				// If response object is an array
				if(Array.isArray(responseObject)) {
					// Populate fields from the first object
					self.populateFields(responseObject[0]);
				}

				self.searchableArray = responseObject;

			} else {
				// display error with REST call
				this.errorHandler("Problem making REST call.");
			}

		});
	};

	this.populateFields = function(searchableObject) {

		var fields = [];

		for(var field in searchableObject)
		{	
			if(!_.contains(self.blacklist, field)) {
				fields.push(field);
			}
		}

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
			$scope.datasetPathDisplay = $scope.widget.datasetPath.join('.');

			$scope.widget.fieldPath = [];
			$scope.fieldPathDisplay = "";

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
			$scope.fieldPathDisplay = $scope.widget.fieldPath.join('.');

			$scope.chart.loading = true;

			try {
				// Display sample graph
				ChartService.generateChartData($scope.widget).then(function(widgetData) {	

					$scope.chart.graphType = widgetData.graphType;
					$scope.chart.data = widgetData.data;
					$scope.chart.labels = widgetData.labels;
					$scope.chart.loading = false;

				}, function(errorMessage) {

					$scope.chart.loading = false;
					$scope.chart.error = errorMessage;
					console.log("Unable to contact sever for widget: " + widget._id);

				});
			} catch(err) {
				$scope.chart.loading = false;
				$scope.chart.error = err;
				self.errorHandler(err);
			}
		}
	};

	this.graphChanged = function() {
		if($scope.widget.graphType) {
			// Display new graph
			if($scope.widget.graphType == "pie") {

				$scope.labels = [
					"Dark Grey",
					"Purple Color",
					"Gray Color",
					"Green Color",
					"Blue Color"
				];

				$scope.series = [];

				$scope.data = [120, 50, 140, 180, 100];

			} else {

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
		
		this.getSystems();

		$scope.widget = {};

		$scope.widget.graphType = "pie";

		$scope.widget.datasetPath = [];
		$scope.widget.fieldPath = [];

		$scope.requiresBody = false;

		$scope.datasets = [];
		$scope.fields = [];
		
		$scope.widget.createdDate = moment().format('DD/MM/YYYY');

		UserService.getCurrentUser().then(function(user) {
			$scope.widget.createdBy = {id : user._id, forename : user.forename};
		})

	};

	this.onFinish = function() {

		// Create new widget
		this.createWidget($scope.widget);

	};

	this.errorHandler = function(error) {
        notificationService.error(error);
    };

	$scope.type = "pie";

	$scope.labels = [
		"Dark Grey",
		"Purple Color",
		"Gray Color",
		"Green Color",
		"Blue Color"
	];

	$scope.series = [];

	$scope.data = [120, 50, 140, 180, 100];

});