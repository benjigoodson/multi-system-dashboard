// factory used to generate data
'use strict'

module.exports.validDashboard = function() {
  // Return a valid Dashboard
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
  // Return a valid Endpoint
  return {
    name : "EndpointTest",
    description : "This is a description",
    parentSystem : "507f1f77bcf86cd799439011",
    url : "/test/endpoint",
    requestType : "GET",
    requiresParam : true,
    createdDate : "01/01/17",
    createdBy : {
        id : "507f1f77bcf86cd799439011",
        forename : "Ben"
    }
  };
};

module.exports.validSystem = function() {
  // Return a valid System
  return {
    name : "SystemTest",
    description : "This is a description",
    status : "online",
    contact : "email@email.com",
    url : "http://google.com",
    createdDate : "01/01/17",
    createdBy : {
        id : "507f1f77bcf86cd799439011",
        forename : "Ben"
    }
  };
};

module.exports.validUser = function() {
  // Return a valid User
  return {
    forename : "Ben",
    surname : "Goodson",
    email : "email@email.com",
    password : "MyPassword",
    image : "Path/To/Image",
    location : "Sunderland",
    company : "company",
    website : "myWebsite.com",
    createdDate : "01/01/17",
    createdBy : {
        id : "507f1f77bcf86cd799439011",
        forename : "Ben"
    }
  };
};