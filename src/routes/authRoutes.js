const express = require('express')

const authController = require('../controllers/authController')
const passport = require('../util/passport')


const router = express.Router()

router.post('/login',
  passport.authenticate('local', { session: false }),
  authController.postLogin
)

router.post('/logout',
  passport.authenticate('jwt', { session: false }),
  authController.postLogout
)

module.exports = router