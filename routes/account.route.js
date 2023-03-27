import express from 'express'
import { query, param } from 'express-validator'
import * as AuthMiddleware from '../middleware/auth.middleware.js'
import { handleErrors } from '../middleware/error.middleware.js'
import User from '../model/User.model.js'
import {
  fetchAccounts,
  selectAccount,
  searchAddress,
} from '../controller/account.ctrl.js'
import {
  filterUserPublicFields,
  filterAccountPublicFields,
} from '../validation/account.validation.js'

import { notFoundError } from '../utils/error.utils.js'

const router = express.Router()

router.use(AuthMiddleware.initialize)
router.use(AuthMiddleware.session)

router.get('/fetch', AuthMiddleware.authArea, fetchUserHandler)
router.get(
  '/address',
  query('search', 'Search query is required').notEmpty(),
  fetchAddressHandler,
)
router.put(
  '/:account_id/select',
  param('account_id', 'Account ID is invalid').isMongoId(),
  AuthMiddleware.authArea,
  selectAccountHandler,
)
router.get('/', AuthMiddleware.authArea, fetchAccountsHandler)

const fetchUserHandler = async (req, res) => {
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

    if (!user) {
      throw new notFoundError('User not found')
    }
    res.json(filterUserPublicFields(user))
  } catch (err) {
    next(err)
  }
}

const fetchAccountsHandler = async (req, res, next) => {
  try {
    const accounts = await fetchAccounts({
      phone: req.user.phone,
      phone_ext: req.user.phone_ext,
      deleted: false,
    })

    filteredAccounts = accounts.map((account) =>
      filterAccountPublicFields(account),
    )

    if (filteredAccounts.length === 0) {
      res.status(204).send()
    } else {
      res.json(filteredAccounts)
    }
  } catch (err) {
    next(err)
  }
}

const selectAccountHandler = async (req, res, next) => {
  try {
    let accountSelected = await selectAccount({
      user_id: req.user._id,
      phone: req.user.phone,
      phone_ext: req.user.phone_ext,
      account_id: req.params.account_id,
    })

    res.json({
      message: 'successfully selected account',
      status: 200,
      user: filterUserPublicFields(accountSelected),
    })
  } catch (err) {
    next(err)
  }
}

const fetchAddressHandler = async (req, res, next) => {
  try {
    if (req.query.search) {
      const result = await searchAddress(req.query.search)
      res.json(result)
    } else {
      res.status(204).send([])
    }
  } catch (err) {
    next(err)
  }
}

export default router
