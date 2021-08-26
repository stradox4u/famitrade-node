const express = require('express')
require('dotenv').config()
const cors = require('cors')
const multer = require('multer')
const myMulterS3 = require('../src/util/multerS3')

const sequelize = require('./util/database')
const passport = require('./util/passport')
const paystackActions = require('./actions/paystackActions')
const db = require('../models')

const registrationRoute = require('./routes/registrationRoute')
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')

const port = process.env.APP_PORT

const app = express()

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png'
    || file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/jpg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors({
  origin: 'localhost',
  methods: 'GET,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}))

app.use(passport.initialize())
app.use(multer({
  storage: myMulterS3,
  fileFilter: fileFilter
}).single('avatar'))

app.use('/reg', registrationRoute)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

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
paystackActions.getBanks()

app.listen(port)