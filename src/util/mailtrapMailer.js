const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "263e528868b37e",
    pass: "7b823866642dce"
  }
})

module.exports = transport