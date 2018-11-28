const Sequelize = require('sequelize')
const sequelize = require('../index')
let User = sequelize.define('users', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  department: {
    type: Sequelize.STRING
  }
})
sequelize.sync({ force: true })
module.exports = User
