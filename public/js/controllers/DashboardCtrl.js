'use strict'

var DashboardModule = angular.module('DashboardModule');

// Imports
DashboardModule.constant("moment", moment);

DashboardModule.controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', '$location', '$routeParams', 'UserService', 'DashboardService', 
	'WidgetService', 'ChartService', 'notificationService'];
function DashboardController($scope, $location, $routeParams, UserService, DashboardService, WidgetService, 
	ChartService, notificationService) {

	var self = this;

	this.id = "";
	this.dashboard = {};

	this.init = function() {

		this.id = $routeParams.dashboard_id;

		this.getDashboard().then(function(dashboard) {
			self.dashboard = dashboard;

			$scope.widgets = [];

			self.getWidgetsForDashboard();
		});

	};

	this.initEdit = function() {

		// Set the id
		this.id = $routeParams.dashboard_id;

		// Get the dashboard
		this.getDashboard().then(function(dashboard) {
			self.dashboard = dashboard;
			
			self.savedWidgets = [];

			if(self.dashboard.widgets && self.dashboard.widgets.length > 0) {
				// Get all widgets that are saved
				self.dashboard.widgets.forEach(function (widgetId, i) {
					WidgetService.getWidget(widgetId).then(function(widget) {
						self.savedWidgets.push(widget);
					});
				});
			}
		});

		// Get all widgets that can be selected
		$scope.widgets = [];

		WidgetService.getAll().then(function(widgets) {
			$scope.widgets = widgets;
		});

	};

	this.createDashboard = function() {

		DashboardService.create($scope.dashboard).then(function(response) {
			if(response.success == true) {
				notificationService.success(response.message);
				DashboardService.updateMenu();
				$location.path("/dashboard/" + response.data._id);
			} else {
				self.errorHandler("Unable to create dashboard:" + response.message);	
			}

			DashboardService.updateMenu();
		}, function(error) {
			self.errorHandler("Unable to create dashboard:" + error.message);
		});
	};

	this.saveDashboard = function() {

		this.dashboard.widgets = this.getWidgetsIds(self.savedWidgets);

		DashboardService.update(this.dashboard).then(function(response) {

			if(response.success == true) {
				notificationService.info(response.message);
				$location.path("/dashboard/" + response.data._id);
			} else {
				self.errorHandler("Unable to update dashboard:" + response.message);
			}

		}, function(error) {
			self.errorHandler("Unable to update dashboard:" + error.message);
		});
	};

	this.getWidgetsIds = function(fullWidgets) {

		var widgetsIds = [];

		if(fullWidgets && fullWidgets.length > 0) {
			// Get all widget ids
			fullWidgets.forEach(function (fullWidget, i) {
				widgetsIds.push(fullWidget._id);
			});
		}

		return widgetsIds;

	};

	this.getDashboard = function() {

		return DashboardService.get(this.id).then(function(response) {
			return response.data;
		}, function(error) {
			self.errorHandler("Unable to load dashboard:" + response.message);
		});

	};

	this.getWidgetsForDashboard = function() {
		
		if(self.dashboard.widgets && self.dashboard.widgets.length > 0) {
			
			self.dashboard.widgets.forEach(function (widgetId, i) {
				WidgetService.getWidget(widgetId).then(function(widget) {
					self.displayWidget(widget);
				});
			});
		}

	};

	this.getWidget = function(widgetId) {
		WidgetService.getWidget(widgetId).then(function(widget) {
			return widget;
		});
	}

	this.displayWidget = function(widget) {

		// Display each widget box as loading
		widget.loading = true;

		// Add widget to scope
		$scope.widgets.push(widget);

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

				self.updateWidgetInScope(widget);

			}, function(errorMessage) {
				widget.loading = false;
				widget.error = errorMessage;

				self.updateWidgetInScope(widget);

				console.log("Unable to contact sever for widget: " + widget._id);
			});
		} catch(err) {
			self.errorHandler(err);
		}
	};

	this.deleteDashboard = function(dashboardId) {
		DashboardService.delete(dashboardId).then(function(response) {

			if(response.data.success == true) {
				notificationService.success(response.data.message);
				$location.path("/");
			} else {
				self.errorHandler("Unable to delete dashboard:" + response.data.message);
			}

			DashboardService.updateMenu();

		}, function(error) {
			self.errorHandler("Unable to delete dashboard: " + error);
		});
	};

	this.setupCreatePage = function() {
		$scope.dashboard = {};

		$scope.dashboard.createdDate = moment().format('DD/MM/YYYY');
		$scope.dashboard.createdBy = UserService.getCurrentUser().forename;

		$scope.widgets=[];

		WidgetService.getAll().then(function(widgets) {
			$scope.widgets = widgets;
		});
	};

	this.updateWidgetInScope = function(widget) {
        // Find widget in scope and update
        $scope.widgets.forEach(function (scopeWidget, count) {

            if(widget._id == scopeWidget._id) {                
                widget.loading = false;
                scopeWidget = widget;
            }

        });
    };

	this.errorHandler = function(error) {
		notificationService.error(error);
	};

};