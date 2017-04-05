'use strict'

var MainModule = angular.module('MainModule');

MainModule.controller('HomeController', HomeController);

// Inject dependencies
HomeController.$inject = ['$scope', 'WidgetService', 'ChartService', 'notificationService', 'ModalService'];

function HomeController ($scope, WidgetService, ChartService, notificationService, ModalService) { 

    var self = this;

    this.init = function() {

        $scope.widgets = [];

        // Get widgets
        this.getWidgets();

    }

    this.removeWidget = function(widgetId) {

        // Set the modal message
        var message = "Are you sure you wish to remove this widget [" + widgetId + "] from the home screen?";
		var title = "Remove this widget?";

        // Display the moda;
		ModalService.displayModal(message, title).result.then(function (modal_response) {
			if(modal_response) {
                // Using underscore
                // Get the idnex where the id's match
                var index = _.chain($scope.widgets).pluck("_id").indexOf(widgetId).value();

                // Get the widget
                var widget = $scope.widgets[index];

                // Set display home as false
                widget.displayHome = "FALSE";

                // Update the widget
                WidgetService.update(widget).then(function(response) {
                    if(response.success == true) {
                        // Display a message
                        notificationService.info(response.message);
                    } else {
                        // Display an error
                        self.errorHandler("Unable to update widget:" + response.message);
                    }
                }, function(error) {
                    // Display an error
                    self.errorHandler("Unable to update widget:" + error.message);
                });

                // Remove from $scope
                if(index > -1) {
                    $scope.widgets.splice(index, 1);
                }
			}
		}, function (modal_response) {
			// Modal dismissed
			console.log("Modal dismissed: " + modal_response);
		});

	};

    this.getWidgets = function() {

        // Get the widgets for the home screen
        WidgetService.getForHome().then(function(widgets) {

            if(!widgets || widgets.length == 0) {
                // No widgets set for home screen
                return;
            }

            widgets.forEach(function (widget, i) {
                
                // Display each widget box as loading
                widget.loading = true;

                // Add widget to scope
                $scope.widgets.push(widget);

                try {

                    // Generate chart for widget
                    ChartService.generateChartData(widget)
                        .then(function(widget) {

                            // if its a bar chart
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
                                // Don't set any options
                                widget.options = {};
                            }
                        
                        // Update widget displayed on screen 
                        self.updateWidgetInScope(widget);

                    }, function(errorMessage) {
                        // Turn off the laoding animations
                        widget.loading = false;

                        // Set the error message
                        widget.error = errorMessage;

                        // Update widget displayed on screen 
                        self.updateWidgetInScope(widget);

                        // Log the error
                        console.log("Unable to contact sever for widget: " + widget._id);
                    });
                } catch(err) {
                    // Display an error to the user
                    self.errorHandler(err);
                }
            });
        });
	};

    this.updateWidgetInScope = function(widget) {
        // Find widget in scope and update
        $scope.widgets.forEach(function (scopeWidget, count) {

            // Find thw diegt in the scope
            if(widget._id == scopeWidget._id) {
                
                // Update it's details
                scopeWidget = widget;
                scopeWidget.loading = false;
            }

        });
    }

    this.errorHandler = function(error) {
        // Display an error
        notificationService.error(error);
    }

};