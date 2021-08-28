const { expect } = require('chai')
const sinon = require('sinon')

const db = require('../models')

const isVerified = require('../src/middleware/isVerified')

describe('Is Verified Middleware', () => {
  it('Throws the correct error if user is not verified', async () => {
    const req = {
      user: {
        id: 'lowesboro'
      }
    }
    sinon.stub(db.User, 'findOne')
    db.User.findOne.returns({
      email_verified_at: null,
      id: req.user.id
    })
    const result = await isVerified(req, {}, () => { })
    expect(result).to.have.property('message', 'Email not verified')
    expect(result).to.have.property('statusCode', 401)

    db.User.findOne.restore()
  })
})