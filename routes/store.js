import express from 'express'
import passport from 'passport'
import { fetchStore, updateStore } from '../controller/store.js'

import { loggedInArea } from '../middleware/auth.js'

const router = express.Router()

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

router.get('/', async (req, res, next) => {
  try {
    let query = { ownerId: req.user?._id }
    if (req.query.storeId) {
      query = { _id: req.query.storeId }
    }
    const storeId = await fetchStore(req.body)
    res.status(200).send({ _id: storeId._id })
  } catch (err) {
    next(err)
  }
})

router.get('/:storeId', loggedInArea, fetchStore)
router.put('/store', loggedInArea, updateStore)
router.post('/store', loggedInArea, async (req, res, next) => {
  try {
    req.body.ownerId = req.user._id
    const storeId = await createStore(req.body)
    res.status(201).send({ _id: storeId._id })
  } catch (err) {
    next(err)
  }
})

export default router
