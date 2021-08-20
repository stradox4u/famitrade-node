const { expect } = require('chai')
const sinon = require('sinon')

const authController = require('../src/controllers/authController')
const db = require('../models')

describe('Auth Controller', () => {
  it('error thrown on mismatch of user id on logout', async () => {
    const req = {
      user: {
        id: 'loggedInUser'
      },
      body: {
        id: 'notLoggedInUser'
      }
    }
    const result = await authController.postLogout(req, {}, () => { })
    expect(result).to.be.an('error')
    expect(result).to.have.property('statusCode', 403)
    expect(result).to.have.property('message', 'Forbidden!')
  })
})