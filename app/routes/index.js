// backend api routes and auth calls
'use strict'

module.exports = function (app) {

  // Require other routes
  app.use('/api/', require('../middlewares/general'))
  app.use('/api/authenticate', require('../middlewares/auth'))
  app.use('/api/user', require('./user'))
  app.use('/api/system', require('./system'))
  app.use('/api/endpoint', require('./endpoint'))
  //app.use('/api/dashboard', require('./dashboard')
  app.use('/api/widget', require('./widget'))
}