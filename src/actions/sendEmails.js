const transporter = require('../util/mailer')

exports.sendVerificationEmail = async ({ ...fields }) => {
  // console.log(transporter)
  try {
    const sentMail = await transporter.sendMail({
      from: "admin@farmitrade.com.ng",
      to: fields.recipient,
      subject: fields.subject,
      text: fields.text
    })
  }
  catch (err) {
    console.log(err)
  }
}