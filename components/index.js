'use strict'
const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')
const Sequelize = require('sequelize') // create Sequelize object & connect to DB
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.json')[env]
const db = {}

let sequelize
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}
// __dirname === /Users/chivo/lambda-pm/auth-ii/components

const isDirectory = (__dirname) => lstatSync(__dirname).isDirectory() // checks if files are directories  true || false
const getDirectories = () =>
  readdirSync(__dirname) // files inside target directory
    .map(
      (name) => join(__dirname, name) //index.js & user
    )
    .filter(isDirectory)

const directoryArr = getDirectories() // Array full of all directory paths

directoryArr.forEach((dir) => {
  readdirSync(dir) // read thru the current directory
    .filter((file) => file.slice(-8) === 'Model.js') // finding the file defineing model's schema
    .forEach((file) => {
      const model = sequelize['import'](join(dir, file)) // having sequelize import model file
      db[model.name] = model // model User = to model
    })
})

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize // creating access to sequelize object
db.Sequelize = Sequelize

module.exports = db
