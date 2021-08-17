const jwt = require('jsonwebtoken')

exports.createVerifyToken = (id) => {
  return jwt.sign({
    userId: id
  }, process.env.VERIFY_JWT_SECRET, { expiresIn: '10m' })
}