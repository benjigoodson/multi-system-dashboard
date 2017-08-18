'use strict'

var WidgetModule = angular.module('WidgetModule');

ChartService.$inject = ['WidgetService'];
WidgetModule.factory('ChartService', ChartService);

function ChartService (widgetService) {
	
	var self = {

        generateChartData : function(widget) {

            var method = widget.method;
            var apiURL = widget.apiURL;

            // Optional varibles
            var apiKey = widget.apiKey || '';
            var requestParam = widget.requestParam || '';

            // Make REST calls to get the data for the widget           
            return widgetService.makeRESTCall(method, apiURL, apiKey, requestParam).then(function(apiResponse) {

                var resultArray;

                try {
                    // If no data in response
                    if((!apiResponse || !apiResponse.status || apiResponse.status == -1 || !apiResponse.data) && !apiResponse.message) {
                        throw "No response from server.";
                    } else if(apiResponse.message) {
                        throw apiResponse.message;
                    } else if(apiResponse.status != 200) {
                        // If response is not 200 (Ok) then throw error
                        throw "Not an ok status from server.";
                    }

                    // If an object is returned containing just a single array
                    if(Array.isArray(apiResponse.data[Object.keys(apiResponse.data)[0]]) && Object.keys(apiResponse.data).length == 1) {
                        // Use that array as there are no other options currently
                        apiResponse.data = apiResponse.data[Object.keys(apiResponse.data)[0]];
                    }

                    // Get the dataset
                    resultArray = self.traverseObject(widget.datasetPath, apiResponse.data);

                    if(!resultArray) {
                        throw "Results cannot be traversed.";
                    }

                    // Set the data as either an integer or an array
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

                    // If its a barchart
                    if(widget.graphType == "bar") {

                        // Give ti these options
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
                        // Don;t give it any custom options
                        widget.options = {};
                    }


                } catch(err) {
                    // Throw the error
                    throw err;
                }

                // Return the completed widget
                return widget;

            }, function(errorMessage) {
                
                // Return the error message
                return errorMessage;

            });
        },

        calculateStats : function(widget, value) {

            if(widget.graphType == "count") {
                if(widget.value == value) {
                    // If the value matches the value we want to count
                    // Increase the data value
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

            // Return the widget
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