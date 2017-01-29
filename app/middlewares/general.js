// API endpoints for general queries
'use strict'

// Imports
var bodyParser = require('body-parser');

module.exports = function (app) {
    // parse data as application/json
    app.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded( { extended : true } ));

}