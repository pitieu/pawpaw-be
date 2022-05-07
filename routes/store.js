import express from 'express'
import passport from 'passport'

import debug from '../utils/logger.js'
import { locationStrToArr } from '../utils/location.utils.js'

import { fetchStore, updateStore, createStore } from '../controller/store.js'
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

/** Fetch own store */
router.get('/', async (req, res, next) => {
  try {
    let query = { ownerId: req.user._id }
    const storeId = await fetchStore(query)
    res.status(200).send({ _id: storeId._id })
  } catch (err) {
    next(err)
  }
})

/** Fetch specific store */
router.get('/:storeId', async (req, res, next) => {
  try {
    let query = { _id: req.query.storeId }
    const storeId = await fetchStore(query)
    res.status(200).send({ _id: storeId._id })
  } catch (err) {
    next(err)
  }
})

/** Update own store */
router.put('/', loggedInArea, updateStore)

/** Create store */
router.post('/', loggedInArea, async (req, res, next) => {
  try {
    req.body.ownerId = req.user._id
    if (!req.body.ownerId) {
      throw new Error('User id not valid')
    }
    if (req.body.locations) {
      req.body.locations = locationStrToArr(req.body.locations)
    }
    const storeId = await createStore(req.body)
    res.status(201).send({ _id: storeId._id })
  } catch (err) {
    console.log(err)
    next(err)
  }
})

export default router
