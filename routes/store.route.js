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
import {
  filterStorePublicFields,
  convertOpeningHoursToJson,
} from '../validation/store.validation.js'

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

/*********************/
/* ROUTES START HERE */
/*********************/

const _fetchStoreService = async (req, res, next) => {
  debug.info("Fetch Store's services")
  try {
    let services = await listServices(
      { store_id: req.params.store_id },
      { 'photos.data': 0 },
    )
    res.status(200).send(services)
  } catch (err) {
    next(err)
  }
}
const _fetchOwnStore = async (req, res, next) => {
  debug.info('Fetch own Store')

  try {
    let query = { owner_id: req.user._id }
    let storeData = await fetchStore(query)
    storeData.photo = {}
    storeData = filterStorePublicFields(storeData)
    res.status(200).send(storeData)
  } catch (err) {
    next(err)
  }
}

const _deleteStore = async (req, res, next) => {
  debug.info('Delete Store')

  try {
    await deleteStore(req.user._id)
    res.status(200).send({ message: 'store deleted successfully', status: 200 })
  } catch (err) {
    next(err)
  }
}

const _fetchSpecificStore = async (req, res, next) => {
  debug.info('Fetch Store')

  try {
    let query = { id: req.query.store_id }
    let storeData = await fetchStore(query)
    storeData.photo = {}
    storeData = filterStorePublicFields(storeData)
    res.status(200).send(storeData)
  } catch (err) {
    next(err)
  }
}

const _updateOwnStore = async (req, res, next) => {
  debug.info('Update Store')
  try {
    req.body.owner_id = req.user._id
    req.body.opening_hours = convertOpeningHoursToJson(req.body.opening_hours)

    // console.log(req)
    // console.log(req.body)
    // console.log(req.file)
    if (req.file) {
      // req.body.photo = req.file.filename
      req.body.photo = {
        data: fs.readFileSync(
          path.join(__dirname + '/uploads/profile/' + req.file.filename),
        ),
        content_type: 'image/png',
      }
    }
    if (req.body.location) {
      req.body.location = locationStrToArr(req.body.location)
    }

    await updateStore(req.body)
    res.status(200).send({ message: 'store updated successfully', status: 200 })
  } catch (err) {
    try {
      fs.unlinkSync(
        path.join(__dirname + '/uploads/profile/' + req.file.filename),
      )
    } catch (e) {
      debug.info('Could not cleanup uploaded image')
    }
    next(err)
  }
}

const _createStore = async (req, res, next) => {
  debug.info('Create Store')
  req.body.opening_hours = convertOpeningHoursToJson(req.body.opening_hours)

  try {
    req.body.owner_id = req.user._id
    // console.log(req.file)
    if (req.file) {
      if (!req.file.filename)
        throw { error: 'File was not uploaded correctly', status: 400 }
      req.body.photo = {
        filename: req.file.filename,
        data: fs.readFileSync(
          path.join(__dirname + '/uploads/profile/' + req.file.filename),
        ),
        content_type: req.file.mimetype,
      }
    }
    if (!req.body.owner_id) {
      throw new Error('User id not valid')
    }
    if (req.body.location) {
      req.body.location = locationStrToArr(req.body.location)
    }
    const storeId = await createStore(req.body)
    res.status(201).send({
      message: 'store created successfully',
      store_id: storeId._id,
      status: 201,
    })
  } catch (err) {
    try {
      fs.unlinkSync(
        path.join(__dirname + '/uploads/profile/' + req.file.filename),
      )
    } catch (e) {
      debug.info('Could not cleanup uploaded image')
    }
    next(err)
  }
}

router.get('/:store_id/services', _fetchStoreService)
router.get('/', authArea, _fetchOwnStore)
router.delete('/', authArea, _deleteStore)
router.get('/:store_id', _fetchSpecificStore)
router.put('/', authArea, uploadProfile.single('photo'), _updateOwnStore)
router.post('/', authArea, uploadProfile.single('photo'), _createStore)

export default router
