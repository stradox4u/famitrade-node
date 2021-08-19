const db = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const user = await db.User.findOne({ where: { id: req.user.id } })

    if (!user) {
      const error = new Error('User not found!')
      error.statusCode = 404
      throw error
    }

    if (!user.email_verified_at) {
      const error = new Error('Email not verified')
      error.statusCode = 401
      throw error
    }
    next()
  } catch (err) {
    next(err)
  }
}