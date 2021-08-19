const express = require('express')
const { body } = require('express-validator')

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

router.post('/password/reset', authController.postPasswordReset)

router.patch('/password/update/', [
  body('password').trim().isString().isLength({ min: 6 }),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match!')
    }
    return true
  }),
  body('token').trim().isString()
],
  authController.patchPasswordUpdate
)

module.exports = router