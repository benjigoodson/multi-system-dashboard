'use strict'

var WidgetModule = angular.module('WidgetModule');

ChartService.$inject = ['$q', 'WidgetService'];
WidgetModule.factory('ChartService', ChartService);

function ChartService ($q, widgetService) {
	
	return {

        generateChartData : function(widgets) {

            var self = this;
            self.promises = [];

            var deferred = $q.defer();

            // Loop through the widgets returned.
            widgets.forEach(function(widget, i) {         

                // Make REST calls to get the data for each widgets             
                var promise = widgetService.makeRESTCall(widget.method, widget.apiURL).then(function(apiResponse) {

                    var resultArray = apiResponse.data;

                    widget.data = [];
                    widget.labels = [];

                    // Loop through returned results
                    for(var resultCount = 0; resultCount < resultArray.length; resultCount++) {

                        var value = resultArray[resultCount][widget.field]

                        // Get position of that value
                        var index = _.indexOf(widget.labels, value);

                        // If it's in the list
                        if(index !== -1) {
                            // Store each new value in an array, this will be our labels
                            widget.data[index] = widget.data[index] + 1;
                        } else {
                            // We already have that value stored increase it's data by 1                        
                            widget.labels.push(value);
                            // Count will be set as 1
                            widget.data.push(1);
                        }

                    }

                    return widget;

                }, function(errorMessage) {
                    
                   return errorMessage;

                });

                self.promises.push(promise);

            });

            $q.all(self.promises).then(function(widgets) {

                deferred.resolve(widgets);
            });

            return deferred.promise
        }

    };

};