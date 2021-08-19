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
    console.log(sentMail.messageId)
  }
  catch (err) {
    console.log(err)
  }
}

exports.sendPasswordResetRequestEmail = async ({ ...fields }) => {
  try {
    const sentMail = await transporter.sendMail({
      from: "admin@farmitrade.com.ng",
      to: fields.recipient,
      subject: fields.subject,
      text: fields.text
    })
    console.log(sentMail.messageId)
  } catch (err) {
    console.log(err)
  }
}

exports.sendSuccesfulPasswordUpdateEmail = async ({ ...fields }) => {
  try {
    const sentMail = await transporter.sendMail({
      from: "admin@farmitrade.com.ng",
      to: fields.recipient,
      subject: fields.subject,
      text: fields.text
    })
    console.log(sentMail.messageId)
  } catch (err) {
    console.log(err)
  }
}