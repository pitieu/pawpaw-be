import express from 'express'
import passport from 'passport'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()
import debug from '../utils/logger.js'
import { locationStrToArr } from '../utils/location.utils.js'

import { fetchStore, updateStore, createStore } from '../controller/store.js'
import { loggedInArea } from '../middleware/auth.js'

import imgModel from '../model/ImageModel.js'

const router = express.Router()

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
    cb(null, 'uploads/profile')
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e6),
    )
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1e6 }, // limit size to 1 Mb
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
router.post(
  '/',
  [upload.single('photo'), loggedInArea],
  async (req, res, next) => {
    try {
      req.body.ownerId = req.user._id
      if (req.file) {
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
      console.log(err)
      next(err)
    }
  },
)

export default router
