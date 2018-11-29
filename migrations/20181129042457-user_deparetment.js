'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    // forgot to add department column => adding here
    return queryInterface.addColumn('Users', 'department', Sequelize.TEXT)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
