'use strict'

var WidgetModule = angular.module('WidgetModule');

// Imports
WidgetModule.constant("moment", moment);

WidgetModule.controller('WidgetController', function($scope, $http, $location, WidgetService, ChartService, UserService) { 

	this.createWidget = function(widgetData) {
		WidgetService.create(widgetData).then(function(response) {
			$location.path("/");
		}, function(error) {

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

			// Test endpoint and get data back
			WidgetService.makeRESTCall(method, apiURL).then(function(result) {

				if(result && result.status == 200) {

					// Reset fields
					$scope.fields = [];

					for(var field in result.data[0])
					{	
						if(!_.contains(self.fieldBlacklist, field)) {
							$scope.fields.push(field);
						}
					}

				} else {
					// display error with REST call
				}

			});

		} else {
			$scope.requiresBody = false;
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

	this.fieldChanged = function() {
		if($scope.widget.field) {

			// Display sample graph
			var promise = ChartService.generateChartData([$scope.widget]);
            
            if(promise) {
                promise.then(function(widgetData) {
                    $scope.chart = widgetData[0];
                });
            }

		}
	};

	this.setupCreatePage = function() {
		
		this.getSystems();

		// Get endpoints once system is selected

		$scope.widget = {};
		$scope.requiresBody = false;
		$scope.fields = [];

		this.fieldBlacklist = [
			"_id",
			"__v"
		];

		$scope.widget.createdDate = moment().format('DD/MM/YYYY');

		$scope.widget.createdBy = UserService.getCurrentUser().forename;

	};

	this.onFinish = function() {

		// Create new widget
		this.createWidget($scope.widget);

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