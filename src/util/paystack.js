const paystackApi = require('paystack-api')

const paystack = paystackApi(process.env.PAYSTACK_SECRET_KEY)

module.exports = paystack