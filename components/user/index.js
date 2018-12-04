const userRoutes = require('./userRoutes')

module.exports = (server) => {
  server.get('/', (req, res) => {
    res.status(200).json({ sanity: 'check' })
  })
  server.use('/api/', userRoutes)
}
