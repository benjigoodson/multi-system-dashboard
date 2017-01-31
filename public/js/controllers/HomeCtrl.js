'use strict'

var MainModule = angular.module('MainModule');

MainModule.controller('HomeController', HomeController);

HomeController.$inject = ['$scope', 'WidgetService', 'ChartService', 'notificationService'];
function HomeController ($scope, widgetService, chartService, notificationService) { 

    var self = this;

    this.init = function() {
        $scope.type = "pie";

        $scope.widgets = [];

        this.getWidgets();

    }

    this.getWidgets = function() {

		widgetService.getAll().then(function(widgets) {

            widgets.forEach(function (widget, i) {
                
                // Display each widget box as loading
                widget.loading = true;

                // Add widget to scope
                $scope.widgets.push(widget);

                try {

                    // Generate chart for widget
                    chartService.generateChartData(widget)
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
            });
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
    }

    this.labels = ["January", "February", "March", "April", "May", "June", "July"];

    this.series = ['Series A', 'Series B'];

    this.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];

    this.errorHandler = function(error) {

        notificationService.error(error);
    }

};