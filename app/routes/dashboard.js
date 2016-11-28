// API endpoints for dashboards

// Imports
var express = require('express');
var Dashboard = require('../models/dashboard');

// instance of an express router
var router = express.Router();

router.route('/dashboard');

router.route('/dashboard/:dashboard_id');

module.exports = router;