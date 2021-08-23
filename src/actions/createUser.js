const bcrypt = require('bcryptjs')

const db = require('../../models')

const createUser = async (input) => {
  try {
    const hashedPw = await bcrypt.hash(input.password, 12)

    const userRole = await db.Role.findOne({ where: { name: 'user' } })
    if (!userRole) {
      const error = new Error('Error assigning user role!')
      throw error
    }

    const newUser = await db.User.create({
      name: input.name,
      email: input.email,
      password: hashedPw,
      avatar: input.avatar,
      user_type: input.user_type,
      shipping_address: input.shipping_address,
      phone_number: input.phone_number,
      billing_address: input.billing_address,
      bank_name: input.bank_name,
      account_number: input.account_number
    })

    await newUser.addRole(userRole)

    return newUser

    // Fire event to verify the user's bank account
  }
  catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    throw err
  }
}

module.exports = createUser