const express = require('express')
require('dotenv').config()

const port = process.env.APP_PORT

const app = express()

app.get('/', (req, res, next) => {
  console.log('App Working!')
  return res.json({ message: 'App is Online!' })
})

app.listen(port)