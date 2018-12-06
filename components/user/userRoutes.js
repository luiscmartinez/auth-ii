const router = require('express').Router()
const controller = require('./userControllers')

router.post('/signup', controller.registerUser)
// GET USERS
router.get('/users', controller.getUsers)
// LOGIN
router.post('/login', controller.login)
// post message
router.post('/post', controller.post)

router.get('/post', controller.restricted, controller.forum)

// Restricted
router.get('/restricted', controller.restricted, controller.getUsers)
// Get Department
router.get('/departments', controller.restricted, controller.departmentUsers)
//logout
router.get('/logout', controller.logout)

module.exports = router
