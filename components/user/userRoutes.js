const router = require('express').Router()
const controller = require('./userControllers')

router.post('/register', controller.registerUser)
// GET USERS
router.get('/users', controller.getUsers)
// LOGIN
router.post('/login', controller.login)
// Restricted
router.get('/restricted', controller.restricted, controller.getUsers)
// Get Department
router.get('/departments', controller.restricted, controller.departmentUsers)

module.exports = router
