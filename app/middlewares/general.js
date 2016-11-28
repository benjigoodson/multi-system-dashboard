// API endpoints for general queries
'use strict'

// Imports
var express = require('express');
var bodyParser = require('body-parser');

// instance of an express router
var router = express.Router();;

// parse data as application/json
router.use(bodyParser.json());

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded( { extended : false } ));

// Test api call
router.get('/', function(req, res) {
    console.log("Requested: GET - /api");
    res.json({ message : "API is online." });
});

module.exports = router;