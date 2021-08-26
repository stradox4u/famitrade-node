const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs')

const db = require('../../models')

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function (username, password, done) {
    return db.User.findOne({ where: { email: username }, include: { model: db.Role, attributes: ['name'] } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect email!' })
        }
        return bcrypt.compare(password, user.password)
          .then(result => {
            if (!result) {
              return done(null, false, { message: 'Incorrect password!' })
            }
            return done(null, user)
          })
      })
      .catch(err => {
        return done(err)
      })
  })
)

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_JWT_SECRET
},
  function (jwt_payload, done) {
    return db.User.findOne({ where: { id: jwt_payload.userId } })
      .then(user => {
        if (user) {
          if (!user.refresh_token) {
            return done(null, false)
          } else {
            return done(null, user)
          }
        } else {
          return done(null, false)
        }
      })
      .catch(err => {
        return done(err, false)
      })
  }))

module.exports = passport