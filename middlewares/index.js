require('dotenv').config()
const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const session = require('express-session')
const cookieSession = require('cookie-session')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
const cookieConfig = {
  maxAge: 60000 * 20,
  secret: process.env.COOKIE_KEY
}

module.exports = (server) => {
  server.use(express.json())
  server.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })

  server.use(cors())
  server.use(cookieSession(cookieConfig))
  server.use(logger('dev'))
  server.use(helmet())
  // server.use(limiter)
  // server.use(cookieSession(cookieConfig))
}
