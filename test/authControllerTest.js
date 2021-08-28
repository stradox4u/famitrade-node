const { expect } = require('chai')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const authController = require('../src/controllers/authController')
const jwtHelpers = require('../src/util/jwtHelpers')
const sendEmails = require('../src/actions/sendEmails')
const db = require('../models')

describe('Auth Controller', () => {
  it('Sends correct response code on successful login', async () => {
    const req = {
      user: {
        id: 'loggedInUser',
        Roles: [
          { name: 'normal user' }
        ]
      }
    }
    const res = {
      statusCode: 500,
      user: null,
      cookie: null,
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: function (data) {
        this.user = data.user
      },
      cookie: function () {
        this.cookie = 'I am a cookie'
        return this
      }
    }
    const jwtStub = sinon.stub(jwt, 'sign')
    jwtStub.returns({
      token: 'validToken'
    })
    const userStub = sinon.stub(db.User, 'update')
    userStub.returns({
      message: 'User updated',
      user: req.user
    })

    await authController.postLogin(req, res, () => { })

    expect(res.statusCode).to.be.equal(200)
    expect(res.user.id).to.be.equal('loggedInUser')

    jwtStub.restore()
    userStub.restore()
  })

  it('Sends correct response message on successful logout', async () => {
    const req = {
      user: {
        id: 'loggedInUser'
      },
      logout: function () {
        return 'Logged Out'
      }
    }
    const res = {
      statusCode: 500,
      message: null,
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: function (data) {
        this.message = data.message
      }
    }

    const userStub = sinon.stub(db.User, 'update')
    userStub.returns({
      message: 'User updated',
      user: req.user
    })

    await authController.postLogout(req, res, () => { })

    expect(res.statusCode).to.be.equal(200)
    expect(res.message).to.be.equal('Logged out')

    userStub.restore()
  })

  it('Calls sendVerificationEmail if userId is supplied', async () => {
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

  it('Sends the correct response on email verification', async () => {
    const req = {
      query: {
        token: 'Verification Token',
      }
    }
    const res = {
      statusCode: 500,
      message: null,
      cookie: null,
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: function (data) {
        this.message = data.message
      },
      cookie: function () {
        this.cookie = 'I am a cookie'
        return this
      }
    }
    const jwtStub = sinon.stub(jwtHelpers, 'decodeToken')
    jwtStub.returns({
      userId: 'valid-user-id'
    })
    const userStub = sinon.stub(db.User, 'update')
    userStub.returns({
      message: 'User updated',
    })

    await authController.putVerifyEmail(req, res, () => { })

    expect(res.statusCode).to.be.equal(200)
    expect(res.message).to.be.equal('Email successfully verified!')

    jwtStub.restore()
    userStub.restore()
  })

  it('Throws an error on password reset if user email is not verified', async () => {
    const req = {
      body: {
        email: 'email@email.com'
      }
    }
    const userStub = sinon.stub(db.User, 'findOne')
    userStub.returns({
      id: 'userId',
      email_verified_at: null
    })
    const result = await authController.postPasswordReset(req, {}, () => { })

    expect(result).to.have.property('statusCode', 401)
    expect(result).to.have.property('message', 'Email is not verified!')

    userStub.restore()
  })

  it('Sends email if the user is successfully updated with the remember token', async () => {
    const req = {
      body: {
        email: 'email@email.com'
      }
    }
    const userFindStub = sinon.stub(db.User, 'findOne')
    userFindStub.returns({
      id: 'userId',
      email_verified_at: new Date().toISOString()
    })
    const userUpdateStub = sinon.stub(db.User, 'update')
    userUpdateStub.returns({
      id: 'userId',
      email_verified_at: new Date().toISOString()
    })
    const jwtStub = sinon.stub(jwtHelpers, 'createVerifyToken')
    jwtStub.returns({ token: 'I can change my password now' })
    const emailStub = sinon.stub(sendEmails, 'sendPasswordResetRequestEmail')

    await authController.postPasswordReset(req, {}, () => { })

    expect(emailStub.calledOnce).to.be.true

    userFindStub.restore()
    userUpdateStub.restore()
    jwtStub.restore()
    emailStub.restore()
  })

  it('Sends the correct response after updating the user with a remember token', async () => {
    const req = {
      body: {
        email: 'email@email.com'
      }
    }
    const res = {
      statusCode: 500,
      message: null,
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: function (data) {
        this.message = data.message
      }
    }

    const userFindStub = sinon.stub(db.User, 'findOne')
    userFindStub.returns({
      id: 'userId',
      email_verified_at: new Date().toISOString()
    })
    const userUpdateStub = sinon.stub(db.User, 'update')
    userUpdateStub.returns({
      id: 'userId',
      email_verified_at: new Date().toISOString()
    })
    const jwtStub = sinon.stub(jwtHelpers, 'createVerifyToken')
    jwtStub.returns({ token: 'I can change my password now' })
    const emailStub = sinon.stub(sendEmails, 'sendPasswordResetRequestEmail')

    await authController.postPasswordReset(req, res, () => { })

    expect(res.statusCode).to.be.equal(200)
    expect(res.message).to.be.equal('Reset link sent successfully!')

    userFindStub.restore()
    userUpdateStub.restore()
    jwtStub.restore()
    emailStub.restore()
  })

  it('Sends an email on successful password update', async () => {
    const req = {
      body: {
        token: 'Token here',
      }
    }
    const bcryptStub = sinon.stub(bcrypt, 'hash')
    bcryptStub.returns('Hashed password')

    const jwtStub = sinon.stub(jwtHelpers, 'decodeToken')
    jwtStub.returns({
      userId: 'valid-user-id'
    })

    const userStub = sinon.stub(db.User, 'update')
    userStub.returns([
      {},
      [
        {
          dataValues: {
            email: 'email@email.com',
            name: 'Test User'
          }
        }
      ]
    ])

    const emailStub = sinon.stub(sendEmails, 'sendSuccesfulPasswordUpdateEmail')

    await authController.patchPasswordUpdate(req, {}, () => { })

    expect(emailStub.called).to.be.true

    bcryptStub.restore()
    jwtStub.restore()
    userStub.restore()
    emailStub.restore()
  })

  it('Sends correct response on successful password update', async () => {
    const req = {
      body: {
        token: 'Token here',
      }
    }

    const res = {
      statusCode: 500,
      message: null,
      status: function (code) {
        this.statusCode = code
        return this
      },
      json: function (data) {
        this.message = data.message
      }
    }
    const bcryptStub = sinon.stub(bcrypt, 'hash')
    bcryptStub.returns('Hashed password')

    const jwtStub = sinon.stub(jwtHelpers, 'decodeToken')
    jwtStub.returns({
      userId: 'valid-user-id'
    })

    const userStub = sinon.stub(db.User, 'update')
    userStub.returns([
      {},
      [
        {
          dataValues: {
            email: 'email@email.com',
            name: 'Test User'
          }
        }
      ]
    ])

    const emailStub = sinon.stub(sendEmails, 'sendSuccesfulPasswordUpdateEmail')

    await authController.patchPasswordUpdate(req, res, () => { })

    expect(res.statusCode).to.be.equal(200)
    expect(res.message).to.be.equal('Password successfully changed')

    bcryptStub.restore()
    jwtStub.restore()
    userStub.restore()
    emailStub.restore()
  })
})