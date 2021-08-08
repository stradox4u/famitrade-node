const express = require('express')
const { body } = require('express-validator')

const db = require('../../models/index')
const registrationController = require('../controllers/registrationController')

const router = express.Router()

router.post('/register', [
  body('name').trim().isString().isLength({ min: 3 })
    .escape()
    .withMessage('Name must be min. 3 characters!'),
  body('email').trim().isEmail().normalizeEmail()
    .withMessage('Email is not valid!')
    .custom((value, { req }) => {
      return db.User.findOne({ where: { email: value } })
        .then(user => {
          if (user) {
            return Promise.reject('Email is already taken!')
          }
        })
    }),
  body('password').trim().isString().isLength({ min: 6 })
    .withMessage('Password must be min. 6 characters!'),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match!')
    }
    return true
  }),
  body('avatar').trim().isString().withMessage('Invalid avatar location!'),
  body('user_type').trim().isString().escape(),
  body('shipping_address').trim().isString().escape(),
  body('phone_number').trim().isString().isLength({ min: 11, max: 13 })
    .escape()
    .withMessage('Invalid phone number!'),
  body('billing_address').trim().isString().escape(),
  body('bank_name').trim().isString().escape(),
  body('account_number').trim().isString().isLength({ min: 10, max: 13 })
    .escape()
    .withMessage('Invalid account number!'),
],
  registrationController.postRegister
)

module.exports = router