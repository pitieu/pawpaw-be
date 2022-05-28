import express from 'express'
import passport from 'passport'

import debug from '../utils/logger.js'
import { uploadProfile } from '../utils/multer.utils.js'
import { listServices } from '../controller/service.ctrl.js'

import { fetchStore, updateStore } from '../controller/store.ctrl.js'
import { authArea } from '../middleware/auth.middleware.js'
import {
  filterStorePublicFields,
  convertOpeningHoursToJson,
} from '../validation/store.validation.js'

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
    storeData = filterStorePublicFields(storeData)
    res.status(200).send(storeData)
  } catch (err) {
    next(err)
  }
}

const _fetchSpecificStore = async (req, res, next) => {
  debug.info('Fetch Store')

  try {
    let query = { id: req.query.store_id }
    let storeData = await fetchStore(query)
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

    await updateStore(req.body)
    res.status(200).send({ message: 'store updated successfully', status: 200 })
  } catch (err) {
    next(err)
  }
}

router.get('/:store_id/services', _fetchStoreService)
router.get('/', authArea, _fetchOwnStore)
router.get('/:store_id', _fetchSpecificStore)
router.put('/', authArea, uploadProfile.single('photo'), _updateOwnStore)

export default router
