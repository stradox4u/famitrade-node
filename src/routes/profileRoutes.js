const express = require('express')
const { body } = require('express-validator')

const profileController = require('../controllers/profileController')
const passport = require('../util/passport')

const router = express.Router()

router.patch('/update',
  passport.authenticate('jwt', { session: false }),
  profileController.patchEditProfile
)

module.exports = router