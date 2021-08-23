const { expect } = require('chai')
const sinon = require('sinon')

const authController = require('../src/controllers/authController')
const jwtHelpers = require('../src/util/jwtHelpers')
const sendEmails = require('../src/actions/sendEmails')

describe('Auth Controller', () => {
  it('throws error on mismatch of user id on logout', async () => {
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

  it('calls sendVerificationEmail on matching ids', async () => {
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