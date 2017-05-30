'use strict'

var DashboardModule = angular.module('DashboardModule');

// Constant Imports
DashboardModule.constant("moment", moment);

DashboardModule.controller('DashboardController', DashboardController);

// Inject dependencies
DashboardController.$inject = ['$scope', '$location', '$routeParams', 'UserService', 'DashboardService', 
	'WidgetService', 'ChartService', 'notificationService', 'ModalService'];

function DashboardController($scope, $location, $routeParams, UserService, DashboardService, WidgetService, 
	ChartService, notificationService, ModalService) {

	var self = this;

	this.id = "";
	this.dashboard = {};

	// function called when loading a dashboard page
	this.init = function() {

		// Set the id as the dashboard_id in the route params
		// If this isn't set it will be undefined.
		this.id = $routeParams.dashboard_id;

		// Get the dashboard which matches the id
		this.getDashboard().then(function(dashboard) {

			// Set the dashboard
			self.dashboard = dashboard;

			// Set the widgets array on the scope as empty
			$scope.widgets = [];

			// Get the widgets for the selected dashboard
			self.getWidgetsForDashboard();
		});

	};

	// funcation called when opening the edit page 
	this.initEdit = function() {

		// Set the id
		this.id = $routeParams.dashboard_id;

		// Get the dashboard
		this.getDashboard().then(function(dashboard) {
			self.dashboard = dashboard;
			
			// Create an empty array for the widgets
			self.savedWidgets = [];

			// If any widgets are already saved on the dashboard
			if(self.dashboard.widgets && self.dashboard.widgets.length > 0) {
				// For each widget
				self.dashboard.widgets.forEach(function (widgetId, i) {
					// Get the widget that is saved
					WidgetService.getWidget(widgetId).then(function(response) {
						// Add the widget to the array
						self.savedWidgets.push(response.data);
					});
				});
			}
		});

		// Get all widgets that can be selected
		$scope.widgets = [];

		// Get all widgets
		WidgetService.getAll().then(function(widgets) {
			// Set these widgets
			$scope.widgets = widgets;
		});

	};

	this.viewAllWidgets = function() {

		$scope.widgets = [];

		// Get all widgets
		WidgetService.getAll().then(function(widgets) {

			// If no widgets
            if(!widgets || widgets.length == 0) {
                // No widgets
                return;
            }

			// For each widget
			widgets.forEach(function (widget, i) {
				// Display the widget on screen
				self.displayWidget(widget);
			});

		});

	};

	this.createDashboard = function() {

		// Create a dashboard
		DashboardService.create($scope.dashboard).then(function(response) {
			// If the response says it create the dashboard
			if(response.success == true) {
				// Display a notification
				notificationService.success(response.message);

				UserService.getCurrentUser().then(function(user) {
				
					// Update the menu
					DashboardService.updateMenu(user._id);

					// Go to the dashboard that has just been created
					$location.path("/dashboard/" + response.data._id);
				})


			} else {
				// Display an error
				self.errorHandler("Unable to create dashboard:" + response.message);	
			}
		}, function(error) {
			// Display an error
			self.errorHandler("Unable to create dashboard:" + error.message);
		});
	};

	this.saveDashboard = function() {

		// Get the id's of the widgets
		this.dashboard.widgets = this.getWidgetsIds(self.savedWidgets);

		// Update the dashboard
		this.updateDashboard().then(function(response) {

			// If saved successfully
			if(response.success == true) {
				// Display a message
				notificationService.info(response.message);
				
				// Go to the dashboard
				$location.path("/dashboard/" + response.data._id);
			} else {
				// Display an error
				self.errorHandler("Unable to update dashboard:" + response.message);
			}

		}, function(error) {
			// Display an error
			self.errorHandler("Unable to update dashboard:" + error.message);
		});

	};

	this.updateDashboard = function() {
		// Update the dashboard
		return DashboardService.update(this.dashboard)
	};

	this.getWidgetsIds = function(fullWidgets) {

		var widgetsIds = [];

		// If widgets have been set
		if(fullWidgets && fullWidgets.length > 0) {
			// Get all widget ids
			fullWidgets.forEach(function (fullWidget, i) {
				// Add each widget id to the array
				widgetsIds.push(fullWidget._id);
			});
		}

		// Return the widget ids
		return widgetsIds;

	};

	this.getDashboard = function() {

		// Get a dashboard for the id
		return DashboardService.get(this.id).then(function(response) {
			// Return the dashboard
			return response.data;
		}, function(error) {
			// Display an error
			self.errorHandler("Unable to load dashboard:" + error.message);
		});

	};

	this.getWidgetsForDashboard = function() {
		
		// If wigets are set
		if(self.dashboard.widgets && self.dashboard.widgets.length > 0) {
			
			// For each widget
			self.dashboard.widgets.forEach(function (widgetId, i) {
				// Get the widget details
				WidgetService.getWidget(widgetId).then(function(response) {
					// If response is correct 
					if(response.success == true && response.data) {
						// Display the widget on screen
						self.displayWidget(response.data);
					}
				});
			});
		}

	};

	this.getWidget = function(widgetId) {
		// Get a widget for the id passed
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

			// Generate chart data for widget
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
						// Else the widget has no specfic options
						widget.options = {};
					}

				// Update the widget in the scope with these new details
				self.updateWidgetInScope(widget);

			}, function(errorMessage) {
				widget.loading = false;
				// Set error message on the widget
				widget.error = errorMessage;

				// Update the widget in the scope with these new details
				self.updateWidgetInScope(widget);

				// Log the error
				console.log("Unable to contact sever for widget: " + widget._id);
			});
		} catch(err) {
			widget.loading = false;
			widget.error = err;

			// Display an error
			self.errorHandler(err);

			// Log the error
			console.log("Unable to contact sever for widget: " + widget._id);
			console.log("Error: " + err);
		}
	};

	this.deleteDashboard = function(dashboardId) {

		// Set text for the modal
		var message = "Are you sure you wish to delete this dashboard, '" + self.dashboard.name + "' [" + dashboardId + "]?";
		var title = "Delete this dashboard?";

		// Display the modal
		ModalService.displayModal(message, title).result.then(function (modal_response) {
			// If the user clicked ok
			if(modal_response) {
				// Delete the dashboard
				DashboardService.delete(dashboardId).then(function(response) {

					// If result is ok
					if(response.data.success == true) {
						// Display a notification
						notificationService.success(response.data.message);

						UserService.getCurrentUser().then(function(user) {
				
							// Update the menu
							DashboardService.updateMenu(user._id);

							// Go back to the home screen
							$location.path("/");
						});

					} else {
						// Display an error
						self.errorHandler("Unable to delete dashboard:" + response.data.message);
					}

				}, function(error) {
					// Display an error
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

		// Set the created data
		$scope.dashboard.createdDate = moment().format('DD/MM/YYYY');

		// Get the user
		UserService.getCurrentUser().then(function(user) {
			// Set the created by
			$scope.dashboard.createdBy = {id : user._id, forename : user.forename};
		})

		$scope.widgets=[];

		// Get all widgets
		WidgetService.getAll().then(function(widgets) {
			$scope.widgets = widgets;
		});
	};

	this.removeWidget = function(widgetId) {

		// Get the index of the widget
		var index = _.indexOf(this.dashboard.widgets, widgetId);

		// Should always be, but error checking
		if(index > -1) {
			// Remvoe the id form the array
			this.dashboard.widgets.splice(index, 1);
		} else {
			return;
		}

		// Update dashboard
		this.updateDashboard().then(function(response) {
			if(response.success == true) {
				// Dipslay notification
				notificationService.info(response.message);
			} else {
				// Display an error
				self.errorHandler("Unable to update dashboard:" + response.message);
			}

		}, function(error) {
			// Display an error
			self.errorHandler("Unable to update dashboard:" + error);
		});

		// Remove from $scope
		var scopeIndex = _.chain($scope.widgets).pluck("_id").indexOf(widgetId).value();

		// Remove the widget from the scope displayed on screen
		if(scopeIndex > -1) {
			$scope.widgets.splice(scopeIndex, 1);
		}

	};

	this.deleteWidget = function(widgetId) {

		// Set text for the modal
		var message = "Are you sure you wish to delete this widget [" + widgetId + "]?";
		var title = "Delete this widget?";

		// Display the modal
		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
				// Delete the widget
				WidgetService.delete(widgetId).then(function(response) {

					if(response.success == true) {
						// Display success
						notificationService.success(response.message);
						self.viewAllWidgets();
					} else {
						// Display an error
						self.errorHandler("Unable to delete widget:" + response.message);
					}

				}, function(error) {
					// Display an error
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
		// Use the notifciation service to display the error
		notificationService.error(error);
	};

};