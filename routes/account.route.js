import express from 'express'
import passport from 'passport'
import fs from 'fs'
import path from 'path'

import debug from '../utils/logger.js'
import { authArea } from '../middleware/auth.middleware.js'
import {
  fetchUser,
  fetchAccounts,
  selectAccount,
} from '../controller/account.ctrl.js'
import User from '../model/User.model.js'
import {
  filterUserPublicFields,
  filterAccountPublicFields,
} from '../validation/account.validation.js'
import Account from '../model/Account.model.js'

const __dirname = path.resolve()

const router = express.Router()

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

const _fetchUser = async (req, res, next) => {
  try {
    let user = await User.findOne(
      {
        phone: req.user.phone,
        phone_ext: req.user.phone_ext,
        deleted: false,
      },
      {
        _id: 1,
        phone: 1,
        phone_ext: 1,
        accounts: 1,
        password: 1,
        selected_account: 1,
      },
    )
      .populate('selected_account', { _id: 1, username: 1 })
      .lean()
    // const user = await fetchUser({
    //   phone: req.user.phone,
    //   phone_ext: req.user.phone_ext,
    // })

    // debug.info(filterUserPublicFields(user))
    res.status(200).send(filterUserPublicFields(user))
  } catch (err) {
    console.log(err)
    next(err)
  }
}

const _fetchAccounts = async (req, res, next) => {
  try {
    let accounts = await fetchAccounts({
      phone: req.user.phone,
      phone_ext: req.user.phone_ext,
      deleted: false,
    })

    accounts = accounts.map((account) => filterAccountPublicFields(account))
    debug.info(accounts)
    res.status(200).send(accounts)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

const _selectAccount = async (req, res, next) => {
  try {
    console.log(req.params)
    let accountSelected = await selectAccount({
      user_id: req.user._id,
      phone: req.user.phone,
      phone_ext: req.user.phone_ext,
      account_id: req.params.account_id,
    })

    res.status(200).send({
      message: 'successfully selected account',
      status: 200,
      user: filterUserPublicFields(accountSelected),
    })
  } catch (err) {
    next(err)
  }
}

router.get('/fetch', authArea, _fetchUser)
router.put('/:account_id/select', authArea, _selectAccount)
router.get('/', authArea, _fetchAccounts)

export default router
