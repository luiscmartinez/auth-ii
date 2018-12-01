const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
const cookieSession = require('cookie-session')

module.exports = (server) => {
  server.use(express.json())
  server.use(cors())
  server.use(logger('dev'))
  server.use(helmet())
  server.use(limiter)
  server.use(
    cookieSession({
      name: 'session',
      keys: [ 'cool' ],
      maxAge: 24 * 60 * 60 * 1000
    })
  )
}
