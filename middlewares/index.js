const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

module.exports = (server) => {
  server.use(express.json())
  server.use(cors())
  server.use(logger('dev'))
  server.use(helmet())
  server.use(limiter)
}
