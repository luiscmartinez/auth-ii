require('dotenv').config({ debug: process.env.DEBUG })
const User = require('./userModel')
const jtw = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports = {
  // REGISTER
  registerUser (req, res, next) {
    let { password, username, department } = req.body
    password = bcrypt.hashSync(password, 10)
    User.create({
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
    User.all()
      .then((users) => {
        return res.status(200).json({ users })
      })
      .catch(next)
  },

  // LOGIN
  login (req, res, next) {
    const credentials = req.body
    User.findOne({
      where: { username: `${credentials.username}` }
    })
      .then((insertedUser) => {
        let user = insertedUser
        const lol = bcrypt.compareSync(credentials.password, user.password)
        if (lol === true) {
          let { department } = insertedUser
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
  // restricted
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
    const department = req.token.department
    User.findAll({
      where: { department }
    })
      .then((response) => {
        return res.status(200).json(response)
      })
      .catch(next)
  }
}
