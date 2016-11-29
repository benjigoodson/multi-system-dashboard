'use strict'

var MainModule = angular.module('MainModule');

MainModule.controller('HomeController', HomeController);

HomeController.$inject = ['$scope', 'WidgetService', 'ChartService', 'notificationService'];
function HomeController ($scope, widgetService, chartService, notificationService) { 

    this.init = function() {

        this.errorHandler("error000001");

        $scope.type = "pie";

        this.getWidgets();

    }

    this.getWidgets = function() {

		widgetService.getAll().then(function(widgets) {

            var promise = chartService.generateChartData(widgets)
            
            if(promise) {
                promise.then(function(widgets) {

                    widgets.forEach(function (widget, index) {

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

                    });

                    $scope.widgets = widgets;
                });
            }

        });
	};

    $scope.onClick = function(){
        
    }

    this.labels = ["January", "February", "March", "April", "May", "June", "July"];

    this.series = ['Series A', 'Series B'];

    this.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];

    this.errorHandler = function(error) {

        notificationService.info("message");
    }

};