require('dotenv').config({ debug: process.env.DEBUG })
const server = require('express')()
const { sequelize, Users, Google_users } = require('./components')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
require('./middlewares')(server) // run thru middleware
server.use(passport.initialize())
server.use(passport.session())
require('./components/user/')(server) // run thru components
require('./errorhandling')(server) // run thru errorhandlers

passport.serializeUser((user, done) => {
  console.log(user)
  done(null, user)
})

passport.deserializeUser((id, done) => {
  Google_users.findById(id).then((user) => done(null, user))
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CB_URL
    },
    function (accessToken, refreshToken, profile, done) {
      Number(profile.id)
      return sequelize
        .transaction()
        .then((transaction) => {
          return Google_users.findOrCreate({
            transaction: transaction,
            where: {
              id: profile.id,
              name: profile.displayName,
              email: profile.name.familyName
            }
          })
            .spread((google_users, created) => {
              return google_users.save().then((result) => {
                console.log('HERRREE', result.dataValues.id)
                done(null, result.dataValues.id)
              })
            })
            .then(() => done())
            .catch(done)
        })
        .catch(done)
    }
  )
)
server.get(
  '/auth/google',
  passport.authenticate('google', { scope: [ 'profile' ] })
)

server.get('/auth/google/callback', passport.authenticate('google'), function (
  req,
  res
) {
  return res.send('hello')
})
sequelize.sync({ force: true }).then(() => {
  server.listen(8000, () => {
    console.log('\n=== API RUNNING... ===\n')
  })
})
