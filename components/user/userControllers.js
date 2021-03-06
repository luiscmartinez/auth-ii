require('dotenv').config()
const { sequelize, Users, Google_users, Forums } = require('../')
const jtw = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports = {
  // REGISTER
  registerUser (req, res, next) {
    console.log('herhehrehr', req.body)
    let { password, username } = req.body
    password = bcrypt.hashSync(password, 10)
    Users.create({
      username,
      password
    })
      .then((insertedUser) => {
        let username = insertedUser.dataValues.username
        let token = jtw.sign({ username }, process.env.SHHH, {
          expiresIn: '1d'
        })

        return res.json({ mes: token })
      })
      .catch(next)
  },
  getUsers (req, res, next) {
    Google_users.all()
      .then((users) => {
        console.log('IN USERS')
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
        console.log(insertedUser)
        if (insertedUser === null) return next(Error('wrong credentials'))
        let { password, username } = insertedUser.dataValues

        const lol = bcrypt.compareSync(credentials.password, password)
        if (lol === true) {
          let token = jtw.sign({ username }, process.env.SHHH, {
            expiresIn: '1d'
          })
          res.status(200).json({ mes: token })
        } else {
          return res.status(401).json({ error: 'U shall not pass!' })
        }
      })
      .catch(next)
  },
  //restricted
  restricted (req, res, next) {
    console.log(req.headers)
    const token = req.headers.authorization
    if (token) {
      console.log(req.session)
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
  },
  logout (req, res, next) {
    res.status(200).redirect('http://localhost:3000/')
  },
  post (req, res, next) {
    const post = req.body.post
    console.log(post)
    Forums.create({ post }).then((createdPost) => {
      return res.status(200).json({ mes: 'success' })
    })
  },
  forum (req, res, next) {
    Forums.findAll()
      .then((response) => {
        // req.isAuthenticated()
        console.log(req.isAuthenticated())
        return res.status(200).json({ response })
      })
      .catch((err) => console.log(err))
  }
}
