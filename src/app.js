const express = require('express')
require('dotenv').config()
const cors = require('cors')

const sequelize = require('./util/database')
const passport = require('./util/passport')

const registrationRoute = require('./routes/registrationRoute')
const authRoutes = require('./routes/authRoutes')

const port = process.env.APP_PORT

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors({
  origin: 'localhost',
  methods: 'GET,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}))

app.use(passport.initialize())

app.use('/reg', registrationRoute)
app.use('/auth', authRoutes)

app.use((error, req, res, next) => {
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({
    message,
    data
  })
})

const checkDbConn = () => {
  return sequelize.authenticate()
    .then(connection => {
      console.log('Connection to database successful!')
    })
    .catch(err => {
      console.log('Unable to connect to database!')
    })
}

checkDbConn()

app.listen(port)