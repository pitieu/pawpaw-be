import mongoose from 'mongoose'
import UserModel from '../../model/User.model'
import chai from 'chai'
import chaiJestMock from 'chai-jest-mocks'

import { setupDB } from '../test-setup'

chai.use(chaiJestMock)

setupDB('testing')

const userData = {
  password: '1234567',
  phone: '85311317659',
  phone_ext: '62',
  email_validated: false,
  phone_validated: false,
  accounts: [],
}

describe('User Model Test', () => {
  it('create & save user successfully', async () => {
    const validUser = new UserModel(userData)
    const savedUser = await validUser.save()

    expect(savedUser._id).toBeDefined()
    expect(savedUser.phone).to.be.equal(userData.phone)
    expect(savedUser.phone_ext).to.be.equal(userData.phone_ext)
    expect(savedUser.email_validated).to.be.equal(userData.email_validated)
    expect(savedUser.phone_validated).to.be.equal(userData.phone_validated)
    expect(savedUser.accounts).toStrictEqual(userData.accounts)
    expect(savedUser.deleted).to.be.equal(false)
    expect(savedUser.password).to.not.be.equal(userData.password)
  })

  it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
    const userWithInvalidField = new UserModel({
      phone: '12345678',
      phone_ext: '62',
      password: '1234567',
    })
    const savedUserWithInvalidField = await userWithInvalidField.save()
    expect(savedUserWithInvalidField._id).toBeDefined()
    expect(savedUserWithInvalidField.nickkname).toBeUndefined()
  })

  // Test Validation is working!!!
  // It should us told us the errors in on gender field.
  it('create user without required field should failed', async () => {
    const userWithoutRequiredField = new UserModel({
      phone: '1234567',
      phone_ext: '1234567',
    })
    let err
    try {
      const savedUserWithoutRequiredField =
        await userWithoutRequiredField.save()
      err = savedUserWithoutRequiredField
    } catch (error) {
      err = error
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    expect(err.errors.password).toBeDefined()
  })
})
