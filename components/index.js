const Sequelize = require('sequelize')

const sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: 'databases.sqlite'
})

module.exports = sequelize
