const googleRoutes = require('./google_userRoutes')
module.exports = (server) => {
  server.use('/auth/google', googleRoutes)
}
