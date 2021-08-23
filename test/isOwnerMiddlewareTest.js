const { expect } = require('chai')

const isOwner = require('../src/middleware/isOwner')

describe('Is Owner Middleware', () => {
  it('Throws the correct error on jwt user not matching param user', async () => {
    const req = {
      user: {
        id: 'loggedInUser'
      },
      params: {
        userId: 'notLoggedInUser'
      }
    }
    const result = await isOwner(req, {}, () => { })
    expect(result).to.have.property('statusCode', 403)
    expect(result).to.have.property('message', 'Forbidden!')
  })
})