const router = require('express').Router()
const controller = require('./google_userControllers')
const passport = require('passport')

router.get(
  '/',
  passport.authenticate('google', { scope: [ 'profile', 'email' ] })
)

router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (err, req, res, next) => {
    // custom error handler to catch any errors, such as TokenError
    if (err.name === 'TokenError') {
      res.redirect('/auth/google') // redirect them back to the login page
    } else {
      res.redirect('/auth/google')
    }
  },
  (req, res) => {
    // On success, redirect back to '/'
    res.redirect('/')
  }
)

module.exports = router
