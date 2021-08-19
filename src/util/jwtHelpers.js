const jwt = require('jsonwebtoken')

exports.createVerifyToken = (id) => {
  return jwt.sign({
    userId: id
  }, process.env.VERIFY_JWT_SECRET, { expiresIn: '10m' })
}

exports.decodeToken = (token, secret) => {
  const decoded = jwt.verify(token, secret)

  if (!decoded) {
    const error = new Error('Token verification failed!')
    error.statusCode = 401
    throw error
  }
  return decoded
}