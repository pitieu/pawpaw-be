import mongoose from 'mongoose'
import chai from 'chai'
import chaiJestMock from 'chai-jest-mocks'

import User from '../../model/User.model'
import Account from '../../model/Account.model'
import {
  usernameExists,
  accountsCount,
  createUser,
} from '../../controller/account.ctrl.js'

import { setupDB } from '../test-setup'

chai.use(chaiJestMock)
setupDB('testing')

describe('account controller test', () => {
  describe('usernameExists ', () => {
    // it.only('should return true', async () => {
    //   let userData = {
    //     username: 'abcdefgh',
    //     phone: '12345678',
    //     phone_ext: '62',
    //     password: '12345678',
    //   }
    //   const validUser = new User(userData)
    //   const savedUser = await validUser.save()

    //   console.log(await createUser({ phone: '12345678', phone_ext: '62' }))
    // })

    it('should return true', async () => {
      const accountData = {
        username: 'abcdefgh',
        user_id: '62933baf1b8e9072419d1cea',
      }
      const validAccount = new Account(accountData)
      const savedAccount = await validAccount.save()
      expect(savedAccount._id).to.not.be.undefined
      expect(await usernameExists(accountData.username)).to.be.true
    })
    it('should return false', async () => {
      expect(await usernameExists('does_not_exist')).to.be.false
      expect(await usernameExists('asd')).to.be.false
      try {
        await usernameExists()
      } catch (e) {
        expect(e).to.be.an('object')
      }
    })
  })
  //   describe('accountsCount ', () => {
  //     it('should return false', async () => {

  // let userData = {
  //   username: 'abcdefgh',
  //   accounts: [savedAccount._id],
  //   phone: '12345678',
  //   phone_ext: '62',
  // }
  // const validUser = new User(userData)
  // const savedUser = await validUser.save()

  //       const accountData = {
  //         username: 'abcdefgh',
  //       }
  //       const validAccount = new Account(accountData)
  //       const savedAccount = await validAccount.save()
  //       expect(savedUser._id).to.not.be.undefined
  //     })
  //   })
})
