require('dotenv').config()
const server = require('express')()
const jtw = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
var Sequelize = require('sequelize')

var sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: 'database.sqlite'
})

let User = sequelize.define('User', {
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

sequelize.sync()

function getToken (user) {
  const { department } = user
  return jtw.sign({ department }, 'nos', {
    expiresIn: '1d'
  })
}
// REGISTER
function registerUser (req, res, next) {
  let { password, username, department } = req.body
  password = bcrypt.hashSync(password, 10)
  User.create({
    username,
    password,
    department
  })
    .then((insertedUser) => {
      const token = getToken(insertedUser)
      return res.status(201).json({ token })
    })
    .catch(next)
}

const getUsers = (req, res, next) => {
  User.all()
    .then((users) => {
      return res.status(200).json({ users })
    })
    .catch(next)
}

// LOGIN
const login = (req, res, next) => {
  const credentials = req.body
  User.findOne({
    where: { username: `${credentials.username}` }
  })
    .then((insertedUser) => {
      let user = insertedUser
      const lol = bcrypt.compareSync(credentials.password, user.password)
      if (lol === true) {
        const token = getToken(user)
        res.status(200).json({ mes: 'Logged In', token })
      } else {
        return res.status(401).json({ error: 'U shall not pass!' })
      }
    })
    .catch(next)
}
// restricted
const restricted = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jtw.verify(token, 'nos', (err, decodedToken) => {
      if (err) {
        return res
          .status(401)
          .json({ error: 'you shall not pass!! - token invalid' })
      }
      req.token = decodedToken
      next()
    })
  } else {
    return res.status(401).json({ error: 'you shall not pass!! - no token' })
  }
}

function departmentUsers (req, res, next) {
  const department = req.token.department
  User.findAll({
    where: { department }
  })
    .then((response) => {
      return res.status(200).json(response)
    })
    .catch(next)
}
// Register
server.post('/register', registerUser)
// GET USERS
server.get('/users', getUsers)
// LOGIN
server.post('/login', login)
// Restricted
server.get('/restricted', restricted, getUsers)
// Get Department
server.get('/departments', restricted, departmentUsers)

module.exports = server
