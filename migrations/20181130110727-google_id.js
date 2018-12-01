'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Google_users', 'id', Sequelize.STRING)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Google_users')
  }
}
