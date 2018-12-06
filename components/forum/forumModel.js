'use strict'

module.exports = (sequelize, DataTypes) => {
  // can replace DataTypes with Sequelize to match migration tables
  // DataTypes reads better in this case
  const Forum = sequelize.define(
    'Forums',
    {
      post: {
        type: DataTypes.TEXT,
        allowNull: false,
        len: [ 1, 1000 ]
      }
    },
    {}
  )
  Forum.associate = function (models) {}
  return Forum
}
