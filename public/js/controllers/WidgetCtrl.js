'use strict'

var WidgetModule = angular.module('WidgetModule');

// Imports
WidgetModule.constant("moment", moment);

WidgetModule.controller('WidgetController', function($scope, $http, $routeParams, $location, WidgetService, 
	ChartService, UserService, notificationService) { 

	this.id = $routeParams.widget_id;

	var self = this;

	self.fieldBlacklist = [
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
		WidgetService.getWidget(this.id).then(function(data) {

			var widget = data;
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
		WidgetService.getSystems().then(function(data) {
			$scope.systems = data;
		});
	};

	this.systemChanged = function() {
		if($scope.widget.system) {
			var systemId = $scope.widget.system;
			this.getEndpoints(systemId);
		} else {
			$scope.endpoints = [];
		}
	};

	this.getEndpoints = function(systemId) {
		WidgetService.getEndpoints(systemId).then(function(data) {
			$scope.endpoints = data;
		});
	};

	this.endpointChanged = function() {
		if($scope.widget.endpoint) {

			var self = this;

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


			this.getFields(method, apiURL).then(function(fields) {
				$scope.fields = fields
			});
			
		} else {
			$scope.requiresBody = false;
		}
	};

	this.getFields = function(method, apiURL) {

		// Test endpoint and get data back
		return WidgetService.makeRESTCall(method, apiURL).then(function(result) {

			if(result && result.status == 200) {

				// Reset fields
				var fields = [];

				var searchableObject;
				
				// If an object is returned containing a single array
				if(Array.isArray(result.data[Object.keys(result.data)[0]]) && Object.keys(result.data).length == 1) {
					// Use first object in that array
					searchableObject = result.data[Object.keys(result.data)[0]][0];
				} else {
					searchableObject = result.data[0];
				}

				for(var field in searchableObject)
				{	
					if(!_.contains(self.fieldBlacklist, field)) {
						fields.push(field);
					}
				}

				return fields;

			} else {
				// display error with REST call
			}

		});
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

	this.fieldChanged = function() {
		if($scope.widget.field) {

			// Display sample graph
			ChartService.generateChartData($scope.widget).then(function(widgetData) {
				$scope.chart = {};
				
				$scope.chart.graphType = widgetData.graphType;
				$scope.chart.data = widgetData.data;
				$scope.chart.labels = widgetData.labels;
			});
		}
	};

	this.setupCreatePage = function() {
		
		this.getSystems();

		$scope.widget = {};
		$scope.requiresBody = false;
		$scope.fields = [];

		$scope.widget.createdDate = moment().format('DD/MM/YYYY');

		$scope.widget.createdBy = UserService.getCurrentUser().forename;

	};

	this.onFinish = function() {

		// Create new widget
		this.createWidget($scope.widget);

	};

	this.errorHandler = function(error) {
        notificationService.error(error);
    }

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