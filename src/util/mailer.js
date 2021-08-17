const nodemailer = require('nodemailer')

const mailtrapUser = process.env.APP_MAILTRAP_USER
const mailtrapPass = process.env.APP_MAILTRAP_PASS

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  auth: {
    user: mailtrapUser,
    pass: mailtrapPass
  }
})

module.exports = transporter