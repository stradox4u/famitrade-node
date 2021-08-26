const db = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
      const error = new Error('No authorization header found!')
      error.statusCode = 401
      throw error
    }
    const token = authHeader.split(' ')[1]
    const blackListed = await db.BlacklistedToken.findOne({
      where: { token: token }
    })
    if (blackListed) {
      const error = new Error('Token has been blacklisted')
      error.statusCode = 403
      throw error
    } else {
      next()
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}