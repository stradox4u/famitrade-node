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