const userRoutes = require('./userRoutes')

module.exports = (server) => {
  server.use('/api/', userRoutes)
}
