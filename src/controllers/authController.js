const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

const db = require('../../models')
const cookieExpiry = require('../actions/cookieExpiry')
const jwtHelpers = require('../util/jwtHelpers')
const sendEmails = require('../actions/sendEmails')

const accessJwtSecret = process.env.ACCESS_JWT_SECRET
const refreshJwtSecret = process.env.REFRESH_JWT_SECRET
const verifyJwtSecret = process.env.VERIFY_JWT_SECRET
const baseUrl = process.env.APP_BASE_URL

exports.postLogin = async (req, res, next) => {
  // Might need to refactor the req.user.Roles bit to account for multiple roles on a single user later
  try {
    const token = jwt.sign({
      userId: req.user.id,
      userRole: req.user.Roles[0].name
    }, accessJwtSecret, { expiresIn: '10m' })

    const expiration = cookieExpiry.getExpiry()

    const refreshToken = jwt.sign({
      userId: req.user.id
    },
      refreshJwtSecret,
      { expiresIn: '7d' }
    )

    const updatedUser = await db.User.update({ refresh_token: refreshToken },
      {
        where: {
          id: req.user.id
        }
      })
    if (!updatedUser) {
      const error = new Error('Token update failed!')
      error.statusCode = 500
      throw error
    }

    res.cookie('refresh_cookie', refreshToken, {
      expires: expiration,
      httpOnly: true
    })
      .status(200)
      .json({
        token: token,
        expires_in: 600_000,
        username: req.user.name,
        userId: req.user.id
      })
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.postLogout = async (req, res, next) => {
  if (req.user.id !== req.body.id) {
    const error = new Error('Unauthorized')
    error.statusCode = 403
    throw error
  }
  try {
    const updatedUser = await db.User.update({ refresh_token: null }, {
      where: {
        id: req.user.id
      }
    })
    if (!updatedUser) {
      const error = new Error('Token update failed!')
      error.statusCode = 500
      throw error
    }
    req.logout()
    res.status(200).json({
      message: 'Logged out'
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.resendVerificationMail = async (req, res, next) => {
  const userId = req.params.userId

  if (userId !== req.user.id) {
    res.status(403).json({ message: 'Unauthorized!' })
  }

  const token = jwtHelpers.createVerifyToken(userId)

  const verifyUrl = `${baseUrl}/auth/verify/email?token=${token}`

  try {
    await sendEmails.sendVerificationEmail({
      recipient: req.user.email,
      subject: "Please Verify Your Email Address",
      text: `Hello ${req.user.name},
        use this link to verify your email address ${verifyUrl}`
    })

    res.status(200).json({
      message: 'Verifiication email sent successfully!'
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.putVerifyEmail = async (req, res, next) => {
  const token = req.query.token

  const decodedToken = jwtHelpers.decodeToken(token, verifyJwtSecret)

  const userId = decodedToken.userId

  try {
    const updatedUser = await db.User.update({ email_verified_at: new Date() }, {
      where: {
        id: userId
      }
    })

    if (!updatedUser) {
      const error = new Error('Updating user failed!')
      error.statusCode = 500
      throw error
    }

    res.status(200).json({
      message: 'Email successfully verified!'
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.postPasswordReset = async (req, res, next) => {
  const email = req.body.email

  try {
    const user = await db.User.findOne({ where: { email: email } })

    if (!user) {
      const error = new Error('User not found!')
      error.statusCode = 404
      throw error
    }

    const token = jwtHelpers.createVerifyToken(user.id)

    const updatedUser = await db.User.update({ remember_token: token }, {
      where: { id: user.id }
    })

    const resetUrl = `${baseUrl}/auth/password/update/${token}`

    await sendEmails.sendPasswordResetRequestEmail({
      recipient: updatedUser.email,
      subject: "Password Reset Request",
      text: `Hello ${updatedUser.name},
      use this link to reset your password ${resetUrl}`
    })

    res.status(200).json({
      message: 'Reset link sent successfully!'
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.patchPasswordUpdate = async (req, res, next) => {
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
  const token = req.params.token
  const hashedPw = await bcrypt.hash(req.body.password, 12)
  const decodedToken = jwtHelpers.decodeToken(token, verifyJwtSecret)

  const userId = decodedToken.userId

  try {
    const updatedUser = await db.User.update({ password: hashedPw }, {
      where: {
        id: userId
      }
    })

    if (!updatedUser) {
      const error = new Error('Updating user failed!')
      error.statusCode = 500
      throw error
    }

    res.status(200).json({
      message: 'Password successfully changed'
    })
  } catch (err) {

  }
}