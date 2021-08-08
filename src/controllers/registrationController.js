const { validationResult } = require('express-validator')

const createUser = require('../actions/createUser')

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
  const validated = { ...req.body }
  try {
    const user = await createUser(validated)

    res.status(201).json({
      message: 'User created',
      user: user
    })
  }
  catch (err) {
    next(err)
  }
}