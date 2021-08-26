const express = require('express')
const { body } = require('express-validator')

const profileController = require('../controllers/profileController')
const isOwner = require('../middleware/isOwner')
const isVerified = require('../middleware/isVerified')
const passport = require('../util/passport')

const router = express.Router()

router.patch('/update/:userId', [
  body('shipping_address').trim().isString().escape()
    .withMessage('Invalid address'),
  body('phone_number').trim().isString().isLength({ min: 11, max: 13 })
    .withMessage('Invalid phone number'),
  body('billing_address').trim().isString().escape()
    .withMessage('Invalid address'),
  body('bank_name').trim().isString(),
  body('account_number').trim().isString().isLength({ min: 10, max: 10 })
    .withMessage('Invalid account number')
],
  passport.authenticate('jwt', { session: false }),
  isVerified, isOwner,
  profileController.patchEditProfile
)

router.delete('/delete/:userId',
  passport.authenticate('jwt', { session: false }),
  isVerified, isOwner,
  profileController.deleteUserProfile
)

module.exports = router