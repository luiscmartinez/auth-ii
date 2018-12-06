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
  (req, res) => {
    // On success, redirect back to '/'
    return res.redirect('/users')
  }
)

module.exports = router
