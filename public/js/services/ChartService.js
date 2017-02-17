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

                    // If an object is returned containing just a single array
                    if(Array.isArray(apiResponse.data[Object.keys(apiResponse.data)[0]]) && Object.keys(apiResponse.data).length == 1) {
                        // Use that array as there are no other options currently
                        apiResponse.data = apiResponse.data[Object.keys(apiResponse.data)[0]];
                    }

                    // Get the dataset
                    resultArray = self.traverseObject(widget.datasetPath, apiResponse.data);

                    if(widget.graphType == "count") {
                        widget.data = 0;
                    } else {
                        widget.data = [];
                    }

                    widget.labels = [];

                    // Loop through returned results
                    for(var resultCount = 0; resultCount < resultArray.length; resultCount++) {

                        // Drill down to the field we want
                        self.fieldContent = self.traverseObject(widget.fieldPath, resultArray[resultCount]);

                        // If the value of the field is an array
                        if(Array.isArray(self.fieldContent)) {
                            // Count the values in the array for the stats instead
                            for(var index in self.fieldContent) {
                                var arrayValue = self.fieldContent[index];

                                // Calculate the stats for the value and set them on the widget
                                widget = self.calculateStats(widget, arrayValue);
                            }
                        } else {
                            // Calculate the stats for the value and set them on the widget
                            widget = self.calculateStats(widget, self.fieldContent);
                        }

                    }

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


                } catch(err) {
                    throw err;
                }

                return widget;

            }, function(errorMessage) {
                
                return errorMessage;

            });
        },

        calculateStats : function(widget, value) {

            if(widget.graphType == "count") {
                if(widget.value == value) {
                    widget.data++;
                }
            } else {
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
            }

            return widget;
        },

        traverseObject : function(path, object) {

            if(path && path.length) {

                // Loop through all of the keys in the array
                for(var pathCount = 0; pathCount < path.length; pathCount++) {
                    // Select each value for the key and continuing drilling down
                    object = object[path[pathCount]];
                }

                // Return the object we want stats on
                return object;

            } else {
                // No path so return object
                return object;
            }
        }

    };

    return self;

};