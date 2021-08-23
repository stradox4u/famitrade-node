const { expect } = require('chai')
const sinon = require('sinon')

const profileController = require('../src/controllers/profileController')
const updateUser = require('../src/actions/updateUser')
const awsActions = require('../src/actions/awsActions')

describe('Profile Controller', () => {
  it(`Calls the aws delete image function if an image is supplied
  with the request`, async () => {
    const req = {
      file: {
        location: 'There is a file supplied',
      },
      body: {
        shipping_address: 'No. 1, Street Road, Town City',
        phone_number: '12345678901'
      },
      user: {
        id: '1278593458df3872',
        avatar: 'https://amazon-aws.com/1235333.jpg'
      }
    }

    sinon.stub(awsActions, 'deleteFromAws')
    const stub = sinon.stub(updateUser, 'updateUser')
    stub.returns({
      user: {
        shipping_address: 'No. 1, Street Road, Town City',
        phone_number: '12345678901',
        id: '1278593458df3872',
        avatar: 'https://amazon-aws.com/1235333.jpg'
      }
    })
    const result = await profileController.patchEditProfile(req, {}, () => { })
    expect(awsActions.deleteFromAws.calledOnce).to.be.true
    expect(updateUser.updateUser.calledOnce).to.be.true

    awsActions.deleteFromAws.restore()
    updateUser.updateUser.restore()
  })
})