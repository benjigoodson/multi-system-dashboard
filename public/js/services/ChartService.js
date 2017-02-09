'use strict'

var WidgetModule = angular.module('WidgetModule');

ChartService.$inject = ['WidgetService'];
WidgetModule.factory('ChartService', ChartService);

function ChartService (widgetService) {
	
	var self = {

        generateChartData : function(widget) {
 
            // Make REST calls to get the data for each widget           
            return widgetService.makeRESTCall(widget.method, widget.apiURL).then(function(apiResponse) {

                var resultArray;

                try {
                    // If no data in response
                    if(!apiResponse || apiResponse.status == -1 || !apiResponse.data) {
                        throw "No response from server.";
                    }

                    // If an object is returned containing a single array
                    if(Array.isArray(apiResponse.data[Object.keys(apiResponse.data)[0]]) && Object.keys(apiResponse.data).length == 1) {
                        // Use that array
                        resultArray = apiResponse.data[Object.keys(apiResponse.data)[0]];
                    } else {
                        resultArray = apiResponse.data;
                    }

                    widget.data = [];
                    widget.labels = [];

                    // Loop through returned results
                    for(var resultCount = 0; resultCount < resultArray.length; resultCount++) {

                        self.fieldContent = resultArray[resultCount][widget.field]

                        // If the value of the field is an array
                        if(Array.isArray(self.fieldContent)) {
                            // Count the values in the array for the stats instead
                            for(var index in self.fieldContent) {
                                var arrayValue = self.fieldContent[index];

                                widget = self.calculateStats(widget, arrayValue);
                            }
                        } else {
                            widget = self.calculateStats(widget, self.fieldContent);
                        }

                    }
                } catch(err) {
                    throw err;
                }

                return widget;

            }, function(errorMessage) {
                
                return errorMessage;

            });
        },

        calculateStats : function(widget, value) {
            // Get position of that value if we have already counted it
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

            return widget;
        }

    };

    return self;

};