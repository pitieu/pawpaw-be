import express from 'express'
import passport from 'passport'
import fs from 'fs'
import path from 'path'

import debug from '../utils/logger.js'
import { authArea } from '../middleware/auth.middleware.js'
import { fetchUser } from '../controller/account.ctrl.js'
import { filterUserPublicFields } from '../validation/account.validation.js'

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
    const user = await fetchUser({
      phone: req.user.phone,
      phone_ext: req.user.phone_ext,
    })
    // debug.info(filterUserPublicFields(user))
    res.status(200).send(filterUserPublicFields(user))
  } catch (err) {
    console.log(err)
    next(err)
  }
}

router.get('/', authArea, _fetchUser)

export default router
