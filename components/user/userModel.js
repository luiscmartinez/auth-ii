'use strict'

module.exports = (sequelize, DataTypes) => {
  // can replace DataTypes with Sequelize to match migration tables
  // DataTypes reads better in this case
  const Users = sequelize.define(
    'Users',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          requirements: function (bodyValues) {
            if (bodyValues.length <= 3 || bodyValues.length > 20) {
              throw new Error('requirement')
            }
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  )
  Users.associate = function (models) {}
  return Users
}
