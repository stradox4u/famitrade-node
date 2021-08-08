const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
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

module.exports = passport