require('dotenv').config()
const server = require('express')()
const { sequelize, Users, Google_users } = require('./components')
const port = process.env.PORT || 8000

require('./middlewares')(server) // run thru middleware

require('./components/user/')(server) // run thru components
require('./passport')(server)
require('./errorhandling')(server) // run thru errorhandlers

server.set('port', port)

sequelize.sync().then(() => {
  server.listen(port, () => console.log('\n=== API RUNNING... ===\n'))
})
