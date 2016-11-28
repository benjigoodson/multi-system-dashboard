var endpoints = [
    {
        "name" : "endpoint1",
        "createdDate" : "16/03/2016",
        "parentSystem" : "581338d7620f3ccc9031b2e9",
        "url" : "/systems",
        "requestType" : "GET",
        "requiresBody" : false,
        "body" : "",
        "description" : "This endpoint will return all systems stored in the database and that can be returned by the API"
    },
    {
        "name" : "url endpoint 3",
        "createdDate" : "15/01/1994",
        "parentSystem" : "581338d7620f3ccc9031b2e9",
        "url" : "/user",
        "requestType" : "POST",
        "requiresBody" : true,
        "body" : "{username : '', password: ''}",
        "description" : ""
    },
    {
        "name" : "i am number 4",
        "createdDate" : "12/10/2016",
        "parentSystem" : "581338d7620f3ccc9031b2e9",
        "url" : "/endpoints",
        "requestType" : "GET",
        "requiresBody" : false,
        "body" : "",
        "description" : ""
    },

];


db.endpoint.insert(endpoints);