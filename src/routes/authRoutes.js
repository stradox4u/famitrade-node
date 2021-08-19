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

router.post('/:userId/verify/resend',
  passport.authenticate('jwt', { session: false }),
  authController.resendVerificationMail
)

router.put('/verify/email', authController.putVerifyEmail)

module.exports = router