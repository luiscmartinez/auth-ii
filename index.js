const server = require('express')()
require('./middlewares')(server)
require('./components/user/')(server)

server.listen(8000, () => {
  console.log('\n=== API RUNNING... ===\n')
})
