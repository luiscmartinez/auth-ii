require('dotenv').config()
const server = require('express')()
const { sequelize, Users, Google_users, Forums } = require('./components')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const cookieSession = require('cookie-session')

server.use(require('express').json())
server.use(
  cookieSession({
    maxAge: 24 * 60 * 1000,
    secret: process.env.COOKIE_KEY
  })
)

server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

server.use(passport.initialize())
server.use(passport.session())

passport.serializeUser((user, done) => {
  console.log('🍒', user)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  Google_users.findById(id).then((user) => {
    console.log('😈', user)
    done(null, user)
  })
})

passport.use(
  new GoogleStrategy(
    {
      callbackURL: process.env.GOOGLE_CB,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      Google_users.findOne({ where: { id: profile.id } }).then((user) => {
        if (user) {
          console.log('user is', user.dataValues)
          done(null, user.dataValues)
        } else {
          Google_users.create({
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value
          }).then((newUser) => {
            done(null, newUser.dataValues)
          })
        }
      })
    } // end of google strategy callback function
  ) //end of google strategy
) //end of passport.use function

server.get('/', (req, res) => {
  res.send('you made it home nigger')
})

server.get('/auth/login', (req, res) => {
  res
})

server.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [ 'profile', 'email' ]
  })
)

server.get(
  '/auth/google/redirect',
  passport.authenticate('google'),
  (req, res, next) => {
    console.log(req.user)
    res.redirect(`http://localhost:3000/users/:${req.session.passport.user}`)
  }
)

server.get('/auth/logout', (req, res) => {
  req.logout()
  res.status(200).json({ mess: 'logout success' })
})

server.get('/api/forum', (req, res, next) => {
  Forums.findAll()
    .then((response) => {
      console.log(req.isAuthenticated())
      return res.status(200).json({ response })
    })
    .catch((err) => console.log(err))
})

server.get('/api/profile', (req, res) => {
  const str = req.headers.referer
  var id = str.substr(str.indexOf('/:') + 2)
  Google_users.findById(id).then((user) => {
    console.log(user.dataValues)
    res.status(200).json(user.dataValues)
  })
})

server.post('/api/post', (req, res, next) => {
  const post = req.body.post
  console.log(post)
  Forums.create({ post }).then((createdPost) => {
    return res.status(200).json({ mes: 'success' })
  })
})

sequelize
  .sync()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log('\n=== API RUNNING... ===\n')
    })
  })
  .catch((err) => console.log(err))
