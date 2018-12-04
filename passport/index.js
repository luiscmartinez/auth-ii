require('dotenv').config({ debug: process.env.DEBUG })
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const { sequelize, Users, Google_users } = require('../components')

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
    (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      return sequelize
        .transaction()
        .then((transaction) => {
          return Google_users.findOrCreate({
            where: {
              id: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              photo: profile.photos[0].value
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

module.exports = (server) => {
  server.use(passport.initialize())
  server.use(passport.session())
  server.get(
    '/auth/google',
    passport.authenticate('google', { scope: [ 'profile', 'email' ] })
  )

  server.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    function (req, res) {
      return res.redirect('/users')
    }
  )
}
