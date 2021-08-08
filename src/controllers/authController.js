const jwt = require('jsonwebtoken')
const db = require('../../models')

const cookieExpiry = require('../actions/cookieExpiry')

const accessJwtSecret = process.env.ACCESS_JWT_SECRET
const refreshJwtSecret = process.env.REFRESH_JWT_SECRET

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
      const error = new Error('Failed to save token!')
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
