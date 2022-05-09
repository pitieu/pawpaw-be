import express from 'express'
import passport from 'passport'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()
import debug from '../utils/logger.js'
import { locationStrToArr } from '../utils/location.utils.js'

import {
  fetchStore,
  updateStore,
  createStore,
  deleteStore,
} from '../controller/store.js'
import { loggedInArea } from '../middleware/auth.js'
import { filterStorePublicFields } from '../validation/store.js'

const router = express.Router()

const UPLOAD_FOLDER = 'uploads/profile'

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER)
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e6),
    )
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 1 }, // limit size to 1 Mb
  fileFilter: fileFilter,
})

/** Fetch own store */
router.get('/', loggedInArea, async (req, res, next) => {
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

router.delete('/', loggedInArea, async (req, res, next) => {
  try {
    await deleteStore(req.user._id)
    res.status(200).send({ message: 'Store successfully deleted.' })
  } catch (err) {
    next(err)
  }
})

/** Fetch specific store */
router.get('/:storeId', async (req, res, next) => {
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
  loggedInArea,
  upload.single('photo'),
  async (req, res, next) => {
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
      if (req.body.locations) {
        req.body.locations = locationStrToArr(req.body.locations)
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
  loggedInArea,
  upload.single('photo'),
  async (req, res, next) => {
    try {
      req.body.ownerId = req.user._id
      if (req.file) {
        // Todo: fix upload profile picture
        req.body.photo = {
          data: fs.readFileSync(
            path.join(__dirname + '/uploads/profile/' + req.file.filename),
          ),
          contentType: 'image/png',
        }
      }
      if (!req.body.ownerId) {
        throw new Error('User id not valid')
      }
      if (req.body.locations) {
        req.body.locations = locationStrToArr(req.body.locations)
      }
      const storeId = await createStore(req.body)
      res.status(201).send({ _id: storeId._id })
    } catch (err) {
      next(err)
    }
  },
)

export default router
