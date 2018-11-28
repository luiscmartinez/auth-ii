const Sequelize = require('sequelize')

const sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: 'database.sqlite'
})

module.exports = sequelize
