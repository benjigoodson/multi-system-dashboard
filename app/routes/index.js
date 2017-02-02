// backend api routes and auth calls
'use strict'

module.exports = function (app) {

  // Require other routes
  
  require('../middlewares/general')(app);
  require('../middlewares/auth')(app);

  app.use('/api/user', require('./user'))
  app.use('/api/system', require('./system'))
  app.use('/api/endpoint', require('./endpoint'))
  app.use('/api/widget', require('./widget'))
  app.use('/api/dashboard', require('./dashboard'))

  // Test api call
  app.get('/api', function(req, res) {
      console.log("Requested: GET - /api");
      res.json({ message : "API is online." });
  });

}