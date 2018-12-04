require('dotenv').config()
const { sequelize, Users } = require('../')
const jtw = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports = {
  // REGISTER
  registerUser (req, res, next) {
    let { password, username, department } = req.body
    password = bcrypt.hashSync(password, 10)
    Users.create({
      username,
      password,
      department
    })
      .then((insertedUser) => {
        let { department } = insertedUser
        let token = jtw.sign({ department }, process.env.SHHH, {
          expiresIn: '1d'
        })
        return res.status(201).json({ token })
      })
      .catch(next)
  },
  getUsers (req, res, next) {
    Users.all()
      .then((users) => {
        return res.status(200).json({ users })
      })
      .catch(next)
  },

  // LOGIN
  login (req, res, next) {
    const credentials = req.body
    Users.findOne({
      where: { username: `${credentials.username}` }
    })
      .then((insertedUser) => {
        if (insertedUser === null) return next(Error('wrong credentials'))
        let { password, department } = insertedUser
        const lol = bcrypt.compareSync(credentials.password, password)
        if (lol === true) {
          let token = jtw.sign({ department }, process.env.SHHH, {
            expiresIn: '1d'
          })
          res.status(200).json({ mes: 'Logged In', token })
        } else {
          return res.status(401).json({ error: 'U shall not pass!' })
        }
      })
      .catch(next)
  },

  //restricted
  restricted (req, res, next) {
    const token = req.headers.authorization
    if (token) {
      jtw.verify(token, process.env.SHHH, (err, decodedToken) => {
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
  },

  departmentUsers (req, res, next) {
    const { department } = req.token
    Users.findAll({
      where: { department }
    })
      .then((response) => {
        return res.status(200).json(response)
      })
      .catch(next)
  }
}
