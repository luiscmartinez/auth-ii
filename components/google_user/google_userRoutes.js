const router = require('express').Router()
const controller = require('./google_userControllers')
const passport = require('passport')

router.get(
  '/',
  passport.authenticate('google', { scope: [ 'profile', 'email' ] })
)

router.post(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://damp-peak-67680.herokuapp.com/'
  }),
  controller.redirect
)

module.exports = router
