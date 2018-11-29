const server = require('express')()
const { sequelize } = require('./components')
require('./middlewares')(server) // run thru middleware
require('./components/user/')(server) // run thru components
require('./errorhandling')(server) // run thru errorhandlers

sequelize.sync().then(() => {
  server.listen(8000, () => {
    console.log('\n=== API RUNNING... ===\n')
  })
})
