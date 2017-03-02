'use strict'

var DashboardModule = angular.module('DashboardModule');

// Imports
DashboardModule.constant("moment", moment);

DashboardModule.controller('DashboardController', DashboardController);

DashboardController.$inject = ['$scope', '$location', '$routeParams', 'UserService', 'DashboardService', 
	'WidgetService', 'ChartService', 'notificationService', 'ModalService'];
function DashboardController($scope, $location, $routeParams, UserService, DashboardService, WidgetService, 
	ChartService, notificationService, ModalService) {

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
					WidgetService.getWidget(widgetId).then(function(response) {
						self.savedWidgets.push(response.data);
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

	this.viewAllWidgets = function() {

		$scope.widgets = [];

		WidgetService.getAll().then(function(widgets) {

            if(!widgets || widgets.length == 0) {
                // No widgets
                return;
            }

			widgets.forEach(function (widget, i) {
				self.displayWidget(widget);
			});

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

		this.updateDashboard().then(function(response) {

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

	this.updateDashboard = function() {
		return DashboardService.update(this.dashboard)
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
			self.errorHandler("Unable to load dashboard:" + error.message);
		});

	};

	this.getWidgetsForDashboard = function() {
		
		if(self.dashboard.widgets && self.dashboard.widgets.length > 0) {
			
			self.dashboard.widgets.forEach(function (widgetId, i) {
				WidgetService.getWidget(widgetId).then(function(response) {
					if(response.success == true && response.data) {
						self.displayWidget(response.data);
					}
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
			widget.loading = false;
			widget.error = err;
			self.errorHandler(err);
		}
	};

	this.deleteDashboard = function(dashboardId) {

		var message = "Are you sure you wish to delete this dashboard, '" + self.dashboard.name + "' [" + dashboardId + "]?";
		var title = "Delete this dashboard?";

		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
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
			}
		}, function (modal_response) {
			// Modal dismissed
			console.log("Modal dismissed: " + modal_response);
		});
	};

	this.setupCreatePage = function() {
		$scope.dashboard = {};

		$scope.dashboard.createdDate = moment().format('DD/MM/YYYY');

		UserService.getCurrentUser().then(function(user) {
			$scope.dashboard.createdBy = {id : user._id, forename : user.forename};
		})

		$scope.widgets=[];

		WidgetService.getAll().then(function(widgets) {
			$scope.widgets = widgets;
		});
	};

	this.removeWidget = function(widgetId) {

		var index = _.indexOf(this.dashboard.widgets, widgetId);

		// Should always be, but error checking
		if(index > -1) {
			this.dashboard.widgets.splice(index, 1);
		}

		// Update dashboard
		this.updateDashboard().then(function(response) {
			if(response.success == true) {
				notificationService.info(response.message);
			} else {
				self.errorHandler("Unable to update dashboard:" + response.message);
			}

		}, function(error) {
			self.errorHandler("Unable to update dashboard:" + error);
		});

		// Remove from $scope
		var scopeIndex = _.chain($scope.widgets).pluck("_id").indexOf(widgetId).value();

		if(scopeIndex > -1) {
			$scope.widgets.splice(scopeIndex, 1);
		}

	};

	this.deleteWidget = function(widgetId) {

		var message = "Are you sure you wish to delete this widget [" + widgetId + "]?";
		var title = "Delete this widget?";

		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
				WidgetService.delete(widgetId).then(function(response) {

					if(response.success == true) {
						notificationService.success(response.message);
						self.viewAllWidgets();
					} else {
						self.errorHandler("Unable to delete widget:" + response.message);
					}

				}, function(error) {
					self.errorHandler("Unable to delete widget.");
				});
			}
		}, function (modal_response) {
			// Modal dismissed
			console.log("Modal dismissed: " + modal_response);
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