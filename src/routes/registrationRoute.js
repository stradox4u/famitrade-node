const express = require('express')

const registrationController = require('../controllers/registrationController')

const router = express.Router()

router.post('/register', registrationController.postRegister)

module.exports = router