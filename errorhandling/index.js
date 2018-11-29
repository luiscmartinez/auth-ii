const logErrorStack = require('./errorLogStack')
const clientErrorHandler = require('./clientErrorHandler')
module.exports = (server) => {
  server.use(logErrorStack)
  server.use(clientErrorHandler)
}
