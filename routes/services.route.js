import express from 'express'
import passport from 'passport'
import fs from 'fs'
import path from 'path'

import {
  fetchService,
  listServices,
  addService,
  updateService,
  deleteService,
  listServiceCategories,
} from '../controller/service.ctrl.js'
import { fetchStore } from '../controller/store.ctrl.js'
import { convertOpeningHoursToJson } from '../validation/service.validation.js'
import { authArea } from '../middleware/auth.middleware.js'
import { uploadServices } from '../utils/multer.utils.js'
import debug from '../utils/logger.js'

const router = express.Router()

const __dirname = path.resolve()

router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (obj, done) {
  done(null, obj)
})

const _createService = async (req, res, next) => {
  try {
    const hasAStore = await fetchStore({ owner_id: req.user._id })
    if (!hasAStore)
      throw {
        error: 'needs to create a store before it can create a service',
        status: 400,
      }

    if (req.files) {
      let photos = []
      req.files.forEach((file) => {
        photos.push({
          filename: file.filename,
          data: fs.readFileSync(
            path.join(__dirname + '/uploads/services/' + file.filename),
          ),
          content_type: file.mimetype,
        })
      })
      req.body.photos = photos
    }
    req.body.opening_hours = convertOpeningHoursToJson(req.body.opening_hours)

    let products = []
    req.body.products.forEach((product) => {
      product.price = parseInt(product.price)
      products.push(product)
    })
    req.body.products = products

    let productAddons = []
    req.body.product_addons.forEach((product) => {
      product.price = parseInt(product.price)
      productAddons.push(product)
    })
    req.body.product_addons = productAddons
    req.body.price_per_km = parseInt(req.body.price_per_km)
    req.body.negotiable_hours_rate = parseInt(req.body.negotiable_hours_rate)
    req.body.negotiable_hours = req.body.negotiable_hours == 'true'
    const newService = await addService(req.body, req.user._id)

    res.status(201).send({
      status: 201,
      message: 'service created successfully',
      service_id: newService._id,
    })
  } catch (err) {
    next(err)
  }
}

const _fetchService = async (req, res, next) => {
  try {
    let service = await fetchService(
      { _id: req.params.service_id },
      { 'photos.data': 0 },
    )
    res.status(200).send(service)
  } catch (err) {
    next(err)
  }
}

const _listServiceCategories = async (req, res, next) => {
  try {
    debug.info('List Categories')
    const categories = await listServiceCategories({})
    res.status(200).send({ categories: categories })
  } catch (err) {
    next(err)
  }
}

router.post('/', authArea, uploadServices.array('photos', 5), _createService)
router.get('/:service_id/', _fetchService)
router.put('/:service_id', authArea, updateService)
router.delete('/:service_id', authArea, deleteService)
router.get('/category/list', _listServiceCategories)

export default router
