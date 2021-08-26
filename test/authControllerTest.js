const { expect } = require('chai')
const sinon = require('sinon')

const authController = require('../src/controllers/authController')
const jwtHelpers = require('../src/util/jwtHelpers')
const sendEmails = require('../src/actions/sendEmails')

describe('Auth Controller', () => {
  it('calls sendVerificationEmail if userId is supplied', async () => {
    const stub = sinon.stub(sendEmails, 'sendVerificationEmail')
    const req = {
      user: {
        id: 'loggedInUser'
      },
      params: {
        userId: 'loggedInUser'
      }
    }
    sinon.stub(jwtHelpers, 'createVerifyToken')
    jwtHelpers.createVerifyToken.returns('token')

    await authController.resendVerificationMail(req, {}, () => { })
    expect(stub.calledOnce).to.be.true
    jwtHelpers.createVerifyToken.restore()
    sendEmails.sendVerificationEmail.restore()
  })
})