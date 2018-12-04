require('dotenv').config()
const server = require('express')()
const { sequelize, Users, Google_users } = require('./components')
const port = process.env.PORT || 5000
console.log(port)
server.set('port', port)
require('./middlewares')(server) // run thru middleware

require('./components/user/')(server) // run thru components
require('./passport')(server)

server.get('/', (req, res) => {
  res.status(200).json({ sanity: 'check' })
})
require('./errorhandling')(server) // run thru errorhandlers

sequelize.sync().then(() => {
  server.listen(port, () => console.log('\n=== API RUNNING... ===\n'))
})
