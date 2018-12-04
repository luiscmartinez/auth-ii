require('dotenv').config()
const server = require('express')()
const { sequelize, Users, Google_users } = require('./components')
const port = process.env.PORT || 8000

require('./middlewares')(server) // run thru middleware

require('./components/user/')(server) // run thru components
require('./passport')(server)
require('./errorhandling')(server) // run thru errorhandlers

sequelize.sync({ force: true }).then(() => {
  server.listen(process.env.PORT, () => {
    console.log('\n=== API RUNNING... ===\n')
  })
})
