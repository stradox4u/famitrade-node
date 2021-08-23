const db = require('../../models')

const updateUser = async (id, values) => {
  try {
    const updatedUser = await db.User.update({ ...values }, {
      where: { id: id },
      returning: true
    })
    const user = updatedUser[1][0].dataValues
    return user
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    throw err
  }
}

module.exports = updateUser