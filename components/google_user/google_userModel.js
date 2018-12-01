'use strict'

module.exports = (sequelize, DataTypes) => {
  const Google_users = sequelize.define(
    'Google_users',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  )
  Google_users.associate = function (models) {}
  return Google_users
}
