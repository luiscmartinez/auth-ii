require('dotenv').config()
const server = require('express')()
const jwt = require('jsonwebtoken')

const { sequelize, Users, Google_users } = require('./components')
require('./middlewares')(server) // run thru middleware
require('./passport')(server)
require('./components/user/')(server) // run thru components
require('./components/google_user')(server)

server.get('/', (req, res) => {
  let token = jwt.sign({ google: 'google' }, process.env.SHHH, {
    expiresIn: '1d'
  })
  return res.status(200).redirect(`${process.env.SUCCESS_URL}`)
})

require('./errorhandling')(server) // run thru errorhandlers

sequelize.sync().then(() => {
  server.listen(process.env.PORT || 8000, () => {
    console.log('\n=== API RUNNING... ===\n')
    console.log(process.env.PORT || 8000)
  })
})
