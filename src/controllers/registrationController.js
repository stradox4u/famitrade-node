const { validationResult } = require('express-validator')

const createUser = require('../actions/createUser')
const sendEmails = require('../actions/sendEmails')
const jwtHelpers = require('../util/jwtHelpers')

exports.postRegister = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!')
    error.statusCode = 422
    res.status(422).json({
      message: 'Validation failed!',
      errors: errors
    })
    throw error
  }
  const validated = {
    ...req.body,
    avatar: req.file.location
  }
  try {
    const user = await createUser(validated)

    const baseUrl = process.env.APP_BASE_URL
    const token = jwtHelpers.createVerifyToken(user.id)

    const verifyUrl = `${baseUrl}/auth/verify/email?token=${token}`

    sendEmails.sendVerificationEmail({
      recipient: user.email,
      subject: "Please Verify Your Email Address",
      text: `Hello ${user.name},
        use this link to verify your email address ${verifyUrl}`
    })

    res.status(201).json({
      message: 'User created',
      user: user
    })
  }
  catch (err) {
    next(err)
  }
}