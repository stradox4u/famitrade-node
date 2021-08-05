const express = require('express')
require('dotenv').config()

const sequelize = require('./util/database')

const port = process.env.APP_PORT

const app = express()

app.get('/', (req, res, next) => {
  console.log('App Working!')
  return res.json({ message: 'App is Online!' })
})

try {
  return sequelize.authenticate()
    .then(result => console.log('Connection to database successful!'))
} catch (err) {
  console.log('Unable to connect to database')
}

app.listen(port)