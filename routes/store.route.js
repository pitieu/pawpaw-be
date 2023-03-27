import express from 'express'

import debug from '../utils/logger.js'
import { uploadProfile } from '../utils/multer.utils.js'

import { listServices } from '../controller/service.ctrl.js'
import { fetchStore, updateStore } from '../controller/store.ctrl.js'

import * as AuthMiddleware from '../middleware/auth.middleware.js'
import {
  filterStorePublicFields,
  convertOpeningHoursToJson,
} from '../validation/store.validation.js'

const router = express.Router()

router.use(AuthMiddleware.initialize)
router.use(AuthMiddleware.session)

router.get('/:store_id/services', fetchStoreServiceHandler)
router.get('/', AuthMiddleware.authArea, fetchOwnStoreHandler)
router.get('/:store_id', fetchSpecificStoreHandler)
router.put(
  '/',
  AuthMiddleware.authArea,
  uploadProfile.single('photo'),
  updateOwnStoreHandler,
)

const fetchStoreServiceHandler = async (req, res, next) => {
  try {
    let services = await listServices(
      { store_id: req.params.store_id },
      { 'photos.data': 0 },
    )
    res.json(services)
  } catch (err) {
    next(err)
  }
}

const fetchOwnStoreHandler = async (req, res, next) => {
  try {
    let query = { owner_id: req.user._id }
    let storeData = await fetchStore(query)
    storeData = filterStorePublicFields(storeData)
    res.json(storeData)
  } catch (err) {
    next(err)
  }
}

const fetchSpecificStoreHandler = async (req, res, next) => {
  try {
    let query = { id: req.query.store_id }
    let storeData = await fetchStore(query)
    storeData = filterStorePublicFields(storeData)
    res.json(storeData)
  } catch (err) {
    next(err)
  }
}

const updateOwnStoreHandler = async (req, res, next) => {
  try {
    req.body.owner_id = req.user._id
    req.body.opening_hours = convertOpeningHoursToJson(req.body.opening_hours)

    await updateStore(req.body)
    res.json({ message: 'store updated successfully', status: 200 })
  } catch (err) {
    next(err)
  }
}

export default router
