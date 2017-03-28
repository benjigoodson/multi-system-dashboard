// factory used to generate data
'use strict'

module.exports.validDashboard = function() {
  return {
    name : "DashboardTest",
    description : "This is a description",
    widgets : ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439011"],
    createdDate : "01/01/17",
    createdBy : {
        id : "507f1f77bcf86cd799439011",
        forename : "Ben"
    }
  };
};

module.exports.validEndpoint = function() {
  return {
    name : "DashboardTest",
    description : "This is a description",
    parentSystem : "507f1f77bcf86cd799439011",
    url : "http://google.com",
    requestType : "GET",
    requiresParam : true,
    createdDate : "01/01/17",
    createdBy : {
        id : "507f1f77bcf86cd799439011",
        forename : "Ben"
    }
  };
};