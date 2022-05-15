import express from 'express'
import passport from 'passport'
import fs from 'fs'
import path from 'path'

import debug from '../utils/logger.js'
import { locationStrToArr } from '../utils/location.utils.js'
import { uploadProfile } from '../utils/multer.utils.js'
import { listServices } from '../controller/service.ctrl.js'

import {
  fetchStore,
  updateStore,
  createStore,
  deleteStore,
} from '../controller/store.ctrl.js'
import { authArea } from '../middleware/auth.middleware.js'
import { filterStorePublicFields } from '../validation/store.validation.js'

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

router.get('/:storeId/services', async (req, res, next) => {
  debug.info("Fetch Store's services")
  try {
    let services = await listServices(
      { storeId: req.params.storeId },
      { 'photos.data': 0 },
    )
    res.status(200).send(services)
  } catch (err) {
    next(err)
  }
})

/** Fetch own store */
router.get('/', authArea, async (req, res, next) => {
  debug.info('Fetch own Store')

  try {
    let query = { ownerId: req.user._id }
    let storeData = await fetchStore(query)
    storeData.photo = {}
    storeData = filterStorePublicFields(storeData)
    res.status(200).send(storeData)
  } catch (err) {
    next(err)
  }
})

router.delete('/', authArea, async (req, res, next) => {
  debug.info('Delete Store')

  try {
    await deleteStore(req.user._id)
    res.status(200).send({ message: 'Store successfully deleted.' })
  } catch (err) {
    next(err)
  }
})

/** Fetch specific store */
router.get('/:storeId', async (req, res, next) => {
  debug.info('Fetch Store')

  try {
    let query = { id: req.query.storeId }
    let storeData = await fetchStore(query)
    storeData.photo = {}
    storeData = filterStorePublicFields(storeData)
    res.status(200).send(storeData)
  } catch (err) {
    next(err)
  }
})

/** Update own store */
router.put(
  '/',
  authArea,
  uploadProfile.single('photo'),
  async (req, res, next) => {
    debug.info('Update Store')
    try {
      req.body.ownerId = req.user._id
      // console.log(req)
      console.log(req.body)
      console.log(req.file)
      if (req.file) {
        // req.body.photo = req.file.filename
        req.body.photo = {
          data: fs.readFileSync(
            path.join(__dirname + '/uploads/profile/' + req.file.filename),
          ),
          contentType: 'image/png',
        }
      }
      if (req.body.location) {
        req.body.location = locationStrToArr(req.body.location)
      }

      await updateStore(req.body)
      res.status(200).send({ message: 'Store updated successfully' })
    } catch (err) {
      next(err)
    }
  },
)

/** Create store */
router.post(
  '/',
  authArea,
  uploadProfile.single('photo'),
  async (req, res, next) => {
    debug.info('Create Store')
    try {
      req.body.ownerId = req.user._id
      console.log(req.file)
      if (req.file) {
        if (!req.file.filename)
          throw { error: 'File was not uploaded correctly', status: 400 }
        req.body.photo = {
          filename: req.file.filename,
          data: fs.readFileSync(
            path.join(__dirname + '/uploads/profile/' + req.file.filename),
          ),
          contentType: req.file.mimetype,
        }
      }
      if (!req.body.ownerId) {
        throw new Error('User id not valid')
      }
      if (req.body.location) {
        req.body.location = locationStrToArr(req.body.location)
      }
      const storeId = await createStore(req.body)
      res.status(201).send({ _id: storeId._id })
    } catch (err) {
      next(err)
    }
  },
)

export default router
