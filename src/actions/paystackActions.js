const paystack = require('../util/paystack')
const db = require('../../models')

exports.getBanks = async () => {
  const myBanks = await db.Bank.findAndCountAll()
  if (myBanks.count === 0) {
    const allBanks = await paystack.misc.list_banks({ country: 'nigeria' })
    if (!allBanks) {
      const error = new Error('Error fetching banks!')
      error.statusCode = 500
      throw error
    }
    allBanks.data.forEach(async (bank) => {
      try {
        const savedBank = await db.Bank.findOrCreate({
          where: {
            name: bank.name,
            slug: bank.slug,
            code: bank.code,
            longcode: bank.longcode ? bank.longcode : null
          }
        })
        if (!savedBank) {
          const error = new Error(`Error saving ${bank.name}`)
          error.statusCode = 500
          throw error
        }
      } catch (err) {
        console.log(err)
      }
    })
  }
}

exports.createRecipient = async ({ ...input }) => {
  try {
    const recipient = await paystack.transfer_recipient.create({
      type: input.type,
      name: input.name,
      account_number: input.account_number,
      bank_code: input.bank_code
    })
    if (!recipient) {
      const error = new Error('Recipient creation failed!')
      error.statusCode = 500
      throw error
    }
    return recipient
  } catch (err) {
    console.log(err)
  }
}

exports.deleteRecipient = async (id, code) => {
  try {
    const deletedRecipient = await paystack.transfer_recipient.remove({
      recipient_code: code
    })
    if (!deletedRecipient) {
      const error = new Error('Recipient deletion failed!')
      error.statusCode = 500
      throw error
    }
    await db.User.update({
      recipient_code: null,
      account_verified: false
    }, {
      where: { id: id }
    })
    return deletedRecipient
  } catch (err) {
    console.log(err)
  }
}