const { validationResult } = require('express-validator')

const updateUser = require('../actions/updateUser')
const filterObject = require('../actions/filterInput')
const awsActions = require('../actions/awsActions')
const db = require('../../models')
const paystackActions = require('../actions/paystackActions')

exports.patchEditProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed!')
      error.statusCode = 422
      res.status(422).json({
        message: 'Validation failed!',
        errors: errors
      })
      throw error
    }

    let avatar
    if (req.file) {
      avatar = req.file.location
      const keyArray = req.user.avatar.split('/')
      awsActions.deleteFromAws(keyArray[keyArray.length - 1])
    } else {
      avatar = req.user.avatar
    }
    const validated = {
      shipping_address: req.body.shipping_address,
      phone_number: req.body.phone_number,
      billing_address: req.body.billing_address,
      bank_name: req.body.bank_name,
      account_number: req.body.account_number,
      avatar: avatar
    }

    const filtered = filterObject(req.user, validated)

    if (req.body.account_number !== req.user.account_number) {
      // Fire event to verify the account number and generate recipient code
      const bank = await db.Bank.findOne({
        where: {
          name: req.body.bank_name
        }
      })
      const deleted = await paystackActions
        .deleteRecipient(req.user.id, req.user.recipient_code)
      const recipient = await paystackActions.createRecipient({
        name: req.user.name,
        type: 'nuban',
        account_number: req.body.account_number,
        bank_code: bank.code
      })

      filtered.recipient_code = recipient.data.recipient_code
      filtered.account_verified = true
    }

    const updatedUser = await updateUser.updateUser(req.user.id, filtered)

    res.status(200).json({
      message: 'User successfully updated',
      updatedUser: updatedUser
    })
    return
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
    return err
  }
}

exports.deleteUserProfile = async (req, res, next) => {
  const userId = req.params.userId
  try {
    const result = await db.User.destroy({
      where: { id: userId }
    })
    if (!result) {
      const error = new Error('Deletion failed!')
      error.statusCode = 500
      throw error
    }
    res.status(200).json({
      message: 'Deletion successful!'
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
    return err
  }
}